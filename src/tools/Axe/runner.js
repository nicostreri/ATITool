"use strict";
const { spawn } = require("child_process");
const which = require("which");
const axeTransformer = require("./transformer");

exports.name = "Axe";
// prettier-ignore
exports.allowedStandards = Object.freeze(["Section508", "WCAG2A", "WCAG2AA", "WCAG2AAA"]);
exports.checkDependencies = checkDependencies;
exports.run = run;

const standardToTagsMap = {
  Section508: "section508,best-practice",
  WCAG2A: "wcag2a,wcag21a,best-practice",
  WCAG2AA: "wcag2a,wcag21a,wcag2aa,wcag21aa,best-practice",
  WCAG2AAA: "wcag2a,wcag21a,wcag2aa,wcag21aa,best-practice",
};

/**
 * Check if all dependencies are satisfied
 * @returns {Promise} Returns a promise which resolves to void
 */
async function checkDependencies() {
  try {
    await which("axe");
  } catch (e) {
    throw new Error(
      `Axe reporter require axe installed. See "npm install @axe-core/cli -g"`
    );
  }
}

function spawnPromise(command, args) {
  return new Promise(function (resolve, reject) {
    var stdout = "",
      stderr = "";
    var cp = spawn(command, args);
    cp.stdout.on("data", function (chunk) {
      stdout += chunk;
    });
    cp.stderr.on("data", function (chunk) {
      stderr += chunk;
    });
    cp.on("error", reject).on("close", function (code) {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(stderr);
      }
    });
  });
}

async function runAxe(website, standard, options) {
  try {
    return JSON.parse(
      await spawnPromise("axe", [
        website,
        "--show-errors",
        "-j",
        "--tags",
        standardToTagsMap[standard],
      ])
    );
  } catch (e) {
    throw new Error(`Axe reporter: axe execution fails (${e})`);
  }
}

/**
 *
 * @param {String} website URL to analyze.
 * @param {String} standard Standard to apply
 * @param {Any} options Currently unused
 * @returns {Array} Array of standard results obtained by Axe
 */
async function run(website, standard, options) {
  if (!this.allowedStandards.includes(standard))
    throw new Error(`Axe runner, unsupported standard: ${standard}`);
  const specificResults = await runAxe(website, standard, options);
  return axeTransformer.convert(specificResults, standard);
}
