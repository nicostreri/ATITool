#!/usr/bin/env node
"use strict";
const app = require("../src/app");
const cliReport = require("../src/reporters/CLIReport");
const { Command } = require("commander");

const invocationOptions = analyzeArguments();
runApp(invocationOptions);

/**
 * Parse the flags and arguments passed to the CLI
 * @return {Object} Invocation options
 */
function analyzeArguments() {
  const program = new Command();
  program
    .name("myapp")
    .version("0.0.1")
    .option(
      "-s, --standard <standard>",
      "Standard to analyze: Section508, WCAG2A, WCAG2AA, WCAG2AAA",
      "WCAG2AA"
    )
    .option(
      "--no-notice",
      "Remove all problems categorized as notice from the result"
    )
    .option(
      "--no-warning",
      "Remove all problems categorized as warning from the result"
    )
    .option(
      "--no-error",
      "Remove all problems categorized as error from the result"
    )
    .requiredOption("-u, --url <url>", "URL to analyze");
  program.parse(process.argv);
  return program.opts();
}

function buildTypeFilter(enable, typeToFilter) {
  if (enable) {
    return (results) => {
      return results.filter((result) => {
        return result.type != typeToFilter;
      });
    };
  } else {
    return (results) => {
      return results;
    };
  }
}

/**
 * Run the accessibility test on the page and generate the results
 */
async function runApp(options) {
  app
    .run(options.url, options.standard, {
      reporter: cliReport,
    })
    .then(buildTypeFilter(!options.notice, "notice"))
    .then(buildTypeFilter(!options.warning, "warning"))
    .then(buildTypeFilter(!options.error, "error"))
    .then(cliReport.reportFrom)
    .catch((err) => {
      cliReport.reportError(err.message);
    });
}
