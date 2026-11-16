const tabs = await (await fetch("http://127.0.0.1:9228/json/list")).json();
const page = tabs.find((tab) => tab.type === "page");
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve) => ws.addEventListener("open", resolve, { once: true }));
let id = 0;
const pending = new Map();
const errors = [];
const logs = [];
ws.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data);
  if (message.method === "Runtime.exceptionThrown") errors.push(message.params.exceptionDetails);
  if (message.method === "Runtime.consoleAPICalled") logs.push(message.params.args?.map((arg) => arg.value ?? arg.description).join(" "));
  if (message.method === "Log.entryAdded") logs.push(message.params.entry.text);
  if (message.id && pending.has(message.id)) {
    const resolve = pending.get(message.id);
    pending.delete(message.id);
    resolve(message.result);
  }
});
const send = (method, params = {}) => new Promise((resolve) => {
  const requestId = ++id;
  pending.set(requestId, resolve);
  ws.send(JSON.stringify({ id: requestId, method, params }));
});
await send("Runtime.enable");
await send("Log.enable");
await send("Page.enable");
await send("Page.navigate", { url: `http://localhost:3000/?intro-diag=${Date.now()}` });
await new Promise((resolve) => setTimeout(resolve, 7500));
const result = await send("Runtime.evaluate", {
  expression: `(() => { const probe = document.querySelector('.wf-home-intro-font-probe'); return { url: location.href, ready: document.readyState, probe: Boolean(probe), reactKeys: Object.keys(probe?.parentElement ?? {}).filter((key) => key.startsWith('__react')), overlay: Boolean(document.querySelector('.wf-home-intro')), rootClass: document.documentElement.className, introState: document.documentElement.dataset.wfHomeIntroComplete, font: probe && getComputedStyle(probe).font, heroOpacity: document.querySelector('.wf-hero-story') && getComputedStyle(document.querySelector('.wf-hero-story')).opacity, scripts: Array.from(document.scripts).map((script) => script.src).filter((src) => src.includes('/app/')) }; })()`,
  returnByValue: true,
});
console.log(JSON.stringify({ state: result?.result?.value, errors, logs: logs.slice(-10) }, null, 2));
ws.close();
