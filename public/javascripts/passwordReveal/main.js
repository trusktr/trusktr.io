import Surface from 'famous/core/Surface';
import Transform from 'famous/core/Transform';
import TransitionableTransform from 'famous/transitions/TransitionableTransform';
import Transitionable from 'famous/transitions/Transitionable';
import Easing from 'famous/transitions/Easing';
import HeaderFooterLayout from 'famous/views/HeaderFooterLayout';

import $ from 'jquery';

import Plane from 'javascripts/components/Plane';
import Molecule from 'javascripts/components/Molecule';
import {contextWithPerspective} from 'javascripts/components/utils';

var context  = contextWithPerspective(1000);
var mainMol  = new Molecule();
var mainNode = context.add(mainMol.getNode());

var resume = new Plane({
    //size: [800, 1100],
    properties: {
        "-webkit-filter": 'blur(7px)',
        "-moz-filter":    'blur(7px)',
        "-ms-filter":     'blur(7px)',
        "-o-filter":      'blur(7px)',
        "filter":           'blur(7px)'
    },
    content: '<iframe style="width: 100%; height: 100%" src="https://docs.google.com/viewer?embedded=true&url=trusktr.io/boring_resume.pdf"></iframe>',
});
var isFirefox = typeof InstallTrigger == 'object'? true: false;
var contentBlocker = new Plane({
    properties: {
        background: 'white'
    }
});

var layout = new HeaderFooterLayout({
    headerSize: 50,
    footerSize: 0
});

var headerMolecule = new Molecule();
var footerMolecule = new Molecule();
var loginLink = new Plane({
    content: '<a style="cursor: pointer">Login to view</a>',
    properties: {
        background:   '#333',
        color:        'pink',
        paddingRight: '20px',
        lineHeight:   "50px",
        textAlign:    "right",
        boxShadow:    '0px -30px 40px 40px rgba(0,0,0,0.8)',
    }
})

layout.header.add(headerMolecule).add(loginLink.getNode());

layout.content.add(resume.getNode());
layout.content.add( new Molecule({
    opacity: isFirefox? 1: 0
}).getNode()).add(contentBlocker.getNode());

layout.footer.add(footerMolecule).add(new Plane({
    content: "Footer",
    properties: {
        background: '#333',
        lineHeight: "50px",
        textAlign: "center"
    }
}).getNode());
mainNode.add(layout);

var passwordBoxMol = new Molecule({
    //size: [200,200],
    opacity: 0
});
var passwordBoxNode = mainNode.add(passwordBoxMol.getNode());

var passwordBox = new Plane({
    size: [200,200],
    classes: ['passwordBox'],
    content: '<h1>Login:</h1><input type="text" placeholder="username" /><br /><input type="password" placeholder="password" /><br /><button>Login</button><br />',
    properties: {
        display:    'none', // initially
        padding:    '10px',
        background: '#ddd',
        border:     '2px solid #aaa',
        boxShadow:  '4px 4px 30px 0px rgba(0,0,0,0.8)',
    }
});
passwordBoxNode.add(passwordBox.getNode());

var passwordBoxVisible = false;
var zoom               = new TransitionableTransform();
var fade               = new Transitionable(0);
var blur               = new Transitionable(7);

loginLink.componentHandler.on('deploy', function() {
    // TODO: Make input and button comonents to use instead of DOM so we can handle events in Famo.us instead of with jQUery.
    $('a').on('click', function() {
        contentBlocker.componentSurface.setProperties({
            display: 'block'
        });
        passwordBox.componentSurface.setProperties({
            display: 'block'
        });
        if (!passwordBoxVisible) {
            passwordBoxVisible = true;

            passwordBoxMol.componentMod.alignFrom(function() {
                return [0.1,0.1];
            });

            passwordBoxMol.componentMod.transformFrom(zoom);
            zoom.setTranslateZ(200, {duration: 1000, curve: Easing.outExpo});
            zoom.setRotateX(-Math.PI/4);
            zoom.setRotateX(0, {duration: 1000, curve: Easing.outExpo});

            passwordBoxMol.componentMod.opacityFrom(fade);
            fade.set(1, {duration: 1000, curve: Easing.outExpo});

            var momentaryBlur = 0;
            setTimeout(function() {
                blur.set(7, {duration: 1000, curve: 'easeOut'});
                var blurInterval = setInterval(function() {
                    momentaryBlur = blur.get();
                    resume.componentSurface.setProperties({
                        "-webkit-filter": 'blur('+momentaryBlur+'px)',
                        "-moz-filter":    'blur('+momentaryBlur+'px)',
                        "-ms-filter":     'blur('+momentaryBlur+'px)',
                        "-o-filter":      'blur('+momentaryBlur+'px)',
                        filter:           'blur('+momentaryBlur+'px)'
                    });
                    if (momentaryBlur == 0) clearInterval(blurInterval);
                }, 16);
            }, 500);
        }
    });
});

passwordBox.componentSurface.on('deploy', function() {
    // TODO: Make input and button comonents to use instead of DOM so we can handle events in Famo.us instead of with jQUery.
    $('button').on('click', function() {
        if ($('[type="text"]').val() == 'martian' && $('[type="password"]').val() == 'planet') {
            contentBlocker.componentSurface.setProperties({
                display: 'none'
            });
            if (passwordBoxVisible) {
                passwordBoxVisible = false;

                passwordBoxMol.componentMod.alignFrom(function() {
                    return [0.1,0.1];
                });

                passwordBoxMol.componentMod.transformFrom(zoom);
                zoom.setTranslateZ(0, {duration: 500, curve: Easing.inExpo});
                zoom.setRotateX(-Math.PI/4, {duration: 500, curve: Easing.inExpo});

                passwordBoxMol.componentMod.opacityFrom(fade);
                fade.set(0, {duration: 500, curve: Easing.inExpo}, function() {
                    passwordBox.componentSurface.setProperties({
                        display: 'none'
                    });
                });

                var momentaryBlur = 0;
                setTimeout(function() {
                    blur.set(0, {duration: 1000, curve: 'easeOut'});
                    var blurInterval = setInterval(function() {
                        momentaryBlur = blur.get();
                        resume.componentSurface.setProperties({
                            "-webkit-filter": 'blur('+momentaryBlur+'px)',
                            "-moz-filter":    'blur('+momentaryBlur+'px)',
                            "-ms-filter":     'blur('+momentaryBlur+'px)',
                            "-o-filter":      'blur('+momentaryBlur+'px)',
                            filter:           'blur('+momentaryBlur+'px)'
                        });
                        if (momentaryBlur == 0) clearInterval(blurInterval);
                    }, 16);
                }, 500);
            }
        }
    });
});
