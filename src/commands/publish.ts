import { execSync } from "child_process";

export function publishProject() {
  execSync("npm run build", { stdio: "inherit" });
  console.log("Desktop app built successfully!");
}
