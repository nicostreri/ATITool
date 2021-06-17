"use strict";
/**
 * Note: When integrating a new accessibility testing tool, add export to this file.
 */
const htmlcsRunner = require("./HTMLCodeSniffer/runner");

exports.list = [htmlcsRunner];
exports.compatibleWith = compatibleWith;

/**
 * Get runners compatible with a standard
 * @param {String} standard
 * @returns {Array} Array of Runner objects
 */
function compatibleWith(standard) {
  return this.list.filter((runner) => {
    return runner.allowedStandards.includes(standard);
  });
}
