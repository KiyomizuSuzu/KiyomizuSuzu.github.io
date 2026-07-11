// @ts-ignore
import {createClient} from "jsr:@supabase/supabase-js@2";
/**
* @param {{
*    commit: {
*     author: {
*       date: string
*     }
*   }
* }[]} commits
*/
function calculateGitHours(commits) {
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
async function getAllCommits(repoName) {
  let allCommits = [];
  let page = 1;
  while (true) {
    const res = await fetch(
      `https://api.github.com/repos/KiyomizuSuzu/${repoName}/commits?per_page=100&page=${page}`,
      {
        headers: {
          // @ts-ignore
          Authorization: `Bearer ${Deno.env.get("GITHUB_TOKEN")}`,
          Accept: "application/vnd.github+json",
        },
      }
    );
    if (!res.ok) break;
    const data = await res.json();
    if (data.length === 0) break;
    allCommits.push(...data);
    if (data.length < 100) break;
    page++;
  }
  return allCommits;
}
export default {
  /** @param {Request} _req */
  async fetch(_req) {
    // @ts-ignore
    const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));
    const res = await fetch("https://api.github.com/users/KiyomizuSuzu/repos", {
                              headers: {
                                // @ts-ignore
                                Authorization: `Bearer ${Deno.env.get("GITHUB_TOKEN")}`,
                                Accept: "application/vnd.github+json",
                              },
                          }
    );
    if (!res.ok) {
      return Response.json({error: "Failed to fetch GitHub repositories"},
                           {status: 500}
                        );
    }
    else {
      /** @type {{
      *   id: number,
      *   name: string,
      *   html_url: string,
      *   description: string | null,
      *   created_at: string
      * }[]}
      */
      const repos = await res.json();
      const githubIds = repos.map(repo => repo.id);
      const formatted = await Promise.all(
        repos.map(async (repo) => {
          const commits = await getAllCommits(repo.name);
          const estimatedTime = calculateGitHours(commits);
          return {
            ID: repo.id,
            Name: repo.name,
            Link: repo.html_url,
            Details: repo.description,
            DisplayOrder: repo.created_at,
            CommitCount: commits.length,
            EstimatedTime: estimatedTime
          };
        })
      );
      const {error: upsertError} = await supabase.from("Repositories").upsert(formatted, {onConflict: "ID" });
      const {data: existingRepos, error: selectError} = await supabase.from("Repositories").select("ID");
      if (upsertError) {
        return Response.json({error: upsertError.message},
                            {status: 500}
                          );
      }
      else if (selectError) {
        return Response.json({error: selectError.message},
                            {status: 500}
                          );
      }
      else {
        /** @type {{ 
        *   ID: number 
        * }[]}
        */
        const existingRows = existingRepos ?? [];
        const existingIds = existingRows.map(repo => repo.ID);
        const idsToDelete = existingIds.filter(id => !githubIds.includes(id));
        try {
          if (idsToDelete.length > 0) {
            const {error: deleteError} = await supabase.from("Repositories").delete().in("ID", idsToDelete);
            if (deleteError) {
              return Response.json({error: deleteError.message},
                                  {status: 500}
                                );
            }
          }
          throw new Error();
        }
        catch {
          return Response.json({synced: formatted.length,
                                deleted: idsToDelete.length
                            });
        }
      }
    }
  }
};