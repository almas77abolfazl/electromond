#!/usr/bin/env node
import { createProject } from "../dist/commands/new.js";
import { addComponent } from "../dist/commands/add-component.js";
import { startProject } from "../dist/commands/start.js";
import { publishProject } from "../dist/commands/publish.js";

const args = process.argv.slice(2);

switch (args[0]) {
  case "new":
    createProject(args[1]);
    break;
  case "add-component":
    addComponent(args[1]);
    break;
  case "start":
    startProject();
    break;
  case "publish":
    publishProject();
    break;
  default:
    console.log(
      "Invalid command. Use new, add-component, start, or publish."
    );
}
