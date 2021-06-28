/**
 * Note:
 *  For more information on the format of the Axe result, see https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#results-object
 */
const { map } = require("./axeToStandardCodeMap");
exports.convert = convert;

function getElement(selectors, separator) {
  //Extract from https://github.com/dequelabs/axe-cli/blob/3363acc6bb9d62cba254d38a7fb324807543725e/lib/utils.js#L75
  separator = separator || " ";
  return selectors
    .reduce((prev, curr) => prev.concat(curr), [])
    .join(separator);
}

function convertResults(axeResults, type, standard) {
  let results = [];
  for (const issue of axeResults) {
    for (const node of issue.nodes) {
      results.push({
        code: map(issue.id, standard),
        element: getElement(node.target),
        message: `${issue.description}. ${issue.help}.`,
        type: type,
      });
    }
  }
  return results;
}

/**
 * Convert Axe results to standard results
 * @param {Array} axeResults Arrays of Axe results.
 * @param {String} standard Accesibility Standard used
 * @returns {Array} Array of standard results
 */
function convert(axeResults, standard) {
  const violations = axeResults[0].violations;
  const incomplete = axeResults[0].incomplete;

  let results = [];
  results.push(...convertResults(incomplete, "warning", standard));
  results.push(...convertResults(violations, "error", standard));

  return results;
}
