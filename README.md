<details><summary>日本語</summary>

# KiyomizuSuzu.github.io
HTML、CSS、JavaScriptで作った個人サイト。[GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)と[Cloudflare Pages](https://pages.cloudflare.com/)の両方にデプロイしていて、バックエンドにはPostgreSQLベースの[Supabase](https://supabase.com)を使っている。
## 公開先
- GitHub Pages: https://kiyomizusuzu.github.io/
- Cloudflare Pages: https://kiyomizusuzu.pages.dev/
### GitHub Pagesの使い方
1. `(username).github.io` という名前のリポジトリを作成する。
2. リポジトリのルートに `index.html` を追加する。
3. HTML、CSS、JavaScriptでサイトを書く。
4. GitHubにpushして、GitHub Pagesが自動でビルド・公開するのを待つ。
5. ブラウザで `https://(username).github.io` を開けば確認できる。
### Cloudflare Pagesの使い方
1. https://dash.cloudflare.com からダッシュボードを開く。
2. Buildセクションに進み、Computeカテゴリを展開してWorkers & Pagesへ移動する。
3. アプリケーションを作成し、Workerとしてではなく、Pagesとしてデプロイする方法を選ぶ。
4. サイトのファイルが入ったGitHubリポジトリと連携する。
5. リポジトリを選択し、ドメイン用のプロジェクト名を設定する（後から変更不可）。
6. プロジェクトをデプロイし、Cloudflareが自動でビルドするのを待つ。
7. 発行された `https://(project-name).pages.dev` のURLでアクセスできる。
## AGPL-3.0 ライセンス
参照：https://licenses.opensource.jp/AGPL-3.0/AGPL-3.0.html

[OSI承認済み](https://opensource.org/licenses?ls=GNU+Affero+General+Public+License+version+3)のオープンソースライセンス。AGPL-3.0の条件のもとで、自由にフォーク・改変・再配布してもらって構わない。

AGPL-3.0に従う以上、対象コードは同じライセンスのまま維持する必要があり、別のライセンスへの再ライセンスはできない。また、このソフトウェアを受け取った人（購入やサービス経由も含む）には、同じライセンス条件のもとで対応するソースコードへのアクセスを提供する必要がある。

ライセンス全文は[LICENSE.txt](https://github.com/KiyomizuSuzu/Bluetooth/blob/main/LICENSE.txt)を参照。
</details>

---
<details open><summary>English</summary>

# KiyomizuSuzu.github.io
This is a personal website deployed on both [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) and [Cloudflare Pages](https://pages.cloudflare.com/) using HTML, CSS, and JavaScript, and a [Supabase](https://supabase.com) backend powered by PostgreSQL.
## Credits
- [Devicon](https://devicon.dev/) – Icons for programming languages, frameworks, and tools.
## Live sites
- GitHub Pages: https://kiyomizusuzu.github.io/
- Cloudflare Pages: https://kiyomizusuzu.pages.dev/
### How to use Github Pages
1. Create a repository named `(username).github.io`.
2. Add an `index.html` file to the root of the repository.
3. Write your website using HTML, CSS, and JavaScript.
4. Push your changes to GitHub and wait for GitHub Pages to automatically build and publish the site.
5. Open `https://(username).github.io` in your browser to view it.
### How to use Cloudflare Pages
1. Open dashboard from https://dash.cloudflare.com.
2. Head to Build section, expand Compute category and go to Workers & Pages.
3. Create an application and select method Pages to deploy, not by creating a Worker.
4. Connect your GitHub repository containing your website files.
5. Select the repository and set a project name for your domain (cannot be changed later).
6. Deploy the project and wait for Cloudflare to automatically build it.
8. Access it via the provided `https://(project-name).pages.dev` URL.
## AGPL-3.0 License
Source: https://www.gnu.org/licenses/agpl-3.0.en.html

This is an [OSI-approved](https://opensource.org/licenses?ls=GNU+Affero+General+Public+License+version+3) open-source license. Free to fork, modify, and redistribute under the terms of the AGPL-3.0.

By complying with the AGPL-3.0 license, you must keep the same license for the covered work and cannot relicense that covered part under a different license.
Anyone who receives the software (including through purchase or as a service) must also be provided access to the corresponding source code under the same license.

See the [LICENSE.txt](https://github.com/KiyomizuSuzu/KiyomizuSuzu.github.io/blob/main/LICENSE.txt) for the full license text.
</details>