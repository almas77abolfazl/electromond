import { exec } from "child_process";

export function startProject() {
  console.log("Building project...");
  exec("npx webpack --config webpack.config.js", (err, stdout, stderr) => {
    if (err) {
      console.error("Error during build:", stderr);
      return;
    }
    console.log(stdout);
    console.log("Build successful. Starting Electron...");
    exec("npx electron .", (err, stdout, stderr) => {
      if (err) {
        console.error("Error starting Electron:", stderr);
        return;
      }
      console.log(stdout);
    });
  });
}
