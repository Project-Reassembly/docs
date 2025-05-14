/** Maps origin to path from it to the wiki's index. The default is the origin.*/
let roots = null;
//Main page version
async function goto(page) {
  if (!roots)
    roots = await import("../definitions/roots.json", {
      with: { type: "json" },
    });
  msg("goto request: '" + page + "'");
  let search = new URLSearchParams(location.search);
  search.has("page") ? search.set("page", page) : search.append("page", page);
  if (page === "home")
    location = location.origin + (roots[location.origin] ?? "");
  else location.search = search;
  msg("Page url is " + location.href);
  loadSelectedPage();
}
async function onPageLoad() {
  msg("Main page ready.");
  loadSelectedPage();
}
function loadSelectedPage() {
  if (location.search.length > 0) {
    let destination =
      new URLSearchParams(location.search).get("page") ?? "error404";
    msg("Moving iframe to '" + destination + "'");
    loadIntoMainIframe(destination, document);
  } else {
    loadIntoMainIframe("home");
    msg("Sending iframe home");
  }
}
