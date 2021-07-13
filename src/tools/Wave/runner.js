"use strict";
const axios = require("axios").default;
const waveTransformer = require("./transformer");

exports.name = "WAVE API";
exports.allowedStandards = Object.freeze(["WCAG2A", "WCAG2AA", "WCAG2AAA"]);
exports.checkDependencies = checkDependencies;
exports.run = run;

/**
 * Check if all dependencies are satisfied
 * @param options App options
 * @returns {Promise} Returns a promise which resolves to void
 */
async function checkDependencies(options) {
  try {
    const key = options.config.wave.apikey;
    if (typeof key !== "string" || key.length == 0) throw new Error("");
  } catch (e) {
    throw new Error(
      "WAVE API: Invalid apikey. Configure it in ./config/wave.json"
    );
  }
}

async function runWAVE(website, standard, options) {
  const response = await axios.get(
    encodeURI(
      `https://wave.webaim.org/api/request?key=${options.config.wave.apikey}&reporttype=4&url=${website}`
    ),
    {
      timeout: 20000, //20 seconds
    }
  );
  return response.data;
}

/**
 *
 * @param {String} website URL to analyze
 * @param {String} standard Standard to apply
 * @param {Any} options App options
 * @returns {Array} Array of standard results obtained by WAVE API
 */
async function run(website, standard, options) {
  if (!this.allowedStandards.includes(standard))
    throw new Error(`WAVE API runner, unsupported standard: ${standard}`);
  const specificResults = await runWAVE(website, standard, options);
  return waveTransformer.convert(specificResults, standard);
}
