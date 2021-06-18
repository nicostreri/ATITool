#!/usr/bin/env node
"use strict";
const app = require("../src/app");
const cliReport = require("../src/reporters/CLIReport");

analyzeArguments();
runApp();

/**
 * Parse the flags and arguments passed to the CLI
 * @return {void}
 */
function analyzeArguments() {
  //TODO Parse the flags and arguments passed to the CLI
}

/**
 * Run the accessibility test on the page and generate the results
 */
async function runApp() {
  app
    .run("https://google.com", "WCAG2A", {
      reporter: cliReport,
    })
    .then((results) => {
      results = results.filter((result) => {
        return result.type != "notice";
      });
      cliReport.reportFrom(results);
    })
    .catch((err) => {
      cliReport.reportError(err.message);
    });
}
