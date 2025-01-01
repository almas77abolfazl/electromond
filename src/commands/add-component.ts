import fs from "fs";
import path from "path";
import { copyTemplate } from "../utils/index";

export function addComponent(componentName: string) {
  const componentPath = path.join(
    process.cwd(),
    "src",
    "components",
    componentName
  );

  if (fs.existsSync(componentPath)) {
    console.error(`Component ${componentName} already exists.`);
    return;
  }

  fs.mkdirSync(componentPath, { recursive: true });

  const htmlPath = path.join(__dirname, "../templates", "component.html");

  // کپی قالب‌های پیش‌فرض
  copyTemplate(htmlPath, path.join(componentPath, `${componentName}.html`));

  const cssPath = path.join(__dirname, "../templates", "component.html");
  copyTemplate(cssPath, path.join(componentPath, `${componentName}.css`));

  const tsPath = path.join(__dirname, "../templates", "component.html");
  copyTemplate(tsPath, path.join(componentPath, `${componentName}.ts`));

  console.log(`Component ${componentName} created successfully!`);
}
