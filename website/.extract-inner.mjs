import { readFile, writeFile } from "node:fs/promises";

const lines = (await readFile(".layout-chunk-debug.js", "utf8")).split(/\r?\n/);
for (const lineNumber of [40, 51]) {
  const line = lines[lineNumber - 1];
  const marker = "__webpack_require__.ts(";
  const markerIndex = line.indexOf(marker);
  if (markerIndex < 0) continue;
  const start = line.indexOf('"', markerIndex + marker.length);
  let end = start + 1;
  let escaped = false;
  for (; end < line.length; end++) {
    if (escaped) escaped = false;
    else if (line[end] === "\\") escaped = true;
    else if (line[end] === '"') break;
  }
  const source = JSON.parse(line.slice(start, end + 1));
  const file = `.gsap-inner-${lineNumber}.js`;
  await writeFile(file, source);
  console.log(`${file}: ${source.length} chars`);
}
