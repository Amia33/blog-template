/** @type {import("stylelint").Config} */

const stylelintConfig = {
  extends: ["stylelint-config-standard"],
  rules: {
    "import-notation": "string",
    "at-rule-no-unknown": [true, { ignoreAtRules: ["theme"] }],
  },
};

export default stylelintConfig;
