import fs from "fs";

export function copyTemplate(originPath: string, destination: string) {
  if (!fs.existsSync(originPath)) {
    console.error(`Template ${originPath} not found.`);
    return;
  }
  fs.copyFileSync(originPath, destination);
}
