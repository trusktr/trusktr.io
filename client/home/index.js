// TODO: home HTML markup, make into React component.
//<!DOCTYPE html>
//<html lang="en">
    //<head>
    //<!--
       //- This Source Code Form is subject to the terms of the Mozilla Public
       //- License, v. 2.0. If a copy of the MPL was not distributed with this
       //- file, You can obtain one at http://mozilla.org/MPL/2.0/.
       //-->
        //<title><%= title %></title>
        //<meta charset="utf8" />
        //<meta name="viewport" content="width=device-width, initial-scale=1" />
    //</head>
    //<body>

        //<!--Use this one-->
        //<script src='/party/jspm/system.src.js'></script>
        //<script src='jspm_config.js'></script>
        //<script>
            //System.paths['js/*'] = 'javascripts/*/main.js';
            //System.import('js/home');
        //</script>

        //<!--or this one.-->
        //<!--<script src='/party/jspm/traceur.src.js'></script>-->
        //<!--<script src='app.js'></script>-->
    //</body>
//</html>

// Globals
import $ from 'jquery';

//styles
import { Jss } from "jss"
import jssNested from 'jss-nested'
import reset from '../common/styles/reset'
import style from './style'
import 'famous/core/famous.css'

//infamous
import Plane from 'infamous/Plane';
import PushMenuLayout from 'infamous/PushMenuLayout';
import {contextWithPerspective} from 'infamous/utils';

//utils
import callAfter from 'army-knife/callAfter';

// apply page styles
let jss = new Jss()
jss.use(jssNested)
jss.createStyleSheet(reset, {named: false}).attach()
jss.createStyleSheet(style, {named: false}).attach()

export default
function beFamous() {
    var layout = new PushMenuLayout();

    // The menuPlane contains a collection of links made with traditional HTML.
    var menuPlane = new Plane({
        size: [layout.menuWidth + 0, undefined],

        // TODO: use a template engine. We won't have to worry about this with famous-angular or meteor-famous-views
        content: (`
            <menu id="menu">
                <li class="menuitem" style="color: #ccc">Joe Pea</li><br />

                <!--
                <li class="sub menuitem">
                    <a href="/hello">about me</a>
                </li><br />
                -->

                <li class="sub menuitem frame">
                    <a target="_blank" href="/mom2015">3D Mother\'s Day 2015</a>
                </li><br />
                <li class="sub menuitem frame">
                    <a target="_blank" href="/webglearth">Globe</a>
                </li><br />
                <li class="sub menuitem frame">
                    <a target="_blank" href="/clobe">Clobe</a>
                </li><br />
                <li class="sub menuitem frame">
                    <a target="_blank" href="/flipDiagonal">Diagonal Grid Flip</a>
                </li><br />
                <li class="sub menuitem frame">
                    <a target="_blank" href="/passwordReveal">Password Prompt</a>
                </li><br />
                <li class="sub menuitem frame">
                    <a target="_blank" href="/calendar">Date Picker</a>
                </li><br />
                <li class="sub menuitem frame">
                    <a target="_blank" href="https://vs5k.trusktr.io">Voting System 5000</a>
                </li><br />
                <li class="sub menuitem frame">
                    <a target="_blank" href="/password">Password Generator</a>
                </li><br />

                <!--
                <li class="sub menuitem frame">
                    <a target="_blank" href="http://ksb.sk8earth.com">Keep Skatin\ Bro</a>
                </li><br />
                <li class="sub menuitem frame">
                    <a target="_blank" href="http://creationofsociety.com">Creation of Society</a>
                </li><br />
                <li class="sub menuitem frame">
                    <a target="_blank" href="http://saccityexpress.com">Sac City Express</a>
                </li><br />
                <li class="sub menuitem frame">
                    <a target="_blank" href="http://str8wayent.net">Straightway</a>
                </li><br />
                <li class="sub menuitem frame">
                    <a target="_blank" href="http://bettafootwear.com/CrownYourFeet">Betta Footwear</a>
                </li><br />
                -->

                <li class="sub menuitem frame">
                    <a target="_blank" href="https://docs.google.com/viewer?embedded=true&url=trusktr.io/boring_resume.pdf">Resume</a>
                </li><br />

                <!--
                <li class="sub menuitem">
                    <a href="/portfolio">more...</a>
                </li><br />
                -->
            </menu>
        `),

        properties: {
            zIndex: '10'
        }
    });

    var contentPlane = new Plane({
        size: [undefined,undefined],
        content: '<div class="content-area" style="width: 100%; height: 100%"><iframe class="content-iframe" src="" style="width: 100%; height: 100%"></iframe></div>',
        properties: {
            zIndex: '0',
        }
    });

    var context = contextWithPerspective(1000);

    // FIXME: Why the EFF must I also set align and origin on contentPlane when
    // I've already set it on it's parent (layout.contentMol)?????
    contentPlane.setOptions({
        origin: [layout.alignment, 0.5],
        align: [layout.alignment, 0.5]
    });

    contentPlane.transform.setTranslateZ(-1); // TODO: move this into PushMenuLayout

    // TODO use layout.setContent/setMenu
    layout.contentMol.add(contentPlane);
    layout.menuMol.add(menuPlane);

    context.add(layout);


    //TODO: the following goes in set* methods of PushMenuLayout {{

    // When you add something to the menu area of a PushMenuLayout, the
    // PushMenuLayout will automatically pipe events from the thing to the
    // PushMenuLayout's touch sync if the thing you added to the menu are has a
    // pipe method (falling back to subscribe).
    //
    // If whatever you put in the menu area doesn't have a pipe or subscribe
    // method (e.g. Modifiers, RenderNodes, etc), be sure to pipe it's events
    // (or it's children's events) to the menu area's touch sync so the menu
    // will be properly reactive to touch.
    menuPlane.pipe(layout.touchSync);

    // A PushMenuLayout by default opens and closes only by dragging with touch
    // and ignores mouse events. You can add your own handling for mouse events
    // like this:
    menuPlane.on('mouseenter', function() {
        if (!layout.isOpening) {
            layout.openMenu();
        }
    });
    menuPlane.on('mouseleave', function() {
        if (!layout.isClosing) {
            layout.closeMenu();
        }
    });
    // }}

    // TODO: set this with a route instead.
    var loadFirstMenuItemContent = callAfter(2, function() {
        // set the content of the iframe to that of the first menu item.
        $('iframe.content-iframe').attr('src', $('.menuitem a').attr('href'));
    });

    // Set up the click handlers to change the content of the iframe.
    menuPlane.on('deploy', function() {
        loadFirstMenuItemContent();
        $('.menuitem a').on('click', function(event) {
            var _link = $(this);
            layout.closeMenu(function() {
                if (_link.parent().is('.frame')) {
                    $('iframe').attr('src', _link.attr('href'));
                }
            });
            event.preventDefault();
        });
    });

    contentPlane.on('deploy', function() {
        loadFirstMenuItemContent();
    });
}
