"use strict";
const runners = require("./tools/index");
const puppeteer = require("puppeteer");
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
      await runner.checkDependencies(options);
      const runnerResults = await runner.run(website, standard, options);
      allRunnersResults.push(runnerResults);
    } catch (error) {
      options.reporter.reportError(
        `The execution of ${runner.name} failed, ignoring its results. ${error.message}`
      );
    }
  }
  return await mergeResult(website, allRunnersResults, options);
}

/**
 * Calculate the highest between type1 and type2
 * Using the following order: notice < warning < error
 * @param {String} type1
 * @param {String} type2
 * @returns {String} The highest
 */
function highestType(type1, type2) {
  const typeOrder = ["notice", "warning", "error"];
  return typeOrder.indexOf(type1) <= typeOrder.indexOf(type2) ? type2 : type1;
}

/**
 * Removes all element paths that represent the same element from a standard result.
 * @prerequisite Some website was rendered, using: renderWebsite()
 * @param {Result} standardResult The standard result to process
 * @param {Any} options Internal options
 * @returns The standard result without element repetitions.
 */
async function removeRepeatingElements(standardResult, options) {
  return options.render.page.evaluate((result) => {
    let elementsSet = new Set();
    let uniqueSelectors = [];
    for (const selector of result.element) {
      let element = undefined;
      // prettier-ignore
      try { element = document.querySelector(selector);} catch (ignore) {}
      if (!element) {
        uniqueSelectors.push(selector);
      } else if (!elementsSet.has(element)) {
        elementsSet.add(element);
        uniqueSelectors.push(selector);
      }
    }
    result.element = uniqueSelectors;
    return result;
  }, standardResult);
}

/**
 * Create a new puppeteer instance that represents a website.
 * @param {String} url The website url
 * @param {Any} options Internal options, will modify it.
 */
async function renderWebsite(url, options) {
  const browser = await puppeteer.launch({ dumpio: false });
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "networkidle2",
    timeout: 50000,
  });
  options.render = {};
  options.render.browser = browser;
  options.render.page = page;
}

/**
 * Close the puppeteer instance and free the memory.
 * @prerequisite Some website was rendered, using: renderWebsite()
 * @param {Any} options Internal options, will modify it.
 */
async function closeWebsite(options) {
  if (options.render && options.render.page) {
    await options.render.page.close();
  }
  if (options.render && options.render.browser) {
    await options.render.browser.close();
  }
}

/**
 * Combine a result set into a single result using the following rules:
 *  - The code property is equal to the code of the last result.
 *  - The message property is equal to the concatenation of all the messages in the results.
 *  - The type property is equal to the greatest of all types, with the order: notice < warning < error.
 *  - The element property is the list of all elements.
 * @param {Result[]} results Results to combine
 * @returns {Result} The Standard result
 */
function combineStandardResults(results) {
  const joinRelatedResults = (accum, current) => {
    accum.code = current.code;
    if (!accum.message.includes(current.message))
      accum.message += `${current.message}\n`;
    accum.element.push(current.element);
    accum.type = highestType(accum.type, current.type);
    return accum;
  };
  return results.reduce(joinRelatedResults, {
    code: "",
    element: [],
    message: "",
    type: "notice",
  });
}

/**
 * Group, order and remove repeated results
 * @param {String} website WebSite url
 * @param {Result[][]} results Accessibility results array obtained
 * @returns Definitive standard results
 */
async function mergeResult(website, results, options) {
  const resultsWithRepeatingElements = _.values(
    _.groupBy(_.flatten(results), "code")
  ).map(combineStandardResults);

  await renderWebsite(website, options);
  let resultsWithoutRepeatingElements = [];
  for (const result of resultsWithRepeatingElements) {
    resultsWithoutRepeatingElements.push(
      await removeRepeatingElements(result, options)
    );
  }
  await closeWebsite(options);
  return resultsWithoutRepeatingElements;
}

function saveResults() {
  //TODO
}
