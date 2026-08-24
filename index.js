/**
*	@typedef {{
* 		Link: string;
*   	Name: string;
*   	Details: string | null;
*   	Details_ja: string | null;
*   	EstimatedTime: number | null;
*   	Languages: string[] | null;
* 	}} Repo
*/
import {createClient} from "https://esm.sh/@supabase/supabase-js@2";
const supabaseUrl = "https://iardacsuwzgfjsdefqdj.supabase.co";
const supabaseKey = "sb_publishable_aqniMrzHTzhEWxbSpBopeA_4SyoQ8mJ";
const supabaseClient = createClient(supabaseUrl, supabaseKey);
/** @type {Repo[]} */
let cachedRepos = [];
/** @param {Repo[]} repos */
function renderRepositories(repos) {
	if (repos.length === 0) {
		return;
	}
	else {
		const lang = document.documentElement.lang;
	    const repoList = document.getElementById("repoList");
	    repoList.innerHTML = repos.map(repo => {
	      	const details = (lang === 'ja' && repo.Details_ja) ? repo.Details_ja : repo.Details;
	      	const unit = lang === 'ja' ? '時間' : (repo.EstimatedTime === 1 ? 'Hour' : 'Hours');
	      	const hiddenLanguages = ["PLpgSQL"];
	      	return `
		        <div class="repo-div">
		          <h3 class="repo-name">
		            <a href="${repo.Link}" target="_blank">${repo.Name}</a>
		            <span class="repo-time">
		              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
		                <circle cx="12" cy="12" r="10"></circle>
		                <path d="M12 6v6l4 2"></path>
		              </svg>${repo.EstimatedTime} ${unit}
		            </span>
		          </h3>
		          <p class="repo-desc">${details ?? ""}</p>
		          <div class="repo-languages">
		            ${(repo.Languages ?? []).filter(language => !hiddenLanguages.includes(language)).map(language => {
		            	const ClassName = language.toLowerCase().replace("#", "sharp");
		                return `
		                	<span class="repo-badge ${ClassName}">${language}</span>
		                `;
		            })
		            .join("")}
		          </div>
		        </div>
		    `;
		})
		.join("");
	}
}
async function loadRepositories() {
	const {data, error} = await supabaseClient.from("Repositories").select("*").order("DisplayOrder");
  	if (error) {
    	return console.error(error);
  	}
  	else {
    	cachedRepos = data ?? [];
    	renderRepositories(cachedRepos);
  	}
}
document.querySelector(".theme-button")?.addEventListener("click", () => {
	const html = document.documentElement;
	html.dataset.theme = html.dataset.theme === "dark" ? "light" : "dark";
});
window.addEventListener("load", async () => {
	const loading = document.getElementById("loadingAssets");
	document.querySelectorAll('[data-en][data-ja]').forEach(translatable => {
		const English = /** @type {HTMLElement} */ (translatable);
    	English.textContent = English.dataset.en;
  	});
	await Promise.race([
		loadRepositories(),
		new Promise(resolve => setTimeout(resolve, 2000))
	]);
	loading.style.opacity = "0";
	setTimeout(() => {
    	document.body.classList.remove("loadingBarrier");
    	loading.remove();
  	}, 500);
});
document.addEventListener('DOMContentLoaded', () => {
	const dropdown = /** @type {HTMLElement} */ (document.querySelector(".translate-dropdown"));
	const toggleBtn = /** @type {HTMLButtonElement} */ (dropdown.querySelector(".translate-button"));
	const menuButtons = /** @type {NodeListOf<HTMLButtonElement>} */ (dropdown.querySelectorAll(".translate-menu button"));
  	toggleBtn.addEventListener('click', (mouseClicked) => {
		mouseClicked.stopPropagation();
		dropdown.classList.toggle("open");
  	});
  	document.addEventListener('click', () => {
    	dropdown.classList.remove('open');
  	});
  	menuButtons.forEach((button) => {
    	button.addEventListener('click', () => {
	      	const lang = button.dataset.lang;
	      	setLanguage(lang);
	      	dropdown.classList.remove('open');
    	});
  	});
	/** @param {string} lang */
	function setLanguage(lang) {
    	document.documentElement.lang = lang;
    	menuButtons.forEach(button => {
      		button.toggleAttribute('data-active', button.dataset.lang === lang);
    	});
    	document.querySelectorAll('[data-en][data-ja]').forEach(translatable => {
      		const Selected = /** @type {HTMLElement} */ (translatable);
      		Selected.textContent = Selected.dataset[lang];
		});
    	renderRepositories(cachedRepos);
  	}
});
const avatar = document.querySelector(".profile img");
const modal = document.getElementById("imagePreview");
function openPreview() {
	modal.classList.add("show");
  	requestAnimationFrame(() => {
		avatar.classList.add("open");
  	});
  	document.body.style.overflow = "hidden";
}
function closePreview() {
  	modal.classList.remove("show");
  	avatar.classList.remove("open");
  	document.body.style.overflow = "";
}
if (/Mobi|Android|iPad/i.test(navigator.userAgent)) {
  	modal.style.visibility = "hidden";
  	openPreview();
  	setTimeout(() => {
    	closePreview();
    	modal.style.visibility = "";
  	}, 150);
}
avatar.addEventListener("click", openPreview);
modal.addEventListener("click", closePreview);