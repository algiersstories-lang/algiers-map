const fs = require("fs");
const fetch = require("node-fetch");

const SHEET_URL = "https://opensheet.elk.sh/1VXIKnUOE_k9W195-BjsM1fX-HvC5B7GD7Zd0blubEwY/markers";

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
}

async function generate() {

  const res = await fetch(SHEET_URL);
  const data = await res.json();
  const template = fs.readFileSync("template.html", "utf8");

  if (!fs.existsSync("places")) fs.mkdirSync("places");

  data.forEach(place => {

    if ((place.status || "").toLowerCase() !== "published") return;

    const slug = slugify(place.name);
    const fileName = `places/${slug}.html`;

    // External link block
    let externalBlock = "";
    if (place.external_link) {
      externalBlock = `
        <div class="external">
          <strong>Learn more:</strong><br>
          <a href="${place.external_link}" target="_blank">
            ${place.external_link}
          </a>
        </div>
      `;
    }

    let html = template
      .replaceAll("{{name}}", place.name || "")
      .replaceAll("{{short_desc}}", place.description || "")
      .replaceAll("{{long_description}}", place.long_description || "")
      .replaceAll("{{image1}}", place.image1 || "")
      .replaceAll("{{image2}}", place.image2 || "")
      .replaceAll("{{geography}}", place.geography || "")
      .replaceAll("{{history}}", place.history || "")
      .replaceAll("{{architecture}}", place.architecture || "")
      .replaceAll("{{external_link_block}}", externalBlock);

    fs.writeFileSync(fileName, html);

    console.log("Generated:", fileName);

  });

}

generate();