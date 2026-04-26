export async function open(url: URL) {
  const urlString = url.toString();
  let command: string[];

  switch (process.platform) {
    case "darwin":
      command = ["open", urlString];
      break;
    case "win32":
      command = ["cmd", "/c", "start", "", urlString];
      break;
    default:
      command = ["xdg-open", urlString];
  }

  const processResult = Bun.spawn(command, {
    stdout: "ignore",
    stderr: "pipe",
  });
  const stderr = await new Response(processResult.stderr).text();
  const exitCode = await processResult.exited;

  if (exitCode !== 0) {
    console.error("Failed to open URL:", urlString);
    if (stderr.trim()) {
      console.error(stderr.trim());
    }
    process.exit(1);
  }
}
