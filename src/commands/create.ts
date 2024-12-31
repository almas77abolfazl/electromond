import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

export function createProject(projectName: string) {
  const projectPath = path.join(process.cwd(), projectName);
  if (fs.existsSync(projectPath)) {
    console.error(`Project ${projectName} already exists.`);
    return;
  }

  fs.mkdirSync(projectPath, { recursive: true });
  fs.mkdirSync(path.join(projectPath, "src"), { recursive: true });
  fs.mkdirSync(path.join(projectPath, "src", "components"));
  fs.mkdirSync(path.join(projectPath, "src", "components", "example"));

  // ساخت فایل‌ها
  writePackageJson(projectPath, projectName);
  writeTsConfig(projectPath);
  writeGitIgnore(projectPath);
  writeMainFile(projectPath);
  writePreloadFile(projectPath);
  writeIndexHtml(projectPath);
  writeStyles(projectPath);
  writeExampleComponent(projectPath);

  execSync("npm install", { cwd: projectPath, stdio: "inherit" });

  console.log(`Project ${projectName} created successfully!`);
}

// نوشتن فایل package.json
function writePackageJson(projectPath: string, projectName: string) {
  const content = {
    name: projectName,
    version: "1.0.0",
    main: "dist/main.js",
    scripts: {
      start: "electromond start", // فراخوانی فریمورک
      build: "electromond build",
    },
    dependencies: {
      electromond: "latest",
    },
    devDependencies: {
      typescript: "^5.0.0",
    },
  };
  fs.writeFileSync(
    path.join(projectPath, "package.json"),
    JSON.stringify(content, null, 2)
  );
}

// نوشتن فایل tsconfig.json
function writeTsConfig(projectPath: string) {
  const content = {
    compilerOptions: {
      target: "ES6",
      module: "CommonJS",
      outDir: "./dist",
      rootDir: "./src",
      strict: true,
    },
    include: ["src/**/*"],
  };
  fs.writeFileSync(
    path.join(projectPath, "tsconfig.json"),
    JSON.stringify(content, null, 2)
  );
}

// نوشتن فایل .gitignore
function writeGitIgnore(projectPath: string) {
  const content = `
node_modules
dist
`;
  fs.writeFileSync(path.join(projectPath, ".gitignore"), content);
}

// نوشتن فایل src/main.ts
function writeMainFile(projectPath: string) {
  const content = `
import { app, BrowserWindow } from 'electron';

let mainWindow: BrowserWindow | null;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile('src/index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});
`;
  fs.writeFileSync(path.join(projectPath, "src", "main.ts"), content.trim());
}

// نوشتن فایل src/main.ts
function writePreloadFile(projectPath: string) {
  const content = `
import { renderComponents } from "./utils/component-registry";

// Render components dynamically
window.addEventListener("DOMContentLoaded", () => {
  const appElement = document.getElementById("app");
  if (appElement) {
    renderComponents(appElement);
  }
});
`;
  fs.writeFileSync(path.join(projectPath, "src", "preload.js"), content.trim());
}

// نوشتن فایل src/index.html
function writeIndexHtml(projectPath: string) {
  const content = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Electromond App</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h1>Welcome to Electromond!</h1>
  <div id="app"></div>
  <script src="dist/bundle.js"></script>
</body>
</html>
`;
  fs.writeFileSync(path.join(projectPath, "src", "index.html"), content.trim());
}

// نوشتن فایل src/styles.css
function writeStyles(projectPath: string) {
  const content = `
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f4f4f4;
}

h1 {
  color: #333;
  text-align: center;
  margin-top: 20px;
}
`;
  fs.writeFileSync(path.join(projectPath, "src", "styles.css"), content.trim());
}

// نوشتن کامپوننت نمونه
function writeExampleComponent(projectPath: string) {
  const componentDir = path.join(projectPath, "src", "components", "example");
  fs.writeFileSync(
    path.join(componentDir, "example.ts"),
    `import { Component } from '../decorators/component.decorator';

@Component({
  selector: 'app-example',
  template: './example.html',
  styles: ['./example.css'],
})
export class ExampleComponent {
  
}`.trim()
  );
  fs.writeFileSync(
    path.join(componentDir, "example.html"),
    `<div class="example">Example Component Loaded!</div>`
  );
  fs.writeFileSync(
    path.join(componentDir, "example.css"),
    `.example { color: blue; font-size: 18px; }`
  );
}
