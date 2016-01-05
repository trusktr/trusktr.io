#!/usr/bin/env sh

# configure a custom end point for libraries on my server.
jspm config endpoints.hypership.handler 'jspm-git' &&\
jspm config endpoints.hypership.baseurl 'https://g.trusktr.io/' &&\

# clean files and start over. This prevents some errors I've experienced otherwise.
rm -rf party/jspm/* &&\
rm -f jspm_config.js &&\

# install default packages.
jspm install -y &&\

# TODO: jspm.overrides can be used instead of this!!
    #jspm install -y bootstrap@^3.2.0 -o '{ "registry": "jspm", "dependencies": { "jquery": "^2.1.1", "css": "^0.1.0" }, "shim": { "js/bootstrap": { "deps": ["jquery", "../css/bootstrap.min.css!", "../css/bootstrap-theme.min.css!"] }, "css/bootstrap-theme.min.css!": { "deps": ["./bootstrap.min.css!"] } } }' &&\
    #jspm install -y bootstrap-datepicker=github:eternicode/bootstrap-datepicker@^1.3.0 -o '{ "registry": "jspm", "main": "js/bootstrap-datepicker.js", "dependencies": { "bootstrap": "^3.2.0" } }' &&\
    #jspm install -y jquery-tooltipster=github:iamceege/tooltipster@^3.2.6 -o '{ "registry": "jspm", "dependencies": { "jquery": "^2.1.1", "css": "^0.1.0" }, "main": "js/jquery.tooltipster", "shim": { "js/jquery.tooltipster": { "deps": ["jquery", "../css/tooltipster.css!"] } } }' &&\

    # (not needed anymore!?) fix the the Famous meta properties to make famous work with jspm.
    #node ./jspm_meta_fix &&\

    # install leaflet, then build it, and create it's missing entry point.
    #jspm install -y leaflet=github:RickMohr/Leaflet@better-inertial-scrolling -o '{ "registry": "jspm", "main":"dist/leaflet", "dependencies": { "css": "^0.1.0" }, "shim": { "dist/leaflet": { "deps": ["./leaflet.css!"], "exports": "L" } } }' &&\
    cd party/jspm/github/RickMohr/Leaflet@better-inertial-scrolling/ && npm install &&\
    echo 'module.exports = require("github:RickMohr/Leaflet@better-inertial-scrolling/dist/leaflet");' > ../Leaflet@better-inertial-scrolling.js &&\
    cd - &&\

echo " --- All done."
