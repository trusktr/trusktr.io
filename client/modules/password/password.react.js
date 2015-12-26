<!DOCTYPE html>
<html lang="en">
    <head>
    <!--
       - This Source Code Form is subject to the terms of the Mozilla Public
       - License, v. 2.0. If a copy of the MPL was not distributed with this
       - file, You can obtain one at http://mozilla.org/MPL/2.0/.
       -->
        <title><%= title %></title>
        <meta charset="utf8" />
        <link rel="stylesheet" href="/stylesheets/password/main.css" />
        <!-- TODO?: make a common header file for most pages.  -->
    </head>
    <body>
        <div id="generator">
            <h1 id="password">Move your cursor to generate randomness.</h1>
            <button id="generate" disabled="disabled">generate password</button>
        </div>

        <script src='/party/jspm/system.src.js'></script>
        <script src='jspm_config.js'></script>
        <script type="module">
            System.paths['js/*'] = 'javascripts/*/main.js';
            System.import('js/password');
        </script>
    </body>
</html>