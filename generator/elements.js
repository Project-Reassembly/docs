class InfoComponent extends HTMLElement {
  static styles = `
      .info-container .info-img{
        height: calc(var(--box-width) / 2);
        image-rendering: pixelated;
      }
      .info-container .small-info-img{
        height: calc(var(--box-width) / 5);
        image-rendering: pixelated;
      }
      .info-container {
        border: 1px solid black;
        width: var(--box-width);
        display: flex;
        flex-direction: column;
        align-items: center;
        font-family: var(--main-font);
        text-align: center;
        vertical-align: middle;
        max-height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        height: 100%;
        background-color: var(--table-bg-colour);
        scrollbar-width: thin;
      }
      .info-container .header, .info-container .body{
        width: 95%;
        padding: 2.5%;
        align-items: center;
        justify-content: center;
        text-align: center;
      }
      .info-container .header{
        background-color: var(--accent-colour);
        height: var(--header-size);
        border: 2px double black;
        font-weight: bolder;
        font-size: calc(var(--header-size) * 0.625);
        position: sticky;
        top: 0;
        z-index: 1;
      }
      .info-container .body{
        background-color: var(--table-bg-colour);
      }
      .info-container .row{
        display: flex;
        flex-direction: row;
        justify-content: center;
        background-color: var(--table-item-colour);
      }
      .info-container .image{
        width: 100%;
      }
      .info-container .item{
        display: block;
        padding: 5px;
        border: 1px solid black;
      }
      .info-container .property{
        width: calc(var(--box-width) / 3);
        font-weight: bold;
        font-family: var(--main-font);
      }
      .info-container .value{
        width: calc(var(--box-width) * 2 / 3);
        font-weight: normal;
        font-family: var(--code-font);
      }
      .info-container .group-head{
        font-weight: bold;
        font-family: var(--main-font);
      }
      .info-container .extra{
        font-style: italic;
        position: relative;
      }
      .info-container .extra::before{
        content: "(...)";
        font-style: normal;
        font-size: small;
        font-family: var(--main-font);
        transform: none;
      }
      .info-container .extra:hover::after{
        content: attr(info);
        width: max-content;
        float: right;
      }
      .info-container *:hover::after{
        position: absolute;
        background-color:  var(--hover-bg-colour);
        border: 2px solid black;
        border-radius: 5px;
        translate: -75% 1.1lh;
        padding: 2px;
        z-index: 1;
        max-width: calc(var(--box-width) / 2);
      }
      .info-container .navitem{
        background-color: var(--table-item-colour);
        border: 1px solid black;
        border-radius: 5px;
        padding: 2px;
        display: flex;
        aspect-ratio: 1 / 1;
        font-size: smaller;
        flex-direction: column;
        align-items: center;
        text-decoration: none;
        color: black;
        min-width: 13%;
        max-width: 13%;
      }
      .info-container .row.nobg{
        background-color: var(--table-bg-colour);
      }
      .info-container .navitem.this{
        border: 2px solid black;
      }
      .info-container .navitem:hover{
        text-decoration: underline;
      }
      .info-container .navitem *{
        display: block;
      }
      .info-container .navitem .nav-img{
        width: 70%;
        height: auto;
        image-rendering: pixelated;
      }
      .info-container a{
        color: var(--header-colour);
        text-decoration: underline;
      }
      .info-container a:hover{
        color: var(--lighter-header-colour);
      } 
  `;
  static colourLink = `<link rel="stylesheet" href="../definitions/colours.css">`;
  static styleLink = `<link rel="stylesheet" href="./style.css">`;
  static mainContent = `<div class="info-container">
      <div class="header" id="head"></div>
      <div class="body" id="body"></div>
    </div>`;
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.createDefault();
  }
  createDefault() {
    this.shadowRoot.appendChild(htmlToNode(this.constructor.colourLink));
    this.shadowRoot.appendChild(htmlToNode(this.constructor.styleLink));
    let style = document.createElement("style");
    style.textContent = this.constructor.styles;
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(htmlToNode(this.constructor.mainContent));
  }
  setName(name = "[[Name]]") {
    this.head.innerHTML = process(name);
  }
  addSlotDetails(slot = "[[Slot]]", option = "[[Option]]", tier = "[[Tier]]") {
    this.body.appendChild(
      htmlToNode(
        `<div class="row">
      <div class="ap-info item" weapon-slot="${slot}" option="${option}" tier="${tier}"></div>
    </div>`
      )
    );
  }
  addImage(url = "./default-icon.ico") {
    this.body.appendChild(
      htmlToNode(
        `<div class="image">
      <img src="${url}" class="info-img">
    </div>`
      )
    );
  }
  addSmallImage(url = "./default-icon.ico") {
    this.body.appendChild(
      htmlToNode(
        `<div class="image">
      <img src="${url}" class="small-info-img">
    </div>`
      )
    );
  }
  addGroupTag(text = "[[Group]]") {
    this.body.appendChild(htmlToNode(`<div class="group-head">${process(text)}</div>`));
  }
  addPropertyValuePair(property = "[[Property]]", value = "[[Value]]", extras) {
    this.body.appendChild(
      htmlToNode(
        `<div class="row">
      <div class="property item">${process(property)}</div>
      <div class="value item">${process(value)}${
          extras ? `<span class="extra" info="${extras}"></span>` : ""
        }</div>
    </div>`
      )
    );
  }
  addNavigator(...items) {
    let node = htmlToNode(`<div class="row nobg"></div>`);
    for (let item of items) {
      node.appendChild(
        htmlToNode(
          `<a class="navitem${item.this ? " this" : ""}" onclick="load('${
            item.url
          }')"><img src="${
            item.image ?? "./default-icon.ico"
          }" class="nav-img">${process(item.text) ?? item.url ?? "[[NO LINK]]"}</a>`
        )
      );
    }
    this.body.appendChild(node);
  }
  get head() {
    return (
      this.shadowRoot.getElementById("head") ??
      this.shadowRoot.firstChild ??
      this.shadowRoot
    );
  }
  get body() {
    return (
      this.shadowRoot.getElementById("body") ??
      this.shadowRoot.firstChild ??
      this.shadowRoot
    );
  }
}
class GeneratedInfoComponent extends InfoComponent {
  constructor() {
    super();
    this.setName("[[Weapon Name]]");
  }
  connectedCallback() {
    let observer = new MutationObserver((list, observer) =>
      this.mutated(list, observer)
    );
    observer.observe(this, { childList: true });
  }
  mutated(list, observer) {
    for (let mutation of list) {
      if (mutation.type === "childList") {
        if (mutation.addedNodes.length > 0) {
          this.parseInfo(mutation.addedNodes[0].textContent);
          mutation.addedNodes[0].textContent = "";
        }
      }
    }
  }
  parseInfo(para) {
    let lines = para.split("|");
    for (let line of lines) {
      this.parseLine(line.trim());
    }
  }
  parseLine(line) {
    if (!line) return;
    let parts = line.split(" : ");
    let main = parts[0];
    if (parts.length < 2) {
      this.addGroupTag(main);
    } else {
      if (main === "[[navigator]]" || main === "[[navigator*]]") {
        let navitems = (main === "[[navigator*]]"?getComponent(parts[1]):parts[1]).split(" + ");
        let parsed = [];
        for (let item of navitems) {
          let navparts = item.split("@");
          if (navparts.length === 1) {
            parsed.push({ url: navparts[0] });
            continue;
          }
          if (navparts.length === 2) {
            let parts2 = navparts[1].split("~");
            if (parts2.length === 1)
              parsed.push({
                text: navparts[0],
                url: navparts[1],
              });
            if (parts2.length === 2)
              parsed.push({
                text: navparts[0],
                url: parts2[0],
                image: parts2[1],
              });
          }
        }
        this.addNavigator(
          ...parsed.map((x) => {
            if (!x.url) return x;
            if (window.location.href.includes(x.url)) {
              x.this = true;
            }
            return x;
          })
        );
        return;
      }
      if (main === "[[slots]]") {
        this.addSlotDetails(...parts[1].split("-"));
        return;
      }
      if (main === "[[image]]") {
        this.addImage(parts[1]);
        return;
      }
      if (main === "[[i]]") {
        this.addSmallImage(parts[1]);
        return;
      }
      if (main === "{{name}}") {
        this.setName(parts[1]);
        return;
      }
      let parts2 = parts[1].split(" # ");
      if (parts2.length === 1) this.addPropertyValuePair(main, parts[1]);
      if (parts2.length === 2)
        this.addPropertyValuePair(main, parts2[0], parts2[1]);
    }
  }
}

customElements.define("info-box", GeneratedInfoComponent);

class SearchBarElement extends HTMLElement {
  static style = `
  /* Search Bar */
  input[type="search"]::after{
    content: "🔎";
  }
  input[type="search"]{
    width: 60%;
    height: 40px;
    background-color: darkblue;
    color: white;
    font-size: 30px
  }
  button{
    width: 75px;
    height: 40px;
    background-color: darkblue;
    color: white;
    font-size: 20px;
  }`;
  constructor() {
    super();
  }
  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(htmlToNode(InfoComponent.styleLink));
    this.shadowRoot.appendChild(
      htmlToNode("<style>" + SearchBarElement.style + "</style>")
    );
    this.shadowRoot.appendChild(
      htmlToNode('<script src="search.js"></script>')
    );
    let input = document.createElement("input");
    input.type = "search";
    input.title = "Search for a page";
    let searchButton = document.createElement("button");
    searchButton.type = "submit";
    searchButton.innerText = "Search";
    searchButton.onclick = () => SearchBarElement.searched(input.value);
    this.shadowRoot.appendChild(input);
    this.shadowRoot.appendChild(searchButton);
  }
  static searched(term) {
    getPageData().then((value) => {
      this.showResults(searchFor(term, value), term);
    });
  }
  static showResults(results, term) {
    let newrl =
      new URL("./search-results.html", window.location) +
      "?result=" +
      encodeURIComponent(JSON.stringify(results)) +
      "&query=" +
      encodeURIComponent(term) +
      (window.location.href.includes("search-results.html")
        ? "&source=" +
          encodeURIComponent(document.getElementById("return").href)
        : "&source=" + encodeURIComponent(window.location.href));
    window.location.href = newrl;
  }
}
class IconElement extends HTMLElement {
  static observedAttributes = ["icon"];
  static icons = {
    integrate: "./images/icon/integrate.png|Integratable: This type of content can be added directly with Integrate.",
    "partial-integrate": "./images/icon/partial-integrate.png|Integratable: This type does not directly support Integrate addition, but is constructed as part of an Integratable type.",
    "not-integrate": "./images/icon/not-integrate.png|Not Integratable: Integrate does not support adding this type of content",
    "to-integrate": "./images/icon/to-integrate.png|Not Integratable: This content type will support being added by Integrate in the future, but doesn't yet. Avoid using in public mods.",
    isl: "./images/icon/isl.png|ISL Controllable: This type of content has an ISL interface.",
  };
  constructor() {
    super();
  }
  connectedCallback() {
    this.attachShadow({ mode: "open" });
    // this.shadowRoot.appendChild(htmlToNode(InfoComponent.styleLink));
    this.shadowRoot.appendChild(
      htmlToNode(`<style>.icon{height: 1em; max-height: 1em; translate: 0 0.15em;}</style>`)
    );
    let image = document.createElement("img");
    let toGrab = this.getAttribute("icon");
    let icon = IconElement.icons[toGrab];
    if (icon) {
      let parts = icon.split("|")
      image.src = parts[0];
      image.alt = image.title = parts[1] ?? "No alt text provided";
    } else {
      image.src = "./images/icon/error.png";
      image.alt = image.title = "Error loading icon '"+toGrab+"'";
    }
    image.classList.add("icon");
    this.shadowRoot.appendChild(image);
  }
}

customElements.define("search-bar", SearchBarElement);
customElements.define("i-n", IconElement);

