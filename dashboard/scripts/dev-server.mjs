import net from "node:net";
import { spawn } from "node:child_process";
import process from "node:process";

const preferredPort = Number(process.env.PORT) || 3001;

function isPortAvailable(port) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", (error) => {
      server.close();
      if (error.code === "EADDRINUSE") resolve(false);
      else reject(error);
    });
    server.listen(port, "::", () => {
      server.close((error) => (error ? reject(error) : resolve(true)));
    });
  });
}

let port = preferredPort;
while (!(await isPortAvailable(port))) port += 1;

if (port !== preferredPort) {
  console.log(`Port ${preferredPort} is busy; starting the dashboard on ${port}.`);
}

const nextBin = process.platform === "win32" ? "next.cmd" : "next";
const child = spawn(nextBin, ["dev", "--port", String(port)], {
  env: process.env,
  stdio: "inherit",
  shell: process.platform === "win32",
});

child.once("error", (error) => {
  console.error("Could not start Next.js:", error);
  process.exitCode = 1;
});

child.once("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exitCode = code ?? 1;
});
