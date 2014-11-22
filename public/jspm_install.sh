#!/usr/bin/env sh

jspm config endpoints.hypership.handler 'jspm-git' &&\
jspm config endpoints.hypership.baseurl 'https://g.trusktr.io/' &&\
jspm install &&\
jspm install bootstrap@^3.2.0 -o '{ "registry": "jspm", "dependencies": { "jquery": "^2.1.1", "css": "^0.1.0" }, "shim": { "js/bootstrap": { "deps": ["jquery", "../css/bootstrap.min.css!", "../css/bootstrap-theme.min.css!"], "exports": "$" }, "css/bootstrap-theme.min.css!": { "deps": ["./bootstrap.css!"] } } }' &&\
jspm install bootstrap-datepicker=github:eternicode/bootstrap-datepicker@^1.3.0 -o '{ "registry": "jspm", "main": "js/bootstrap-datepicker.js", "dependencies": { "bootstrap": "^3.2.0" } }' &&\
jspm install jquery-tooltipster=github:iamceege/tooltipster@^3.2.6 -o '{ "registry": "jspm", "main": "js/jquery.tooltipster", "shim": { "js/jquery.tooltipster": { "deps": ["jquery", "../css/tooltipster.css!"] } }, "dependencies": { "jquery": "^2.1.1", "css": "^0.1.0" } }' &&\
jspm install famous=github:trusktr/famous@trusktr -o '{ "registry": "jspm", "directories": { "lib": "src" }, "dependencies": { "famous-polyfills": "npm:famous-polyfills@^0.3.0", "css": "^0.1.0" }, "shim": { "*/*": { "deps": ["famous-polyfills", "../core/famous.css!"] } } }' &&\
jspm install stylus=github:LearnBoost/stylus@client -o '{ "registry": "jspm", "main": "stylus", "shim": { "stylus": { "exports": "stylus" } } }' &&\
cd party/jspm/github/LearnBoost/stylus@client/ && make stylus.js && cd - &&\
node ./jspm_meta_fix &&\
echo
