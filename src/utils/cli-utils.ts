export function log(message: string) {
  console.log(message);
}

export function logSuccess(message: string) {
  console.log(`\x1b[32m%s\x1b[0m`, message); // سبز
}

export function logError(message: string) {
  console.error(`\x1b[31m%s\x1b[0m`, message); // قرمز
}
