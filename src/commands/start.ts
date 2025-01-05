import { execSync, spawn } from "child_process";
import electron from "electron";
import * as fs from "fs";
import * as path from "path";
import { log, logError, logSuccess } from "../utils/cli-utils";
import { copyTemplate } from "../utils/file-utils";

export function startProject() {
  log("Starting project...");

  log("Compiling TypeScript files...");
  try {
    execSync("tsc", { stdio: "inherit" });
  } catch (error: any) {
    logError("Error compiling TypeScript files: " + error.message);
    return;
  }

  log("Parsing components...");
  const distPath = path.join(process.cwd(), "dist");

  const rendererPath = path.join(process.cwd(), "renderer");
  const distRendererPath = path.join(distPath, "renderer");

  const mainHtmlPath = path.join(rendererPath, "index.html");
  const mainCssPath = path.join(rendererPath, "main.css");

  const distHtmlPath = path.join(distRendererPath, `index.html`);
  const distCssPath = path.join(distRendererPath, `main.css`);

  copyTemplate(mainHtmlPath, distHtmlPath);
  copyTemplate(mainCssPath, distCssPath);

  if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath, { recursive: true });
  }

  const mainHtmlContent = fs.readFileSync(mainHtmlPath, "utf-8");

  const jsBundle: string[] = [];
  const cssBundle: string[] = [];

  const processComponent = (html: string): string => {
    return html.replace(/<([\w-]+)[^>]*><\/\1>/g, (match, selector) => {
      selector = selector.includes("-") ? selector.split("-")[1] : selector;
      selector = selector == "root" ? "app" : selector;

      const componentPath = path.join(rendererPath, "components", selector);

      if (!fs.existsSync(componentPath)) {
        console.warn(`Component ${selector} not found.`);
        return match;
      }

      const htmlFile = path.join(componentPath, `${selector}.component.html`);
      const cssFile = path.join(componentPath, `${selector}.component.css`);
      const tsFile = path.join(componentPath, `${selector}.component.ts`);

      const cssContent = fs.existsSync(cssFile) ? `${fs.readFileSync(cssFile, "utf-8")}` : "";
      console.log(cssContent);

      cssBundle.push(cssContent);

      let jsContent = "";

      if (fs.existsSync(tsFile)) {
        try {
          const compiledJsPath = path.join(distRendererPath, "components", selector, `${selector}.component.js`);

          jsBundle.push(jsContent);
        } catch (err) {
          console.error(`Error compiling ${tsFile}:`, err);
        }
      }

      const htmlContent = fs.existsSync(htmlFile) ? fs.readFileSync(htmlFile, "utf-8") : "";
      const processedHtml = processComponent(htmlContent);

      return `${processedHtml}`;
    });
  };

  const finalHtml = processComponent(mainHtmlContent);

  fs.writeFileSync(distHtmlPath, finalHtml);

  const addTagToHtml = (htmlPath: string, tag: string) => {
    const htmlContent = fs.readFileSync(htmlPath, "utf-8");
    const updatedHtml = htmlContent.replace(/<\/head>/, `  ${tag}\n</head>`);
    fs.writeFileSync(htmlPath, updatedHtml);
  };

  if (cssBundle.length) {
    const distOtherCssPath = path.join(distRendererPath, `other-styles.css`);
    fs.writeFileSync(distOtherCssPath, cssBundle.join("\n"));
    const tag = `<link rel="stylesheet" href="other-styles.css">`;
    addTagToHtml(distHtmlPath, tag);
  }
  if (jsBundle.length) {
    fs.writeFileSync(path.join(distRendererPath, "components.js"), jsBundle.join("\n"));
    const tag = `<script src="components.js"></script>`;
    addTagToHtml(distHtmlPath, tag);
  }

  log("Starting Electron...");
  const mainFile = path.join(distPath, "main", "index.js");

  if (!fs.existsSync(mainFile)) {
    logError("Main file not found. Make sure it is built correctly.");
    return;
  }

  const electronPath = electron.toString();
  const electronProcess = spawn(electronPath, [mainFile], { stdio: "inherit" });
  electronProcess.on("close", (code) => {
    if (code === 0) {
      logSuccess("Project started successfully.");
    } else {
      logError(`Electron exited with code ${code}.`);
    }
  });
  electronProcess.on("error", (err) => {
    logError("Failed to start Electron: " + err);
  });
}
