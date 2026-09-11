import os from "node:os";

export const config = {
  databasePath: `${os.homedir()}/.compeer/atlas/database`,
  artifactsPath: `${os.homedir()}/.compeer/atlas/artifacts`,
  logPath: `${os.homedir()}/.compeer/atlas/logs`,
};
