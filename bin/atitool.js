#!/usr/bin/env node
"use strict";
const fs = require("fs");
const path = require("path");
const app = require("../src/app");
const reporters = require("../src/reporters/index");
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
    .name("ATITool")
    .version("0.0.1")
    .option(
      "-s, --standard <standard>",
      "Standard to analyze: Section508, WCAG2A, WCAG2AA, WCAG2AAA",
      "WCAG2AA"
    )
    .option(
      "-r, --reporter <reporter name>",
      "Reporter to use as output: CLI, JSON or HTML",
      "CLI"
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

async function loadConfigurations() {
  const configFolder = path.join(__dirname, "..", "config");
  let configurations = {};
  for (const file of fs.readdirSync(configFolder)) {
    try {
      const jsonString = fs.readFileSync(path.join(configFolder, file));
      const jsonData = JSON.parse(jsonString);
      configurations[file.replace(".json", "")] = jsonData;
    } catch (e) {
      throw new Error(`Configuration reading failed: ${e}`);
    }
  }
  return configurations;
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
  let reporter = reporters.getReporter(options.reporter);
  if (reporter == null) {
    console.error("Critical Error: Reporter Not found");
    return;
  }

  const sortOrder = (e1, e2) => {
    const typeOrder = ["error", "warning", "notice"];
    const ord1 = typeOrder.indexOf(e1.type);
    const ord2 = typeOrder.indexOf(e2.type);
    if (ord1 < ord2) return -1;
    if (ord1 > ord2) return 1;
    return 0;
  };

  return loadConfigurations()
    .then((configurations) => {
      return app.run(options.url, options.standard, {
        reporter: reporter,
        config: configurations,
      });
    })
    .then(buildTypeFilter(!options.notice, "notice"))
    .then(buildTypeFilter(!options.warning, "warning"))
    .then(buildTypeFilter(!options.error, "error"))
    .then((results) => results.sort(sortOrder))
    .then((results) => {
      reporter.reportFrom(results, options);
    })
    .catch((err) => {
      reporter.reportError(err.message);
    });
}
