"use strict";
const { spawn } = require("child_process");
const which = require("which");
const axeTransformer = require("./transformer");

exports.name = "Axe";
exports.allowedStandards = ["Section508", "WCAG2A", "WCAG2AA", "WCAG2AAA"];
exports.checkDependencies = checkDependencies;
exports.run = run;

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

async function runAxe(website, options) {
  try {
    return JSON.parse(
      await spawnPromise("axe", [website, "--show-errors", "-j"])
    );
  } catch (e) {
    throw new Error(`Axe reporter: axe execution fails (${e.message})`);
  }
}

/**
 *
 * @param {String} website URL to analyze
 * @param {Any} options Currently unused
 * @returns {Array} Array of standard results obtained by Axe
 */
async function run(website, options) {
  const specificResults = await runAxe(website, options);
  return axeTransformer.convert(specificResults);
}
