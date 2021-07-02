"use strict";
const runners = require("./tools/index");
const _ = require("lodash");

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

  options.reporter.reportInfo(
    `Found ${compatibleRunners.length} runners: [${compatibleRunners
      .map((runner) => {
        return runner.name || "unamed";
      })
      .join(", ")}]`
  );

  let allRunnersResults = [];
  for (const runner of compatibleRunners) {
    options.reporter.reportInfo(`Running ${runner.name || "unamed"} runner`);
    try {
      await runner.checkDependencies();
      const runnerResults = await runner.run(website, standard, options);
      allRunnersResults.push(runnerResults);
    } catch (error) {
      options.reporter.reportError(
        `The execution of ${runner.name} failed, ignoring its results. ${error.message}`
      );
    }
  }
  return mergeResult(allRunnersResults);
}

/**
 * Calculate the highest between type1 and type2
 * Using the following order: notice <= warning <= error
 * @param {String} type1
 * @param {String} type2
 * @returns {String} The highest
 */
function highestType(type1, type2) {
  const typeOrder = ["notice", "warning", "error"];
  return typeOrder.indexOf(type1) <= typeOrder.indexOf(type2) ? type2 : type1;
}

/**
 * Group, order and remove repeated results
 * @param {Result[][]} results Accessibility results array obtained
 * @returns Definitive standard results
 */
function mergeResult(results) {
  //Join a group of results with the same code
  const joinRelatedResults = (accum, current) => {
    accum.code = current.code;
    if (!accum.message.includes(current.message))
      accum.message += `${current.message}\n`;
    accum.element.push(current.element); //TODO: Remove repetitions
    accum.type = highestType(accum.type, current.type);
    return accum;
  };

  return _.values(_.groupBy(_.flatten(results), "code")).map(
    (relatedResults) => {
      return relatedResults.reduce(joinRelatedResults, {
        code: "",
        element: [],
        message: "",
        type: "notice",
      });
    }
  );
}

function saveResults() {
  //TODO
}
