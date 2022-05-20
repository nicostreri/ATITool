"use strict";
const Mustache = require("mustache");
const fs = require("fs");
const path = require("path");

exports.name = "HTML";
exports.reportFrom = reportFrom;
exports.reportError = error;
exports.reportWarning = warning;
exports.reportInfo = info;

let logs = [];

const count = (arr, condition) => arr.filter(condition).length; //From https://stackoverflow.com/a/47923307/8087406

/**
 * Prints accesibility results on the CLI in JSON Format
 * @param {Array} results Array of accesibility results
 * @param {Any} options
 * @returns {void}
 */
function reportFrom(results, options) {
  const viewData = {
    url: options.url,
    date: Date(),
    errorCount: count(results, (r) => r.type == "error"),
    warningCount: count(results, (r) => r.type == "warning"),
    noticeCount: count(results, (r) => r.type == "notice"),
    results: results,
    logs: logs,
  };
  const templateString = fs.readFileSync(
    path.join(__dirname, "htmlTemplate.mustache"),
    "utf8"
  );
  const renderedTemplate = Mustache.render(templateString, viewData);
  console.log(renderedTemplate);
  logs = [];
}

function _addMessage(msg, type) {
  logs.push(type + " (" + Date() + "): " + msg);
}

/**
 * @param {String} msg Error message to display
 * @return {void}
 */
function error(msg) {
  _addMessage(msg, "ERROR");
}

/**
 * @param {String} msg Warning message to display
 * @return {void}
 */
function warning(msg) {
  _addMessage(msg, "WARNING");
}

/**
 * @param {String} msg Message to display
 * @return {void}
 */
function info(msg) {
  _addMessage(msg, "INFO");
}
