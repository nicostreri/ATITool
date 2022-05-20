"use strict";
/**
 * Note: When adding a new reporter, add export to this file.
 */
const cliReporter = require("./CLIReport");
const jsonReporter = require("./JSONReport");
const htmlReporter = require("./HTMLReport");

exports.list = [cliReporter, jsonReporter, htmlReporter];
exports.getReporter = getReporter;

/**
 * Get reporter instance
 * @param {String} reporterName The reporter name
 * @returns {Object} Reporter instance or null if not found
 */
function getReporter(reporterName = "") {
  for (let i = 0; i < this.list.length; i++) {
    const reporter = this.list[i];
    if (reporterName == reporter.name) return reporter;
  }
  return null;
}
