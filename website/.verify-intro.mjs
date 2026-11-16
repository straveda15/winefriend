const tabs = await (await fetch("http://127.0.0.1:9228/json/list")).json();
const page = tabs.find((tab) => tab.type === "page" && tab.url.startsWith("http://localhost:3000"))
  ?? tabs.find((tab) => tab.type === "page");
if (!page) throw new Error("No verification page available");

const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let nextId = 0;
const pending = new Map();
const errors = [];
socket.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data);
  if (message.method === "Runtime.exceptionThrown") errors.push(message.params.exceptionDetails.text);
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
  }
});

function send(method, params = {}) {
  const id = ++nextId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

async function inspect() {
  const response = await send("Runtime.evaluate", {
    expression: `(() => {
      const overlay = document.querySelector('.wf-home-intro');
      const wordmark = document.querySelector('.wf-home-intro-wordmark');
      const tagline = document.querySelector('.wf-home-intro-tagline');
      const hero = document.querySelector('.wf-hero-story');
      return {
        ready: document.readyState,
        fontReady: document.fonts.check(getComputedStyle(document.querySelector('.wf-home-intro-font-probe')).font, 'WineFriend'),
        fontFamily: wordmark && getComputedStyle(wordmark).fontFamily,
        overlay: Boolean(overlay),
        logoOpacity: overlay && getComputedStyle(overlay.querySelector('.wf-home-intro-logo')).opacity,
        strokeOffset: wordmark && getComputedStyle(wordmark).strokeDashoffset,
        fillOpacity: wordmark && getComputedStyle(wordmark).fillOpacity,
        taglineOpacity: tagline && getComputedStyle(tagline).opacity,
        heroOpacity: hero && getComputedStyle(hero).opacity,
        heroImageLoaded: document.querySelector('.wf-hero-photo')?.complete,
        heroAnimationState: document.documentElement.dataset.wfHomeIntroComplete
      };
    })()`,
    returnByValue: true,
    awaitPromise: true,
  });
  return response.result.value;
}

await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await send("Page.navigate", { url: "http://localhost:3000/?intro-browser-check=1" });

const samples = [];
const started = Date.now();
let introSeen = false;
while (Date.now() - started < 16000) {
  try {
    const sample = await inspect();
    if (sample?.overlay) introSeen = true;
    if (samples.length === 0 || Date.now() - samples.at(-1).time >= 450) samples.push({ time: Date.now() - started, ...sample });
    if (introSeen && !sample.overlay && sample.heroAnimationState === "true" && sample.heroOpacity === "1") break;
  } catch {}
  await new Promise((resolve) => setTimeout(resolve, 120));
}

const final = await inspect();
const screenshot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
await import("node:fs/promises").then(({ writeFile }) => writeFile("intro-verify.png", Buffer.from(screenshot.data, "base64")));
const introSamples = samples.filter((sample) => sample.overlay).filter((_, index) => index % 2 === 0).slice(0, 5);
process.stdout.write(JSON.stringify({ introSeen, introSamples, final, errors }, null, 2));
socket.close();
