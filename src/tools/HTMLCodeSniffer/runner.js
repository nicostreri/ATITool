"use strict";
const { exec } = require("child_process");
const which = require("which");
const htmlcsTransformer = require("./transformer");

exports.name = "HTMLCodeSniffer";
exports.allowedStandards = ["Section508", "WCAG2A", "WCAG2AA", "WCAG2AAA"];
exports.checkDependencies = checkDependencies;
exports.run = run;

/**
 * Check if all dependencies are satisfied
 * @returns {Promise} Returns a promise which resolves to void
 */
async function checkDependencies() {
  try {
    await which("htmlcsToJSON");
  } catch (e) {
    throw new Error(`HTMLCodeSniffer reporter require htmlcsToJSON installed.`);
  }
}

function execPromise(command) {
  return new Promise(function (resolve, reject) {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout.trim());
    });
  });
}

async function runHTMLToJSON(website, standard, options) {
  let result;
  try {
    result = JSON.parse(
      await execPromise(`htmlcsToJSON -u ${website} -s ${standard}`)
    );
  } catch (e) {
    throw new Error(
      `HTMLCodeSniffer reporter: htmlcsToJSON execution fails (${e})`
    );
  }
  if (result.status != "ok")
    throw new Error(
      `HTMLCodeSniffer reporter: htmlcsToJSON could not get the website analysis.`
    );
  return result.results;
}

/**
 *
 * @param {String} website URL to analyze
 * @param {String} standard Standard to apply
 * @param {Any} options Currently unused
 * @returns {Array} Array of standard results obtained by HTML Code Sniffer
 */
async function run(website, standard, options) {
  if (!this.allowedStandards.includes(standard))
    throw new Error(
      `HTML CodeSniffer runner, unsupported standard: ${standard}`
    );
  const specificResults = await runHTMLToJSON(website, standard, options);
  return htmlcsTransformer.convert(specificResults);
}
