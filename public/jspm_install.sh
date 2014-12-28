#!/usr/bin/env sh

# configure a custom end point for libraries on my server.
jspm config endpoints.hypership.handler 'jspm-git' &&\
jspm config endpoints.hypership.baseurl 'https://g.trusktr.io/' &&\

# clean files and start over. This prevent some errors I've experienced otherwise.
rm -rf party/jspm/* &&\
rm -f jspm_config.js &&\

# install default packages.
jspm install -y &&\

# fix require in jss.
#perl -pi -w -e 's:\.\.:../index:g;' party/jspm/npm/jss@0.5.1/lib/processors/vendorPrefixer.js &&\

# reinstall some stuff with overrides. Inefficient but works for now. TODO: make a custom registry instead.
    jspm install -y bootstrap@^3.2.0 -o '{ "registry": "jspm", "dependencies": { "jquery": "^2.1.1", "css": "^0.1.0" }, "shim": { "js/bootstrap": { "deps": ["jquery", "../css/bootstrap.min.css!", "../css/bootstrap-theme.min.css!"] }, "css/bootstrap-theme.min.css!": { "deps": ["./bootstrap.min.css!"] } } }' &&\
    jspm install -y bootstrap-datepicker=github:eternicode/bootstrap-datepicker@^1.3.0 -o '{ "registry": "jspm", "main": "js/bootstrap-datepicker.js", "dependencies": { "bootstrap": "^3.2.0" } }' &&\
    jspm install -y jquery-tooltipster=github:iamceege/tooltipster@^3.2.6 -o '{ "registry": "jspm", "main": "js/jquery.tooltipster", "shim": { "js/jquery.tooltipster": { "deps": ["jquery", "../css/tooltipster.css!"] } }, "dependencies": { "jquery": "^2.1.1", "css": "^0.1.0" } }' &&\

    # install famous then fix the meta properties to make famous work with jspm.
    jspm install -y famous=github:trusktr/famous@trusktr -o '{ "registry": "jspm", "directories": { "lib": "src" }, "dependencies": { "famous-polyfills": "npm:famous-polyfills@^0.3.0", "css": "^0.1.0" }, "shim": { "*/*": { "deps": ["famous-polyfills", "../core/famous.css!"] } } }' &&\
    node ./jspm_meta_fix &&\

    # install leaflet, then build it, and create it's missing entry point.
    jspm install -y leaflet=github:RickMohr/Leaflet@better-inertial-scrolling -o '{ "registry": "npm", "main":"dist/leaflet", "dependencies": { "css": "jspm:css@^0.1.0" }, "shim": { "dist/leaflet": { "deps": ["./leaflet.css!"], "exports": "L" } } }' &&\
    cd party/jspm/github/RickMohr/Leaflet@better-inertial-scrolling/ && npm install &&\
    echo 'module.exports = require("github:RickMohr/Leaflet@better-inertial-scrolling/dist/leaflet");' > ../Leaflet@better-inertial-scrolling.js &&\
    cd - &&\

echo " --- All done."
