import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templatesPath = path.join(__dirname, "../templates");

export function copyTemplate(templateName: string, destination: string) {
  const templatePath = path.join(templatesPath, templateName);
  if (!fs.existsSync(templatePath)) {
    console.error(`Template ${templateName} not found.`);
    return;
  }
  fs.copyFileSync(templatePath, destination);
}
