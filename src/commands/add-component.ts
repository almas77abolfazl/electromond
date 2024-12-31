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

  // کپی قالب‌های پیش‌فرض
  copyTemplate(
    "component.html",
    path.join(componentPath, `${componentName}.html`)
  );
  copyTemplate(
    "component.css",
    path.join(componentPath, `${componentName}.css`)
  );
  copyTemplate("component.ts", path.join(componentPath, `${componentName}.ts`));

  console.log(`Component ${componentName} created successfully!`);
}
