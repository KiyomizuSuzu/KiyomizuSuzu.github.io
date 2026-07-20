import {createClient} from "jsr:@supabase/supabase-js@2";
interface GithubCommit {
  commit: {
    author: {
      date: string;
    };
  };
}
interface GithubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  created_at: string;
}
interface FormattedRepo {
  ID: number;
  Name: string;
  Link: string;
  Details: string | null;
  DisplayOrder: string;
  CommitCount: number;
  EstimatedTime: number;
  Languages: string[];
}
interface ExistingRepoRow {
  ID: number;
}
function calculateGitHours(commits: GithubCommit[]): number {
  if (!commits.length) {
    return 0;
  }
  else {
    const times = commits.map(github => new Date(github.commit.author.date).getTime()).sort((a, b) => a - b);
    const SESSION_GAP = 30 * 60 * 1000;
    const MIN_SESSION = 15 * 60 * 1000;
    let total = 0;
    let sessionStart = times[0];
    let previous = times[0];
    for (let i = 1; i < times.length; i++) {
      const current = times[i];
      if (current - previous > SESSION_GAP) {
        total += Math.max(previous - sessionStart, MIN_SESSION);
        sessionStart = current;
      }
      previous = current;
    }
    total += Math.max(previous - sessionStart, MIN_SESSION);
    return +(total / 3600000).toFixed(2);
  }
}
async function getAllCommits(repoName: string): Promise<GithubCommit[]> {
  const allCommits: GithubCommit[] = [];
  let page = 1;
  while (true) {
    const res = await fetch(`https://api.github.com/repos/KiyomizuSuzu/${repoName}/commits?per_page=100&page=${page}`, {
                              headers: {
                                Authorization: `Bearer ${Deno.env.get("GITHUB_TOKEN")}`,
                                Accept: "application/vnd.github+json",
                              },
                            }
                        );
    if (!res.ok) {
      throw new Error("Failed to fetch GitHub commits");
    }
    else {
      const data = await res.json();
      allCommits.push(...data);
      if (data.length < 100) {
        break;
      }
      else {
        page++;
      }
    }
  }
  return allCommits;
}
async function getLanguages(repoName: string): Promise<string[]> {
  const res = await fetch(`https://api.github.com/repos/KiyomizuSuzu/${repoName}/languages`, {
                            headers: {
                              Authorization: `Bearer ${Deno.env.get("GITHUB_TOKEN")}`,
                              Accept: "application/vnd.github+json",
                            },
                          }
                      );
  if (!res.ok) {
    return [];
  }
  else {
    const languages = await res.json();
    return Object.keys(languages);
  }
}
export default {
  async fetch(_req: Request): Promise<Response> {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const res = await fetch("https://api.github.com/users/KiyomizuSuzu/repos", {
                              headers: {
                                Authorization: `Bearer ${Deno.env.get("GITHUB_TOKEN")}`,
                                Accept: "application/vnd.github+json",
                              },
                            }
                        );
    if (!res.ok) {
      return Response.json({error: "Failed to fetch GitHub repositories"}, {
                            status: 500}
                      );
    }
    else {
      const repos: GithubRepo[] = await res.json();
      const githubIds = repos.map(repo => repo.id);
      const formatted: FormattedRepo[] = await Promise.all(
        repos.map(async (repo) => {
          const [commits, languages] = await Promise.all([getAllCommits(repo.name),
                                                          getLanguages(repo.name)
                                                    ]);
          return {
            ID: repo.id,
            Name: repo.name,
            Link: repo.html_url,
            Details: repo.description,
            DisplayOrder: repo.created_at,
            CommitCount: commits.length,
            EstimatedTime: calculateGitHours(commits),
            Languages: languages
          }
        })
      );
      const {error: upsertError} = await supabase.from("Repositories").upsert(formatted, {onConflict: "ID" });
      const {data: existingRepos, error: selectError} = await supabase.from("Repositories").select("ID");
      if (upsertError) {
        return Response.json({error: upsertError.message}, {
                              status: 500}
                        );
      }
      else if (selectError) {
        return Response.json({error: selectError.message}, {
                              status: 500}
                        );
      }
      else {
        const existingRows: ExistingRepoRow[] = existingRepos ?? [];
        const existingIds = existingRows.map(repo => repo.ID);
        const idsToDelete = existingIds.filter(id => !githubIds.includes(id));
        try {
          if (idsToDelete.length > 0) {
            const {error: deleteError} = await supabase.from("Repositories").delete().in("ID", idsToDelete);
            if (deleteError) {
              return Response.json({error: deleteError.message}, {
                                    status: 500}
                              );
            }
          }
          throw new Error();
        }
        catch {
          return Response.json({synced: formatted.length,
                                deleted: idsToDelete.length}
                          );
        }
      }
    }
  }
}