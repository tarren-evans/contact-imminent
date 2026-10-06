const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const out = path.join(root, "www");

const files = [
  "index.html",
  "game.js",
  "styles.css",
  "manifest.webmanifest",
  "sw.js"
];

const directories = [
  "assets",
  "maps",
  "terrain"
];

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

for (const file of files) {
  fs.copyFileSync(
    path.join(root, file),
    path.join(out, file)
  );
}

for (const directory of directories) {
  fs.cpSync(
    path.join(root, directory),
    path.join(out, directory),
    { recursive: true }
  );
}

console.log("Contact Imminent staged successfully to www/");
