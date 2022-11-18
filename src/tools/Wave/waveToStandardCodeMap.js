"use strict";

const waveToStandardCodeMap = {
  alt_missing: "[Standard].Principle1.Guideline1_1.1_1_1.H37",
  alt_input_missing: "[Standard].Principle1.Guideline1_1.1_1_1.H36",
  contrast: "[Standard].Principle1.Guideline1_4.1_4_3.G18.Fail",
  title_invalid: "[Standard].Principle2.Guideline2_4.2_4_2.H25.1.EmptyTitle",
  language_missing: "[Standard].Principle3.Guideline3_1.3_1_1.H57.2",
  heading_empty: "[Standard].Principle1.Guideline1_3.1_3_1.H42.2",
  blink: "[Standard].Principle2.Guideline2_2.2_2_2.F47",
  meta_refresh: "[Standard].Principle2.Guideline2_2.2_2_1.F41.2",
  label_missing: "[Standard].Principle1.Guideline1_3.1_3_1.F68",
  button_empty: "[Standard].Principle4.Guideline4_1.4_1_2.H91.Button.Name",
  link_empty: "[Standard].Principle4.Guideline4_1.4_1_2.H91.A.NoContent",
};

exports.map = function map(code, standard) {
  const codeMapping = waveToStandardCodeMap[code] || "";
  if (
    codeMapping.length > 0 &&
    ["WCAG2A", "WCAG2AA", "WCAG2AAA"].includes(standard)
  ) {
    return codeMapping.replace("[Standard]", standard);
  }
  return code;
};
