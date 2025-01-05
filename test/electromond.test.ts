import { addComponent } from "../src/commands/add-component";
import { createProject } from "../src/commands/new";
import { startProject } from "../src/commands/start";

describe("CLI new project Tests", () => {
  test("should create a new project", () => {
    const projectName = "TestProject";
    createProject(projectName);
  });
});

// describe("CLI new component Tests", () => {
//   test("should create a new component", () => {
//     const componentName = "TestComponent";
//     addComponent(componentName);
//   });
// });

describe("CLI start project Tests", () => {
  test("should start project", () => {
    startProject();
  });
});
