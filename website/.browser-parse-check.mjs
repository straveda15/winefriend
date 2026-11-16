import { readFile } from "node:fs/promises";

const tabs = await (await fetch("http://127.0.0.1:9228/json/list")).json();
const page = tabs.find((tab) => tab.type === "page");
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve) => ws.addEventListener("open", resolve, { once: true }));
let id = 0;
const pending = new Map();
ws.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data);
  if (message.id && pending.has(message.id)) {
    pending.get(message.id)(message.result);
    pending.delete(message.id);
  }
});
const send = (method, params = {}) => new Promise((resolve) => {
  const requestId = ++id;
  pending.set(requestId, resolve);
  ws.send(JSON.stringify({ id: requestId, method, params }));
});
await send("Runtime.enable");
const checks = [];
for (const file of [".gsap-inner-40.js", ".gsap-inner-51.js"]) {
  const source = await readFile(file, "utf8");
  const response = await send("Runtime.evaluate", {
    expression: `(() => { try { new Function(${JSON.stringify(source)}); return 'parse ok'; } catch (error) { return error.stack; } })()`,
    returnByValue: true,
  });
  checks.push({ file, result: response?.result?.value });
}
console.log(JSON.stringify(checks));
ws.close();
