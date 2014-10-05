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
    "github:iamceege/tooltipster": "github:iamceege/tooltipster@^3.2.6",
    "bootstrap": "github:twbs/bootstrap@^3.2.0",
    "github:twbs/bootstrap@3.2.0": {
      "jquery": "github:components/jquery@^2.1.1",
      "css": "github:systemjs/plugin-css@^0.1.0"
    },
    "github:eternicode/bootstrap-datepicker": "github:eternicode/bootstrap-datepicker@^1.3.0",
    "github:Famous/famous": "github:Famous/famous@^0.2.2",
    "github:Famous/polyfills": "github:Famous/polyfills@^0.3.0"
  }
});

System.config({
  "versions": {
    "github:systemjs/plugin-css": "0.1.0",
    "github:components/jquery": "2.1.1",
    "github:iamceege/tooltipster": "3.2.6",
    "github:twbs/bootstrap": "3.2.0",
    "github:eternicode/bootstrap-datepicker": "1.3.0",
    "github:Famous/famous": "0.2.2",
    "github:Famous/polyfills": "0.3.0"
  }
});

