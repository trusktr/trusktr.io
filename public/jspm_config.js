System.config({
  "paths": {
    "*": "*.js",
    "github:*": "party/jspm/github/*.js",
    "npm:*": "party/jspm/npm/*.js"
  }
});

System.config({
  "map": {
    "bignumber": "github:MikeMcl/bignumber.js@^1.4.1",
    "jsfromhell": "github:jonasraoni/JSFromHell@master",
    "famous": "github:trusktr/famous@trusktr",
    "big": "github:MikeMcl/big.js@^2.5.1",
    "jquery-tooltipster": "github:iamceege/tooltipster@^3.2.6",
    "bootstrap-datepicker": "github:eternicode/bootstrap-datepicker@^1.3.0",
    "jquery": "github:components/jquery@^2.1.1",
    "bootstrap": "github:twbs/bootstrap@^3.2.0",
    "github:twbs/bootstrap@3.2.0": {
      "jquery": "github:components/jquery@^2.1.1",
      "css": "github:systemjs/plugin-css@^0.1.0"
    },
    "github:eternicode/bootstrap-datepicker@1.3.0": {
      "bootstrap": "github:twbs/bootstrap@^3.2.0"
    },
    "github:iamceege/tooltipster@3.2.6": {
      "jquery": "github:components/jquery@^2.1.1",
      "css": "github:systemjs/plugin-css@^0.1.0"
    },
    "github:trusktr/famous@trusktr": {
      "famous-polyfills": "github:Famous/polyfills@^0.3.0",
      "css": "github:systemjs/plugin-css@^0.1.0"
    }
  }
});

System.config({
  "versions": {
    "github:MikeMcl/bignumber.js": "1.4.1",
    "github:jonasraoni/JSFromHell": "master",
    "github:trusktr/famous": "trusktr",
    "github:MikeMcl/big.js": "2.5.1",
    "github:iamceege/tooltipster": "3.2.6",
    "github:eternicode/bootstrap-datepicker": "1.3.0",
    "github:components/jquery": "2.1.1",
    "github:twbs/bootstrap": "3.2.0",
    "github:systemjs/plugin-css": "0.1.0",
    "github:Famous/polyfills": "0.3.0"
  }
});

