exports.convert = convert;

const typeIssueMap = {
  0: "notice",
  1: "error",
  2: "warning",
  3: "notice",
};

function mapCodeToStandardCode(hcode) {
  //TODO Reimplement it after analysing the standard code format.
  return hcode;
}

/**
 * Convert htmlcsToJSON results to standard results
 * @param {Array} htmlcsResults Arrays of htmlcsToJSON results.
 * @returns {Array} Array of standard results
 */
function convert(htmlcsResults) {
  return htmlcsResults.map((hresult) => {
    return {
      code: mapCodeToStandardCode(hresult.code),
      element: hresult.element,
      message: hresult.msg,
      type: typeIssueMap[hresult.type],
    };
  });
}
