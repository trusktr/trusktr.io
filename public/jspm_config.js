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
    "infamous": "hypership:trusktr/infamous@master",
    "jsfromhell": "github:jonasraoni/JSFromHell@master",
    "bignumber": "github:MikeMcl/bignumber.js@^1.4.1",
    "big": "github:MikeMcl/big.js@^2.5.1",
    "jquery": "github:components/jquery@^2.1.1",
    "bootstrap": "github:twbs/bootstrap@^3.2.0",
    "bootstrap-datepicker": "github:eternicode/bootstrap-datepicker@^1.3.0",
    "jquery-tooltipster": "github:iamceege/tooltipster@^3.2.6",
    "famous": "github:trusktr/famous@trusktr",
    "stylus": "github:LearnBoost/stylus@client",
    "james-bond": "npm:james-bond@^0.0.0",
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
    "npm:famous-polyfills@0.3.0": {},
    "npm:base64-js@0.0.4": {},
    "npm:inherits@2.0.1": {},
    "npm:ieee754@1.1.4": {},
    "npm:pbkdf2-compat@2.0.1": {},
    "npm:ripemd160@0.2.0": {},
    "npm:Base64@0.2.1": {},
    "github:trusktr/famous@trusktr": {
      "famous-polyfills": "npm:famous-polyfills@^0.3.0",
      "css": "github:systemjs/plugin-css@^0.1.0"
    },
    "npm:james-bond@0.0.0": {},
    "npm:sha.js@2.2.6": {
      "json": "npm:json@^9.0.2"
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
    }
  }
});

System.config({
  "versions": {
    "hypership:trusktr/infamous": "master",
    "github:jonasraoni/JSFromHell": "master",
    "github:MikeMcl/bignumber.js": "1.4.1",
    "github:iamceege/tooltipster": "3.2.6",
    "github:MikeMcl/big.js": "2.5.1",
    "github:trusktr/famous": "trusktr",
    "github:eternicode/bootstrap-datepicker": "1.3.0",
    "github:LearnBoost/stylus": "client",
    "github:components/jquery": "2.1.1",
    "github:twbs/bootstrap": "3.2.0",
    "github:systemjs/plugin-css": "0.1.0",
    "npm:famous-polyfills": "0.3.0",
    "github:jspm/nodelibs": "0.0.5",
    "npm:base64-js": "0.0.4",
    "npm:inherits": "2.0.1",
    "npm:Base64": "0.2.1",
    "npm:ieee754": "1.1.4",
    "npm:pbkdf2-compat": "2.0.1",
    "npm:ripemd160": "0.2.0",
    "npm:sha.js": "2.2.6",
    "github:systemjs/plugin-json": "0.1.0",
    "npm:json": "9.0.2",
    "npm:james-bond": "0.0.0"
  }
});

