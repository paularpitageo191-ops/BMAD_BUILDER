# Testing Hive Playwright Runner

This repository is the execution-side runner for Testing Hive.

## Purpose

The orchestrator app generates:
- Gherkin-aligned scenarios
- executable Playwright/TypeScript tests
- run metadata

This repo stores and executes those generated tests through Jenkins.

## Default stack

- Framework: Playwright
- Language: TypeScript
- Reporting: JUnit XML + Playwright HTML/JSON
- Healing workflow: human-in-the-loop with feature branches

## Layout

- `tests/generated/`
  Generated executable tests
- `tests/gherkin/`
  Source-of-truth Gherkin artifacts
- `test-results/`
  JUnit and JSON reports
- `playwright-report/`
  Playwright HTML report
- `scripts/`
  Repo hygiene helpers

## Local run

```bash
npm ci
npx playwright install --with-deps chromium
npm test
```

## Jenkins

This repo includes a `Jenkinsfile` that:
1. checks out the repo
2. installs dependencies
3. installs Playwright browser binaries
4. runs the generated test suite
5. publishes JUnit XML and archives reports
