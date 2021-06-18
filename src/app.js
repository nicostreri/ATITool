"use strict";
const runners = require("./tools/index");

exports.run = run;
exports.saveResults = saveResults;

/**
 * Run all
 * @param {String} website URL to analyze
 * @param {String} standard Standard to apply
 * @param {Any} options
 * @returns {Array} Array of Standard results
 */
async function run(website, standard, options) {
  const compatibleRunners = runners.compatibleWith(standard);
  if (compatibleRunners.length == 0)
    throw new Error(`No runners found compatible with ${standard}`);

  let allRunnersResults = [];
  let i;
  for (i in compatibleRunners) {
    const runner = compatibleRunners[i];
    options.reporter.reportInfo(`Running ${runner.name || "unamed"} runner`);
    const runnerResults = await runner.run(website, options);
    allRunnersResults.push(runnerResults);
  }
  return mergeResult(allRunnersResults);
}

/**
 * Group, order and remove repeated results
 * @param {Result[][]} results Accessibility results array obtained
 * @returns Definitive standard results
 */
function mergeResult(results) {
  let finalResults = [];
  let i;
  for (i in results) {
    //TODO No implement
    const runnerResults = results[i];
    finalResults = finalResults.concat(runnerResults);
  }
  return finalResults;
}

function saveResults() {
  //TODO
}
