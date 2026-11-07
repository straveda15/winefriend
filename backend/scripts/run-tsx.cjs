const { spawn } = require("node:child_process");
const path = require("node:path");
const cliPath = require.resolve("tsx/cli");
const preloadPath = path.join(__dirname, "set-euid.cjs").replaceAll("\\", "/");
const preloadOption = `--require=${preloadPath}`;
process.env.NODE_OPTIONS = [process.env.NODE_OPTIONS, preloadOption].filter(Boolean).join(" ");

const child = spawn(process.execPath, [cliPath, ...process.argv.slice(2)], { stdio: "inherit", env: process.env });
child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 1);
});
