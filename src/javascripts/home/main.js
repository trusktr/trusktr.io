// Globals
import $ from 'jquery';

//styles
import jss from "jss"
import jssNested from 'jss-nested'
import reset from '../common/styles/reset'
import style from './style'

//famous
import 'famous/core/famous.css'

//infamous
import Plane from 'infamous/Plane';
import PushMenuLayout from 'infamous/PushMenuLayout';
import {contextWithPerspective} from 'infamous/utils';

//utils
import callAfter from 'army-knife/callAfter';

// apply page styles
jss.use(jssNested)
jss.createStyleSheet(reset).attach()
jss.createStyleSheet(style).attach()

beFamous()
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
                    <a href="/pages/hello/index.html">about me</a>
                </li><br />
                -->

                <li class="sub menuitem frame">
                    <a target="_blank" href="/pages/mom2015/index.html">3D Mother\'s Day 2015</a>
                </li><br />
                <li class="sub menuitem frame">
                    <a target="_blank" href="/pages/webglearth/index.html">Globe</a>
                </li><br />
                <li class="sub menuitem frame">
                    <a target="_blank" href="/pages/clobe/index.html">Clobe</a>
                </li><br />
                <li class="sub menuitem frame">
                    <a target="_blank" href="/pages/flipDiagonal/index.html">Diagonal Grid Flip</a>
                </li><br />
                <li class="sub menuitem frame">
                    <a target="_blank" href="/pages/passwordReveal/index.html">Password Prompt</a>
                </li><br />
                <li class="sub menuitem frame">
                    <a target="_blank" href="/pages/calendar/index.html">Date Picker</a>
                </li><br />
                <li class="sub menuitem frame">
                    <a target="_blank" href="https://vs5k.trusktr.io/index.html">Voting System 5000</a>
                </li><br />
                <li class="sub menuitem frame">
                    <a target="_blank" href="/pages/password/index.html">Password Generator</a>
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
                    <a href="/pages/portfolio/index.html">more...</a>
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
        content: '<iframe class="content-iframe" src="" style="width: 100%; height: 100%"></iframe>',
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
