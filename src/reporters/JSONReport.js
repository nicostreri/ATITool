"use strict";

exports.name = "JSON";
exports.reportFrom = reportFrom;
exports.reportError = error;
exports.reportWarning = warning;
exports.reportInfo = info;

let output = {
  log: [],
  results: [],
};

/**
 * Prints accesibility results on the CLI in JSON Format
 * @param {Array} results Array of accesibility results
 * @param {Any} options
 * @returns {void}
 */
function reportFrom(results, options) {
  output.results = results;
  console.log(JSON.stringify(output));
  output = {
    log: [],
    results: [],
  };
}

function _addMessage(msg, type) {
  output.log.push({
    time: Date(),
    type: type,
    message: msg,
  });
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
