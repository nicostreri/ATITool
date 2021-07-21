exports.convert = convert;
/**
 * For more details, see https://wave.webaim.org/api/details
 */
const { map } = require("./waveToStandardCodeMap");

function convertIssues(issuesObject, type, standard) {
  if (issuesObject.count == 0) return [];
  let standardIssues = [];
  for (const [key, value] of Object.entries(issuesObject.items)) {
    for (const selector of value.selectors) {
      standardIssues.push({
        code: map(key, standard),
        element: selector || "HTML",
        message: value.description,
        type: type,
      });
    }
  }
  return standardIssues;
}

/**
 * Convert WAVE API results to standard results
 * @param {Array} waveResults Arrays of WAVE API results.
 * @param {String} standard Accesibility Standard used
 * @returns {Array} Array of standard results
 */
function convert(waveResults, standard) {
  if (!waveResults.status) throw new Error("Invalid WAVE API response");
  if (!waveResults.status.success) {
    throw new Error(
      `Accessibility analysis failed, returned from API: ${waveResults.status.error}`
    );
  }

  return [
    ...convertIssues(waveResults.categories.error, "error", standard),
    ...convertIssues(waveResults.categories.contrast, "error", standard),
    ...convertIssues(waveResults.categories.alert, "warning", standard),
  ];
}
