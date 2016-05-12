import './silence-react'
import React from 'react'
import ReactDOM from 'react-dom'

import startup from 'awaitbox/meteor/startup'

import MotorHTMLNode from 'infamous/motor-html/node'
import MotorHTMLScene from 'infamous/motor-html/scene'
import Motor from 'infamous/motor/Motor'

//styles
import jss from "/client/common/jss-configured"
import reset from './common/styles/reset'

import './routes'

// apply global reset
jss.createStyleSheet(reset, {named: false}).attach()

class SomeThreeDeeComponent extends React.Component {
    render() {
        return (
            <motor-node className="three-dee"
                align="0.5, 0.5, 0.5"
                absoluteSize = "100, 100, 100"
                style={{background: 'rgba(161,212,144,0.5)'}}
                data-oh=", yeaas, baby."
                >

                <h3>This is <em>real</em> html.</h3>
            </motor-node>
        )
    }

    async componentDidMount() {
        let threeDee = ReactDOM.findDOMNode(this)

        await threeDee.ready

        let rotation = 0
        Motor.addRenderTask(function() {
            threeDee.node.rotation = [rotation++, rotation, 0]
        })
    }
}

class Main extends React.Component {
    render() {
        return (
            <div className="content">
                <h1>A 3D Scene:</h1>
                <div id="who-cares-about-this-id">
                    <div className="inner-wrapper-for-no-reason-at-all">
                        <motor-scene id="scene2" absoluteSize="300, 300, 0">
                            <motor-node ref="whatever"
                                sizeMode="proportional, proportional, proportional"
                                proportionalSize="1,1,1"
                                >

                                <div className="border"></div>

                                <SomeThreeDeeComponent />

                            </motor-node>
                        </motor-scene>
                    </div>
                </div>
            </div>
        )
    }

    async componentDidMount() {
        let whatever = ReactDOM.findDOMNode(this.refs.whatever)

        await whatever.ready

        let rotation = 0
        Motor.addRenderTask(function() {
            whatever.node.rotation = [0, rotation++ *0.5, 0]
        })
    }
}

async function main() {
    await startup()
    ReactDOM.render(<Main />, document.querySelector('#app'))
}

main()











/////////////////////////////////////////////////////////////////////

//import $ from 'jquery';

////famous
//import 'famous/src/core/famous.css'

////infamous
//import Plane from 'infamous/Plane';
//import PushMenuLayout from 'infamous/PushMenuLayout';
//import {contextWithPerspective} from 'infamous/utils';

////utils
//import callAfter from 'army-knife/callAfter';

//const menuColor = 'rgb(45,45,45)'

//const style = {
    //html: {
        //'& body': {
            //background: '#222',

            //'& .hidden': {
                //display: 'none',
            //},

            //'& .invisible': {
                //visibility: 'visible',
            //},

            //'& #menu': {
                //'box-sizing': 'border-box',
                //position: 'absolute',
                //width: '100%',
                //height: '100%',
                //padding: '20px',
                //margin: 0,
                //'list-style': 'none',
                //background: menuColor,
                //display: 'block',
                //'font-size': '1.3rem',

                //'& li': {
                    //'padding-bottom': '10px',
                    //display: 'inline',
                    ////'text-shadow': '0px 4px 2px #000',
                //},
                //'& a': {
                    //'text-decoration': 'none',
                    //color: '#1DD326',
                    //'border-radius': '2px',
                    //padding: '0 3px',
                //},
                //'& a:hover': {
                    //'text-decoration': 'none',
                    //color: 'rgb(45,45,45)',
                    //background: '#1DD326',
                //},
                //'& .sub.menuitem': {
                    //'font-size': '0.8rem',
                //},
                //'&:after': {
                    //content: '""',
                    //position: 'absolute',
                    //top: '50%',
                    //'margin-top': '-10px',
                    //left: '100%',

                    ////triangle
                    ////TODO: Move this into PushMenuLayout, and make optional.
                    //width: 0,
                    //height: 0,
                    //'border-top': '10px solid transparent',
                    //'border-left': '10px solid '+menuColor,
                    //'border-bottom': '10px solid transparent',
                //}
            //}
        //}
    //}
//}

//jss.createStyleSheet(style, {named: false}).attach()

//function home() {
    //const layout = new PushMenuLayout();

    //// The menuPlane contains a collection of links made with traditional HTML.
    //const menuPlane = new Plane({
        //size: [layout.menuWidth + 0, undefined],

        //// TODO: use a template engine.
        //content: ''+
            //'<menu id="menu">'+
                //'<li class="menuitem" style="color: #ccc">Joe Pea</li><br />'+
                ////'<li class="sub menuitem">'+
                    ////'<a href="/hello">about me</a>'+
                ////'</li><br />'+
                //'<li class="sub menuitem frame">'+
                    //'<a target="_blank" href="/pages/mom2015/index.html">3D Mother\'s Day 2015</a>'+
                //'</li><br />'+
                ////'<li class="sub menuitem frame">'+
                    ////'<a target="_blank" href="/pages/webglearth/index.html">Globe</a>'+
                ////'</li><br />'+
                //'<li class="sub menuitem frame">'+
                    //'<a target="_blank" href="/pages/clobe/index.html">Clobe</a>'+
                //'</li><br />'+
                //'<li class="sub menuitem frame">'+
                    //'<a target="_blank" href="/pages/flipDiagonal/index.html">Diagonal Grid Flip</a>'+
                //'</li><br />'+
                //'<li class="sub menuitem frame">'+
                    //'<a target="_blank" href="/pages/passwordReveal/index.html">Password Prompt</a>'+
                //'</li><br />'+
                ////'<li class="sub menuitem frame">'+
                    ////'<a target="_blank" href="/pages/calendar/index.html">Date Picker</a>'+
                ////'</li><br />'+
                ////'<li class="sub menuitem frame">'+
                    ////'<a target="_blank" href="https://vs5k.trusktr.io">Voting System 5000</a>'+
                ////'</li><br />'+
                //'<li class="sub menuitem frame">'+
                    //'<a target="_blank" href="/pages/password/index.html">Password Generator</a>'+
                //'</li><br />'+
                ////'<li class="sub menuitem frame">'+
                    ////'<a target="_blank" href="http://ksb.sk8earth.com">Keep Skatin\' Bro</a>'+
                ////'</li><br />'+
                ////'<li class="sub menuitem frame">'+
                    ////'<a target="_blank" href="http://creationofsociety.com">Creation of Society</a>'+
                ////'</li><br />'+
                ////'<li class="sub menuitem frame">'+
                    ////'<a target="_blank" href="http://saccityexpress.com">Sac City Express</a>'+
                ////'</li><br />'+
                ////'<li class="sub menuitem frame">'+
                    ////'<a target="_blank" href="http://str8wayent.net">Straightway</a>'+
                ////'</li><br />'+
                ////'<li class="sub menuitem frame">'+
                    ////'<a target="_blank" href="http://bettafootwear.com/CrownYourFeet">Betta Footwear</a>'+
                ////'</li><br />'+
                //'<li class="sub menuitem frame">'+
                    //'<a target="_blank" href="https://docs.google.com/viewer?embedded=true&url=trusktr.io/boring_resume.pdf">Resume</a>'+
                //'</li><br />'+
                ////'<li class="sub menuitem">'+
                    ////'<a href="/portfolio">more...</a>'+
                ////'</li><br />'+
            //'</menu>'+
        //'',

        //properties: {
            //zIndex: '10'
        //}
    //});

    //console.log('created menuPlane:', menuPlane)

    //const iframePlane = new Plane({
        //size: [undefined,undefined],
        //content: '<iframe src="" style="width: 100%; height: 100%"></iframe>',
        //properties: {
            //zIndex: '0',
        //}
    //});

    //const context = contextWithPerspective(1000);

    //// FIXME: Why the EFF must I also set align and origin on iframePlane when
    //// I've already set it on it's parent (layout.contentMol)?????
    //iframePlane.setOptions({
        //origin: [layout.alignment, 0.5],
        //align: [layout.alignment, 0.5]
    //});

    //iframePlane.transform.setTranslateZ(-1); // TODO: move this into PushMenuLayout

    //layout.contentMol.node.add(iframePlane.node);
    //layout.menuMol.node.add(menuPlane.node);

    //context.add(layout.node);

    //// When you add something to the menu area of a PushMenuLayout, the
    //// PushMenuLayout will automatically pipe events from the thing to the
    //// PushMenuLayout's touch sync if the thing you added to the menu are has a
    //// pipe method (falling back to subscribe).
    ////
    //// If whatever you put in the menu area doesn't have a pipe or subscribe
    //// method (e.g. Modifiers, RenderNodes, etc), be sure to pipe it's events
    //// (or it's children's events) to the menu area's touch sync so the menu
    //// will be properly reactive to touch.
    //menuPlane.pipe(layout.touchSync);

    //// A PushMenuLayout by default opens and closes only by dragging with touch
    //// and ignores mouse events. You can add your own handling for mouse events
    //// like this:
    //menuPlane.on('mouseenter', function() {
        //if (!layout.isOpening) {
            //layout.openMenu();
        //}
    //});
    //menuPlane.on('mouseleave', function() {
        //if (!layout.isClosing) {
            //layout.closeMenu();
        //}
    //});

    //const loadFirstMenuItemContent = callAfter(2, function() {
        //$('iframe').attr('src', $('.menuitem a').attr('href'));
    //});

    //// Set up the click handlers to change the content of the iframe.
    //menuPlane.on('deploy', function() {
        //loadFirstMenuItemContent();
        //$('.menuitem a').on('click', function(event) {
            //const _link = $(this);
            //layout.closeMenu(function() {
                //if (_link.parent().is('.frame')) {
                    //$('iframe').attr('src', _link.attr('href'));
                //}
            //});
            //event.preventDefault();
        //});
    //});

    //iframePlane.on('deploy', function() {
        //loadFirstMenuItemContent();
    //});
//}
