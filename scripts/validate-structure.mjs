import { existsSync } from "node:fs";

const requiredPaths = [
  "tests/generated",
  "tests/gherkin",
  "playwright.config.ts",
  "client-profile.json",
  "Jenkinsfile"
];

const missing = requiredPaths.filter((path) => !existsSync(path));

if (missing.length) {
  console.error(`Missing required repo paths: ${missing.join(", ")}`);
  process.exit(1);
}

console.log("Runner repo structure looks good.");
