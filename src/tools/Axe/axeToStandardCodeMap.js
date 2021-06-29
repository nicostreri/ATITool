"use strict";

const axeToStandardMap = {
  "area-alt": {
    Section508: "Section508.A.Area.MissingAlt",
    WCAGALL: "[Standard].Principle1.Guideline1_1.1_1_1.H24",
  },
  blink: "[Standard].Principle2.Guideline2_2.2_2_2.F47",
  "button-name": "",
  "color-contrast": "[Standard].Principle1.Guideline1_4.1_4_6.G17.Fail",
  "document-title": "[Standard].Principle2.Guideline2_4.2_4_2.H25.1.NoTitleEl",
  "duplicate-id-aria": "[Standard].Principle4.Guideline4_1.4_1_1.F77",
  "duplicate-id": "[Standard].Principle4.Guideline4_1.4_1_1.F77",
  "empty-heading": "[Standard].Principle1.Guideline1_3.1_3_1.H42.2",
  "frame-title": {
    Section508: "Section508.I.Frames",
    WCAGALL: "[Standard].Principle2.Guideline2_4.2_4_1.H64.1",
  },
  "heading-order": "",
  "html-has-lang": "[Standard].Principle3.Guideline3_1.3_1_1.H57.2",
  "html-lang-valid": "[Standard].Principle3.Guideline3_1.3_1_1.H57.3.Lang",
  "image-alt": {
    Section508: "Section508.A.Img.MissingAlt",
    WCAGALL: "[Standard].Principle1.Guideline1_1.1_1_1.H37",
  },
  "input-button-name":
    "[Standard].Principle4.Guideline4_1.4_1_2.H91.InputButton.Name",
  "input-image-alt": {
    Section508: "Section508.A.InputImage.MissingAlt",
    WCAGALL: "[Standard].Principle1.Guideline1_1.1_1_1.H36",
  },
  label: "[Standard].Principle1.Guideline1_3.1_3_1.F68",
  "meta-refresh": {
    Section508: "Section508.P.MetaRefresh",
    WCAGALL: "[Standard].Principle2.Guideline2_2.2_2_1.F41.2",
  },
  "select-name": "[Standard].Principle1.Guideline1_3.1_3_1.F68",
};

exports.map = function map(code, standard) {
  const codeMapping = axeToStandardMap[code] || "";
  if (typeof codeMapping === "string") {
    if (
      codeMapping.length > 0 &&
      ["WCAG2A", "WCAG2AA", "WCAG2AAA"].includes(standard)
    )
      return codeMapping.replace("[Standard]", standard);
  } else if (typeof codeMapping === "object") {
    if (standard == "Section508") return codeMapping.Section508 || code;
    if (["WCAG2A", "WCAG2AA", "WCAG2AAA"].includes(standard)) {
      return (codeMapping.WCAGALL || code).replace("[Standard]", standard);
    }
  }
  return code;
};
