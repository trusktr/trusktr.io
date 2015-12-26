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
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
    </head>
    <body>
        <script src='/party/jspm/system.src.js'></script>
        <script src='jspm_config.js'></script>
        <script type="module">
            System.paths['js/*'] = 'javascripts/*/main.js';
            System.import('js/giants');
        </script>
    </body>
</html>

