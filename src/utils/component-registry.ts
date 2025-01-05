const components: Record<string, { template: string; styles: string; logic: any }> = {};

export function registerComponent(selector: string, template: string, styles: string, logic: any) {
  components[selector] = { template, styles, logic };
}

export function renderComponents() {
  Object.keys(components).forEach((selector) => {
    const { template, styles, logic } = components[selector];
    const element = document.querySelector(selector);
    if (element) {
      element.innerHTML = template;
      const styleTag = document.createElement("style");
      styleTag.innerHTML = styles;
      document.head.appendChild(styleTag);
      new logic(element);
    }
  });
}
