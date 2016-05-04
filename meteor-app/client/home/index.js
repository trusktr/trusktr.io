
// 2 ////////////////////////////////////////////////////////

//import Scene from 'infamous/motor/Scene'
//import Node from 'infamous/motor/Node'

//export default
//async function home() {}

//let scene = new Scene()
//scene.sizeMode = ['absolute', 'absolute', 'absolute']
//scene.absoluteSize = [500, 500, 500]

//let node = new Node()
//node.absoluteSize = [200,200,0]
//node._el.element.innerHTML = '<br><br><span>Hello world!</span>'

//scene.addChild(node)

//let node2 = new Node
//node2.absoluteSize = [10,10,0]
//node2.position = [0,100,-100]
//node2._el.element.innerHTML = '<span>1</span>'

//let node3 = new Node
//node3.absoluteSize = [10,10,0]
//node3.position = [100,0,100]
//node3._el.element.innerHTML = '<span>2</span>'

//node.addChild(node2)
//node.addChild(node3)

//let rotation = 0

//node.addRenderTask(function() {
    //rotation++

    //node.rotation = [rotation, 0, rotation]
//})

// 1 ////////////////////////////////////////////////////////

//import $ from 'jquery';
//import documentReady from 'awaitbox/dom/documentReady'

//import MotorHTMLNode from 'infamous/motor-html/node'
//import MotorHTMLScene from 'infamous/motor-html/scene'

//export default
//async function home() {

    //await documentReady()

    //const node1 = $('#scene1 > motor-node')[0].node
    //const node2 = $('#scene2 > motor-node')[0].node
    //const threeDee = document.querySelector('.three-dee').node

    //// make some rotation baby.
    //let r = 0

    //node1.addRenderTask(function(timestamp) {
        //r += 1
        //node1.rotation = [0, 30.0+r, 0]
    //})

    //node2.addRenderTask(function loop2(timestamp) {
        //node2.rotation = [0, r*0.5, 0]

        //if (r > 192)
            //node2.removeRenderTask(loop2)
    //})

    //threeDee.addRenderTask(function loop3(timestamp) {
        //threeDee.rotation = [r*2.0, r*3.0, 0]

        //if (r > 192)
            //threeDee.removeRenderTask(loop3)
    //})

//}

// 0 ////////////////////////////////////////////////////////

import $ from 'jquery';

//styles
import jss from "/client/common/jss-configured"
import style from './style'

//famous
import 'famous/src/core/famous.css'

//infamous
import Plane from 'infamous/Plane';
import PushMenuLayout from 'infamous/PushMenuLayout';
import {contextWithPerspective} from 'infamous/utils';

//utils
import callAfter from 'army-knife/callAfter';

jss.createStyleSheet(style, {named: false}).attach()

export default
function home() {
    const layout = new PushMenuLayout();

    // The menuPlane contains a collection of links made with traditional HTML.
    const menuPlane = new Plane({
        size: [layout.menuWidth + 0, undefined],

        // TODO: use a template engine.
        content: ''+
            '<menu id="menu">'+
                '<li class="menuitem" style="color: #ccc">Joe Pea</li><br />'+
                //'<li class="sub menuitem">'+
                    //'<a href="/hello">about me</a>'+
                //'</li><br />'+
                '<li class="sub menuitem frame">'+
                    '<a target="_blank" href="/pages/mom2015/index.html">3D Mother\'s Day 2015</a>'+
                '</li><br />'+
                //'<li class="sub menuitem frame">'+
                    //'<a target="_blank" href="/pages/webglearth/index.html">Globe</a>'+
                //'</li><br />'+
                '<li class="sub menuitem frame">'+
                    '<a target="_blank" href="/pages/clobe/index.html">Clobe</a>'+
                '</li><br />'+
                '<li class="sub menuitem frame">'+
                    '<a target="_blank" href="/pages/flipDiagonal/index.html">Diagonal Grid Flip</a>'+
                '</li><br />'+
                '<li class="sub menuitem frame">'+
                    '<a target="_blank" href="/pages/passwordReveal/index.html">Password Prompt</a>'+
                '</li><br />'+
                //'<li class="sub menuitem frame">'+
                    //'<a target="_blank" href="/pages/calendar/index.html">Date Picker</a>'+
                //'</li><br />'+
                //'<li class="sub menuitem frame">'+
                    //'<a target="_blank" href="https://vs5k.trusktr.io">Voting System 5000</a>'+
                //'</li><br />'+
                '<li class="sub menuitem frame">'+
                    '<a target="_blank" href="/pages/password/index.html">Password Generator</a>'+
                '</li><br />'+
                //'<li class="sub menuitem frame">'+
                    //'<a target="_blank" href="http://ksb.sk8earth.com">Keep Skatin\' Bro</a>'+
                //'</li><br />'+
                //'<li class="sub menuitem frame">'+
                    //'<a target="_blank" href="http://creationofsociety.com">Creation of Society</a>'+
                //'</li><br />'+
                //'<li class="sub menuitem frame">'+
                    //'<a target="_blank" href="http://saccityexpress.com">Sac City Express</a>'+
                //'</li><br />'+
                //'<li class="sub menuitem frame">'+
                    //'<a target="_blank" href="http://str8wayent.net">Straightway</a>'+
                //'</li><br />'+
                //'<li class="sub menuitem frame">'+
                    //'<a target="_blank" href="http://bettafootwear.com/CrownYourFeet">Betta Footwear</a>'+
                //'</li><br />'+
                '<li class="sub menuitem frame">'+
                    '<a target="_blank" href="https://docs.google.com/viewer?embedded=true&url=trusktr.io/boring_resume.pdf">Resume</a>'+
                '</li><br />'+
                //'<li class="sub menuitem">'+
                    //'<a href="/portfolio">more...</a>'+
                //'</li><br />'+
            '</menu>'+
        '',

        properties: {
            zIndex: '10'
        }
    });

    console.log('created menuPlane:', menuPlane)

    const iframePlane = new Plane({
        size: [undefined,undefined],
        content: '<iframe src="" style="width: 100%; height: 100%"></iframe>',
        properties: {
            zIndex: '0',
        }
    });

    const context = contextWithPerspective(1000);

    // FIXME: Why the EFF must I also set align and origin on iframePlane when
    // I've already set it on it's parent (layout.contentMol)?????
    iframePlane.setOptions({
        origin: [layout.alignment, 0.5],
        align: [layout.alignment, 0.5]
    });

    iframePlane.transform.setTranslateZ(-1); // TODO: move this into PushMenuLayout

    layout.contentMol.node.add(iframePlane.node);
    layout.menuMol.node.add(menuPlane.node);

    context.add(layout.node);

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

    const loadFirstMenuItemContent = callAfter(2, function() {
        $('iframe').attr('src', $('.menuitem a').attr('href'));
    });

    // Set up the click handlers to change the content of the iframe.
    menuPlane.on('deploy', function() {
        loadFirstMenuItemContent();
        $('.menuitem a').on('click', function(event) {
            const _link = $(this);
            layout.closeMenu(function() {
                if (_link.parent().is('.frame')) {
                    $('iframe').attr('src', _link.attr('href'));
                }
            });
            event.preventDefault();
        });
    });

    iframePlane.on('deploy', function() {
        loadFirstMenuItemContent();
    });
}