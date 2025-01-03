import { execSync, spawn } from "child_process";
import * as path from "path";
import * as fs from "fs";
import electron from "electron";
import { copyTemplate, log, logError, logSuccess } from "../utils/index";

export function startProject() {
  log("Starting project...");

  // Step 1: Check and compile TypeScript files
  log("Compiling TypeScript files...");
  try {
    execSync("tsc", { stdio: "inherit" });
  } catch (error: any) {
    logError("Error compiling TypeScript files: " + error.message);
    return;
  }

  // Step 2: Parse and prepare components
  log("Parsing components...");
  const rendererPath = path.join(process.cwd(), "renderer");
  const mainHtmlPath = path.join(process.cwd(), "renderer", "index.html");
  const distPath = path.join(process.cwd(), "dist");

  copyTemplate(mainHtmlPath, path.join(distPath, "renderer", `index.html`));

  if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath, { recursive: true });
  }

  const componentsPath = path.join(rendererPath, "components");
  if (fs.existsSync(componentsPath)) {
    const components = fs.readdirSync(componentsPath);
    components.forEach((component) => {
      const componentPath = path.join(componentsPath, component);
      if (fs.statSync(componentPath).isDirectory()) {
        const htmlFile = path.join(componentPath, `${component}.html`);
        const cssFile = path.join(componentPath, `${component}.css`);
        const tsFile = path.join(componentPath, `${component}.ts`);

        if (
          fs.existsSync(htmlFile) &&
          fs.existsSync(cssFile) &&
          fs.existsSync(tsFile)
        ) {
          log(`Processing component: ${component}`);

          // Read HTML, CSS, and compile TypeScript
          const htmlContent = fs.readFileSync(htmlFile, "utf-8");
          const cssContent = fs.readFileSync(cssFile, "utf-8");

          try {
            execSync(`tsc ${tsFile}`, { stdio: "inherit" });
          } catch (error: any) {
            logError(`Error compiling ${component}.ts: ` + error.message);
            return;
          }

          const compiledJsFile = path.join(
            path.dirname(tsFile),
            `${component}.js`
          );
          const jsContent = fs.existsSync(compiledJsFile)
            ? fs.readFileSync(compiledJsFile, "utf-8")
            : "";

          // Combine all into a single file
          const componentOutput = `
            <style>${cssContent}</style>
            <div>${htmlContent}</div>
            <script>${jsContent}</script>
          `;

          fs.writeFileSync(
            path.join(distPath, `${component}.rendered.html`),
            componentOutput
          );

          logSuccess(`Component ${component} rendered successfully.`);
        }
      }
    });
  }

  // Step 3: Start Electron
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
