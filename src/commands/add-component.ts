import fs from "fs";
import path from "path";
import { logError, logSuccess } from "../utils/index";

export function addComponent(componentName: string) {
  const componentPath = path.join(
    process.cwd(),
    "renderer",
    "components",
    componentName
  );

  if (fs.existsSync(componentPath)) {
    logError(`Component ${componentName} already exists.`);
    return;
  }

  const tsContent = `
import { Component } from "electromond";

@Component({
  selector: "app-${componentName}",
  template: "./${componentName}.html",
  styles: "./${componentName}.css",
})
export class ${
    String(componentName).charAt(0).toUpperCase() +
    String(componentName).slice(1)
  }Component {}
`;
  fs.writeFileSync(
    path.join(componentPath, componentName + ".ts"),
    tsContent.trim()
  );

  const htmlContent = `<div>${componentName} is working..</div>`;
  fs.writeFileSync(
    path.join(componentPath, componentName + ".html"),
    htmlContent.trim()
  );

  const cssContent = ``;
  fs.writeFileSync(
    path.join(componentPath, componentName + ".css"),
    cssContent.trim()
  );

  logSuccess(`Component ${componentName} created successfully!`);
}
