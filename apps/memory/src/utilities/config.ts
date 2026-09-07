import os from "node:os";

export const config = {
  databasePath: `${os.homedir()}/.compeer/memory/databases`,
  logPath: `${os.homedir()}/.compeer/memory/logs`,
};
