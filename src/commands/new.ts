import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { logSuccess } from "../utils/cli-utils";
import { addComponent } from "./add-component";

export function createProject(projectName: string) {
  const projectPath = path.join(process.cwd(), projectName);
  if (fs.existsSync(projectPath)) {
    console.error(`Project ${projectName} already exists.`);
    return;
  }

  fs.mkdirSync(projectPath, { recursive: true });
  fs.mkdirSync(path.join(projectPath, "main", "actions"), { recursive: true });
  fs.mkdirSync(path.join(projectPath, "main", "config"), { recursive: true });
  fs.mkdirSync(path.join(projectPath, "main", "utils"), { recursive: true });
  fs.mkdirSync(path.join(projectPath, "renderer", "components"), { recursive: true });
  fs.mkdirSync(path.join(projectPath, "renderer", "services"), { recursive: true });
  fs.mkdirSync(path.join(projectPath, "renderer", "pages"), { recursive: true });
  fs.mkdirSync(path.join(projectPath, "renderer", "assets"), { recursive: true });

  // ایجاد فایل‌های اصلی
  writePackageJson(projectPath, projectName);
  writeElectronBuilderConfig(projectPath);
  writeTsConfig(projectPath);
  writeGitIgnore(projectPath);
  writeMainIndex(projectPath);
  writeRendererIndexHtml(projectPath);
  writeRendererMainCss(projectPath);
  writeMainConfig(projectPath);
  writeCreateWindowAction(projectPath);
  execSync("npm install", { cwd: projectPath, stdio: "inherit" });
  const componentPath = path.join(projectPath, "renderer", "components", "app");
  addComponent("app", componentPath);
  logSuccess(`Project ${projectName} created successfully!`);
}

// فایل‌های موردنظر برای هر بخش را به ترتیب ایجاد می‌کنیم:

// فایل package.json
function writePackageJson(projectPath: string, projectName: string) {
  const content = {
    name: projectName,
    version: "1.0.0",
    main: "dist/main.js",
    scripts: {
      start: "electromond start",
      build: "electromond build",
    },
    dependencies: {
      electromond: "^0.0.7",
      electron: "^26.0.0",
    },
    devDependencies: {
      typescript: "^5.0.0",
    },
  };
  fs.writeFileSync(path.join(projectPath, "package.json"), JSON.stringify(content, null, 2));
}

// فایل electron-builder.json
function writeElectronBuilderConfig(projectPath: string) {
  const content = {
    appId: "com.example.electromond",
    directories: {
      output: "dist",
    },
    files: ["main/**/*", "renderer/**/*"],
  };
  fs.writeFileSync(path.join(projectPath, "electron-builder.json"), JSON.stringify(content, null, 2));
}

// فایل tsconfig.json
function writeTsConfig(projectPath: string) {
  const content = {
    compilerOptions: {
      target: "ES6",
      module: "CommonJS",
      outDir: "./dist",
      rootDir: "./",
      strict: true,
    },
    include: ["**/*"],
  };
  fs.writeFileSync(path.join(projectPath, "tsconfig.json"), JSON.stringify(content, null, 2));
}

// فایل .gitignore
function writeGitIgnore(projectPath: string) {
  const content = `
node_modules
dist
`;
  fs.writeFileSync(path.join(projectPath, ".gitignore"), content.trim());
}

// فایل main/index.ts
function writeMainIndex(projectPath: string) {
  const content = `
import { app, BrowserWindow } from "electron";
import { createWindow } from "./actions/createWindow";

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
`;
  fs.writeFileSync(path.join(projectPath, "main", "index.ts"), content.trim());
}

// فایل main/actions/createWindow.ts
function writeCreateWindowAction(projectPath: string) {
  const content = `
import * as path from "path";
import { BrowserWindow } from "electron";

export function createWindow() {
  let mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile("../renderer/index.html");

  mainWindow.on("closed", () => {
   
  });
}
`;
  fs.writeFileSync(path.join(projectPath, "main", "actions", "createWindow.ts"), content.trim());
}

// فایل main/config/config.ts
function writeMainConfig(projectPath: string) {
  const content = `
export const config = {
  appName: "Electromond",
  version: "1.0.0",
};
`;
  fs.writeFileSync(path.join(projectPath, "main", "config", "config.ts"), content.trim());
}


function writeRendererIndexHtml(projectPath: string) {
  const content = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Electromond App</title>
  <link rel="stylesheet" href="main.css">
</head>
<body>
  <h1>Welcome to Electromond</h1>
  <div id="app">
   <app-root></app-root>
   </div>
</body>
</html>
`;
  fs.writeFileSync(path.join(projectPath, "renderer", "index.html"), content.trim());
}

function writeRendererMainCss(projectPath: string) {
  const content = ``;
  fs.writeFileSync(path.join(projectPath, "renderer", "main.css"), content.trim());
}
