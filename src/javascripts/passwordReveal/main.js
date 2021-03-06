import 'famous/core/famous.css'
import Surface from 'famous/core/Surface';
import Transform from 'famous/core/Transform';
import TransitionableTransform from 'famous/transitions/TransitionableTransform';
import Transitionable from 'famous/transitions/Transitionable';
import Easing from 'famous/transitions/Easing';
import HeaderFooterLayout from 'famous/views/HeaderFooterLayout';

import $ from 'jquery';

import Plane from 'infamous/Plane';
import Molecule from 'infamous/Molecule';
import {contextWithPerspective} from 'infamous/utils';

import jss from 'jss'
import preset from 'jss-preset-default'
import reset from '../common/styles/reset'
import style from './style'

jss.setup(preset())
jss.createStyleSheet(reset).attach()
jss.createStyleSheet(style).attach()

beFamous()

function beFamous() {

    var context  = contextWithPerspective(1000);
    var mainMol  = new Molecule();
    var mainNode = context.add(mainMol);

    var resume = new Plane({
        //size: [800, 1100],
        properties: {
            "-webkit-filter": 'blur(7px)',
            "-moz-filter":    'blur(7px)',
            "-ms-filter":     'blur(7px)',
            "-o-filter":      'blur(7px)',
            "filter":           'blur(7px)',
            zIndex: '0',
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
    var loginLinkBar = new Plane({
        content: '<a style="cursor: pointer">Login to view</a>',
        classes: ['bg-color-5', 'font-color-1', 'border-color-5-dark'],
        properties: {
            borderBottomStyle: "solid",
            paddingRight: '20px',
            lineHeight:   '50px',
            textAlign:    'right',
            boxShadow:    '0px -30px 40px 40px rgba(0,0,0,0.8)',
        }
    })

    layout.header.add(headerMolecule).add(loginLinkBar);

    layout.content.add(resume);
    layout.content.add( new Molecule({ // transparent overlay to prevent interaction on the resume.
        opacity: isFirefox? 1: 0
    })).add(contentBlocker);

    layout.footer.add(footerMolecule).add(new Plane({
        content: "Footer",
        properties: {
            background: '#333',
            lineHeight: "50px",
            textAlign: "center"
        }
    }));
    mainNode.add(layout);

    var passwordBoxMol = new Molecule({
        //size: [200,200],
        opacity: 0
    });
    var passwordBoxNode = mainNode.add(passwordBoxMol);

    var passwordBox = new Plane({
        size: [200,200],
        classes: ['passwordBox', 'bg-color-5', 'border-color-5-dark'],
        content: '<h1 class="font-color-1">Login:</h1><form name="login" action="/" method="post"><input type="text" class="bg-color-4 font-color-1" name="username" placeholder="username (martian)" /><br /><input type="password" class="bg-color-4 font-color-1" name="password" placeholder="password (planet)" /><br /><button class="font-color-1" type="submit">Login</button></form>',
        properties: {
            display:    'none', // initially
            padding:    '10px',
            borderStyle:'solid',
            borderWidth: '2px',
            boxShadow:  '4px 4px 30px 0px rgba(0,0,0,0.8)',
            zIndex: '1000',
        }
    });
    passwordBoxNode.add(passwordBox);

    var passwordBoxVisible = false;
    var zoom               = new TransitionableTransform();
    var fade               = new Transitionable(0);
    var blur               = new Transitionable(7);

    loginLinkBar.on('deploy', function() {
        // TODO: Make input and button comonents to use instead of DOM so we can handle events in Famo.us instead of with jQUery.
        $('a').on('click', function() {
            contentBlocker.surface.setProperties({
                display: 'block'
            });
            passwordBox.surface.setProperties({
                display: 'block'
            });
            if (!passwordBoxVisible) {
                passwordBoxVisible = true;

                passwordBoxMol.setOptions({origin: [0.5,0.1]});

                passwordBoxMol.transform = zoom;
                zoom.setTranslateZ(1);
                //zoom.setTranslateZ(200, {duration: 1000, curve: Easing.outExpo});
                zoom.setScale([0.7,0.7,0.7]);
                zoom.setScale([1,1,1], {duration: 1000, curve: Easing.outExpo});
                zoom.setRotateX(-Math.PI/2);
                zoom.setRotateX(0, {duration: 1000, curve: Easing.outExpo});

                passwordBoxMol.setOptions({opacity: fade});
                fade.set(1, {duration: 1000, curve: Easing.outExpo});

                var momentaryBlur = 0;
                setTimeout(function() {
                    blur.set(7, {duration: 1000, curve: 'easeOut'});
                    var blurInterval = setInterval(function() {
                        momentaryBlur = blur.get();
                        resume.surface.setProperties({
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

    passwordBox.surface.on('deploy', function() {
        // TODO: Make input and button comonents to use instead of DOM so we can handle events in Famo.us instead of with jQUery.
        $('form').on('submit', function(event) {
            event.preventDefault();
            if ($('[type="text"]').val() == 'martian' && $('[type="password"]').val() == 'planet') {
                console.log('Submitted!')
                contentBlocker.surface.setProperties({
                    display: 'none'
                });
                if (passwordBoxVisible) {
                    passwordBoxVisible = false;

                    passwordBoxMol.setOptions({align: [0.1,0.1]});

                    passwordBoxMol.transform = zoom;
                    zoom.setTranslateZ(1, {duration: 500, curve: Easing.inExpo});
                    zoom.setScale([1.3,1.3,1.3], {duration: 500, curve: Easing.inExpo});
                    //zoom.setRotateX(-Math.PI/4, {duration: 500, curve: Easing.inExpo});

                    passwordBoxMol.setOptions({opacity: fade});
                    fade.set(0, {duration: 500, curve: Easing.inExpo}, function() {
                        passwordBox.surface.setProperties({
                            display: 'none'
                        });
                    });

                    var momentaryBlur = 0;
                    setTimeout(function() {
                        blur.set(0, {duration: 1000, curve: 'easeOut'});
                        var blurInterval = setInterval(function() {
                            momentaryBlur = blur.get();
                            resume.surface.setProperties({
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
}
