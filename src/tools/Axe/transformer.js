/**
 * Note:
 *  For more information on the format of the Axe result, see https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#results-object
 */

exports.convert = convert;

function mapCodeToStandardCode(axeCode) {
  //TODO Reimplement it after analysing the standard code format.
  return axeCode;
}

function getElement(selectors, separator) {
  //Extract from https://github.com/dequelabs/axe-cli/blob/3363acc6bb9d62cba254d38a7fb324807543725e/lib/utils.js#L75
  separator = separator || " ";
  return selectors
    .reduce((prev, curr) => prev.concat(curr), [])
    .join(separator);
}

function convertResults(axeResults, type) {
  let results = [];
  for (const issue of axeResults) {
    for (const node of issue.nodes) {
      results.push({
        code: mapCodeToStandardCode(issue.id),
        element: getElement(node.target),
        message: `${issue.description}. ${issue.help}.`,
        type: type,
      });
    }
  }
  return results;
}

function convertViolations(violations) {
  return convertResults(violations, "error");
}

function convertIncomplete(incomplete) {
  return convertResults(incomplete, "warning");
}

/**
 * Convert Axe results to standard results
 * @param {Array} axeResults Arrays of Axe results.
 * @returns {Array} Array of standard results
 */
function convert(axeResults) {
  const violations = axeResults[0].violations;
  const incomplete = axeResults[0].incomplete;

  let results = [];
  results.push(...convertIncomplete(incomplete));
  results.push(...convertViolations(violations));

  return results;
}
