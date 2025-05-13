addEventListener("DOMContentLoaded", waitForCreatorToFinish);
function waitForCreatorToFinish() {
  let i = 0;
  i = setInterval(() => {
    if (generalInfo.name !== "") {
      msg("creator ready: commencing construction");
      clearInterval(i);
      makePageIcons();
      registerIcons();
      if (document.title === "index") {
        msg("making index page:");
        constructNavbar();
      }
    } else msg("waiting for creator... ");
  }, 45);
}
function makePageIcons() {
  msg("modifying page " + location.href);
  /**@type {NodeList} */
  let lnk = document.head.querySelectorAll("link[rel=icon]");
  msg("found " + lnk.length + " link icons");
  if (lnk)
    lnk.forEach((x) => {
      if (x.href) {
        msg("set icon to " + generalInfo.icon);
        x.href = generalInfo.icon;
      }
    });
}
async function constructNavbar() {
  msg("setting large icon and name");
  document.getElementById("return-home-icon").src = generalInfo.icon;
  document.getElementById("name-big").textContent = generalInfo.name;
  let navhost = document.getElementById("generated-nav-bar");
  let nbdef = await importer("../definitions/navbar.def", "nav category");
  msg("constructing navbar");
  for (let navcat in nbdef) {
    msg(" category " + navcat);
    let category = nbdef[navcat];
    let links = [];
    for (let item in category) {
      msg(" item " + item);
      let id = category[item];
      msg("  leads to " + id);
      links.push(makeItemHtml(item, id));
    }
    navhost.appendChild(htmlToNode(makeCategoryHTML(navcat, links)));
  }
}
function registerIcons() {
  msg("registering defined icons");
  for(let ico in icons){
    let iconurl = icons[ico];
    IconElement.icons[ico] = iconurl;
  }
}
function makeHeaderHTML(name) {
  return `
        <div class="nav header">
          ${name}
        </div>`;
}
function makeCategoryHTML(name, items) {
  return `
        <details role="menu" class="nav category" name="category">
          <summary>${process(name)}</summary>
          ${items.join("\n")}
        </details>`;
}
function makeItemHtml(name, id) {
  return `
          <a role="menuitem" tabindex="0" class="nav item" onclick='goto("${makeSafe(id)}")'>
            <span>${process(name)}</span>
          </a>`;
}
