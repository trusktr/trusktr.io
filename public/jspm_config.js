System.config({
  "paths": {
    "*": "*.js",
    "hypership:*": "party/jspm/hypership/*.js",
    "github:*": "party/jspm/github/*.js",
    "npm:*": "party/jspm/npm/*.js"
  }
});

System.config({
  "map": {
    "big": "github:MikeMcl/big.js@^2.5.1",
    "bignumber": "github:MikeMcl/bignumber.js@^1.4.1",
    "bootstrap": "github:twbs/bootstrap@^3.2.0",
    "bootstrap-datepicker": "github:eternicode/bootstrap-datepicker@^1.3.0",
    "famous": "github:trusktr/famous@trusktr",
    "infamous": "hypership:trusktr/infamous@master",
    "james-bond": "npm:james-bond@^0.0.0",
    "jquery": "github:components/jquery@^2.1.1",
    "jquery-tooltipster": "github:iamceege/tooltipster@^3.2.6",
    "jsfromhell": "github:jonasraoni/JSFromHell@master",
    "stylus": "github:LearnBoost/stylus@client",
    "github:eternicode/bootstrap-datepicker@1.3.0": {
      "bootstrap": "github:twbs/bootstrap@^3.2.0"
    },
    "github:iamceege/tooltipster@3.2.6": {
      "jquery": "github:components/jquery@^2.1.1",
      "css": "github:systemjs/plugin-css@^0.1.0"
    },
    "github:iamceege/tooltipster@3.3.0": {
      "jquery": "github:components/jquery@^2.1.1",
      "css": "github:systemjs/plugin-css@^0.1.0"
    },
    "github:jspm/nodelibs@0.0.5": {
      "Base64": "npm:Base64@^0.2.0",
      "base64-js": "npm:base64-js@^0.0.4",
      "ieee754": "npm:ieee754@^1.1.1",
      "inherits": "npm:inherits@^2.0.1",
      "json": "github:systemjs/plugin-json@^0.1.0",
      "pbkdf2-compat": "npm:pbkdf2-compat@^2.0.1",
      "ripemd160": "npm:ripemd160@^0.2.0",
      "sha.js": "npm:sha.js@^2.2.6"
    },
    "github:trusktr/famous@trusktr": {
      "famous-polyfills": "npm:famous-polyfills@^0.3.0",
      "css": "github:systemjs/plugin-css@^0.1.0"
    },
    "github:twbs/bootstrap@3.3.1": {
      "jquery": "github:components/jquery@^2.1.1",
      "css": "github:systemjs/plugin-css@^0.1.0"
    },
    "npm:Base64@0.2.1": {},
    "npm:base64-js@0.0.4": {},
    "npm:famous-polyfills@0.3.0": {},
    "npm:ieee754@1.1.4": {},
    "npm:inherits@2.0.1": {},
    "npm:james-bond@0.0.0": {},
    "npm:json@9.0.2": {},
    "npm:pbkdf2-compat@2.0.1": {},
    "npm:ripemd160@0.2.0": {},
    "npm:sha.js@2.2.6": {
      "json": "npm:json@^9.0.2"
    }
  }
});

System.config({
  "versions": {
    "github:LearnBoost/stylus": "client",
    "github:MikeMcl/big.js": "2.5.2",
    "github:MikeMcl/bignumber.js": "1.5.0",
    "github:components/jquery": "2.1.1",
    "github:eternicode/bootstrap-datepicker": "1.3.0",
    "github:iamceege/tooltipster": "3.3.0",
    "github:jonasraoni/JSFromHell": "master",
    "github:jspm/nodelibs": "0.0.5",
    "github:systemjs/plugin-css": "0.1.0",
    "github:systemjs/plugin-json": "0.1.0",
    "github:trusktr/famous": "trusktr",
    "github:twbs/bootstrap": "3.3.1",
    "hypership:trusktr/infamous": "master",
    "npm:Base64": "0.2.1",
    "npm:base64-js": "0.0.4",
    "npm:famous-polyfills": "0.3.0",
    "npm:ieee754": "1.1.4",
    "npm:inherits": "2.0.1",
    "npm:james-bond": "0.0.0",
    "npm:json": "9.0.2",
    "npm:pbkdf2-compat": "2.0.1",
    "npm:ripemd160": "0.2.0",
    "npm:sha.js": "2.2.6"
  }
});

