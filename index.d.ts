declare module "electromond" {
  export function Component(config: { selector: string; template: string; styles: string; events?: { [event: string]: string } }): ClassDecorator;
}
