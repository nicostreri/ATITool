"use strict";
const chalk = require("chalk");

exports.reportFrom = reportFrom;
exports.reportError = error;
exports.reportWarning = warning;
exports.reportInfo = info;

const typeMap = {
  error: chalk.red,
  warning: chalk.yellow,
  notice: chalk.blue,
};

/**
 * Prints accesibility results on the CLI
 * @param {Array} results Array of accesibility results
 * @returns {void}
 */
function reportFrom(results) {
  if (results.length == 0) {
    console.log(chalk.green("No accessibility issues found"));
    return;
  }
  console.log(chalk.yellow("Accessibility issues were found:"));
  results.forEach((result) => {
    console.log(
      `${typeMap[result.type](
        result.type.toUpperCase() + " " + result.code
      )}: ${result.message}. In ${result.element}`
    );
  });
}

/**
 * Print a Error message on the CLI
 * @param {String} msg Error message to display
 * @return {void}
 */
function error(msg) {
  console.log(chalk.bgRed.black.bold("Error:") + " " + chalk.red(msg));
}

/**
 * Print a Warning message on the CLI
 * @param {String} msg Warning message to display
 * @return {void}
 */
function warning(msg) {
  console.log(chalk.bgYellow.black.bold("Warning:") + " " + msg);
}

/**
 * Print a message on the CLI
 * @param {String} msg Message to display
 * @return {void}
 */
function info(msg) {
  console.log(chalk.blue.bold("Info:") + " " + msg);
}
