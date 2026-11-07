// tsx's Windows startup path falls back to os.userInfo() when geteuid is absent.
// Provide the username before tsx loads so restricted user profiles can still run it.
if (typeof process.geteuid !== "function") {
  process.geteuid = () => process.env.USERNAME || "winefriend";
}
