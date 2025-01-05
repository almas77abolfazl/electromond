import { registerComponent } from "../utils/component-registry";

interface ComponentOptions {
  selector: string;
  template: string;
  styles: string;
  events?: { [event: string]: string };
}

export function Component(options: ComponentOptions) {
  return function (constructor: any) {
    registerComponent(options.selector, options.template, options.styles, constructor);


    const originalConstructor = constructor;

    function newConstructor(...args: any[]) {
      const instance = new originalConstructor(...args);

      if (options.events) {
        for (const [event, method] of Object.entries(options.events)) {
          const element = document.querySelector(options.selector);
          if (element) {
            element.addEventListener(event, (e) => {
              instance[method](e);
            });
          }
        }
      }

      return instance;
    }

    return newConstructor;
  };
}
