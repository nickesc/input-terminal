import { readFileSync, writeFileSync, existsSync, unlinkSync } from "node:fs";
import { Resvg } from "@resvg/resvg-js";

const input = "docs/icon.svg";
const output = "site/capsule.png";

if (existsSync(output)) {
  unlinkSync(output);
}

// Preserve the previous svg2png output size (2048x1024).
const svg = readFileSync(input, "utf8").replace(
  /<svg\b([^>]*)>/,
  '<svg$1 width="2048" height="1024">',
);
const png = new Resvg(svg).render().asPng();
writeFileSync(output, png);
