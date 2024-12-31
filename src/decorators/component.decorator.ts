import { registerComponent } from "../utils/index";


interface ComponentOptions {
  selector: string;
  template: string;
  styles: string;
}

export function Component(options: ComponentOptions) {
  return function (constructor: any) {
    registerComponent(
      options.selector,
      options.template,
      options.styles,
      constructor
    );
  };
}
