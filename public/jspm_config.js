System.config({
  "paths": {
    "*": "*.js",
    "github:*": "party/jspm/github/*.js",
    "npm:*": "party/jspm/npm/*.js"
  }
});

System.config({
  "map": {
    "jquery": "github:components/jquery@^2.1.1",
    "bootstrap": "github:twbs/bootstrap@^3.2.0",
    "github:twbs/bootstrap@3.2.0": {
      "jquery": "github:components/jquery@^2.1.1",
      "css": "github:systemjs/plugin-css@^0.1.0"
    },
    "jquery-tooltipster": "github:iamceege/tooltipster@^3.2.6",
    "github:iamceege/tooltipster@3.2.6": {
      "jquery": "github:components/jquery@^2.1.1",
      "css": "github:systemjs/plugin-css@^0.1.0"
    },
    "bootstrap-datepicker": "github:eternicode/bootstrap-datepicker@^1.3.0",
    "github:eternicode/bootstrap-datepicker@1.3.0": {
      "bootstrap": "github:twbs/bootstrap@^3.2.0"
    },
    "famous": "github:trusktr/famous@master",
    "github:trusktr/famous@master": {
      "famous-polyfills": "github:Famous/polyfills@^0.3.0",
      "css": "github:systemjs/plugin-css@^0.1.0"
    },
    "big": "github:MikeMcl/big.js@^2.5.1",
    "bignumber": "github:MikeMcl/bignumber.js@^1.4.1",
    "jsfromhell": "github:jonasraoni/JSFromHell@master"
  }
});

System.config({
  "versions": {
    "github:systemjs/plugin-css": "0.1.0",
    "github:components/jquery": "2.1.1",
    "github:twbs/bootstrap": "3.2.0",
    "github:iamceege/tooltipster": "3.2.6",
    "github:eternicode/bootstrap-datepicker": "1.3.0",
    "github:trusktr/famous": "master",
    "github:Famous/polyfills": "0.3.0",
    "github:MikeMcl/big.js": "2.5.1",
    "github:MikeMcl/bignumber.js": "1.4.1",
    "github:jonasraoni/JSFromHell": "master"
  }
});

