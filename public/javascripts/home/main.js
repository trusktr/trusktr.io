import $ from 'jquery';

import Transform from 'famous/core/Transform';
import Transitionable from 'famous/transitions/Transitionable';
import Easing from 'famous/transitions/Easing';
import EventHandler from 'famous/core/EventHandler';
import MouseSync from 'famous/inputs/MouseSync';
import TouchSync from 'famous/inputs/TouchSync';
import GenericSync from 'famous/inputs/GenericSync';
    GenericSync.register({
        mouse: MouseSync,
        touch: TouchSync
    });

import Plane from 'infamous/Plane';
import Molecule from 'infamous/Molecule';
import {contextWithPerspective} from 'infamous/utils';

import stylus from "stylus";

var numberOfStylesheets = 3;
var countOfStylesheetsLoaded = 0;

// TODO: get Async to prevent the following callback noodles.
$.ajax('stylesheets/reset.styl', {
    complete: function(data) {
        stylus(data.responseText).render(function(err, css) {
            if (err) { console.log(err.message); }
            else { $('head').append('<style>'+css+'</style>'); }
            if (++countOfStylesheetsLoaded == numberOfStylesheets) {
                beFamous();
            }
        });
    }
});
$.ajax('stylesheets/password/main.css', {
    complete: function(data) {
        stylus(data.responseText).render(function(err, css) {
            if (err) { console.log(err.message); }
            else { $('head').append('<style>'+css+'</style>'); }
            if (++countOfStylesheetsLoaded == numberOfStylesheets) {
                beFamous();
            }
        });
    }
});
$.ajax('stylesheets/home/main.styl', {
    complete: function(data) {
        stylus(data.responseText).render(function(err, css) {
            if (err) { console.log(err.message); }
            else { $('head').append('<style>'+css+'</style>'); }
            if (++countOfStylesheetsLoaded == numberOfStylesheets) {
                beFamous();
            }
        });
    }
});

function beFamous() {
    var menuSide = 'left';
    //var menuSide = 'right';
    var menuWidth = 200;
    var menuHintSize = 10;
    var contentWidth = $(window).width()-menuHintSize;

    var context = contextWithPerspective(1000);

    // TODO: use a template engine for vanilla famous. Won't have to worry about this with famous-angular or meteor-famous-views
    var menuPlane = new Plane({
        size: [menuWidth + 0,undefined],
        content: ''
            +'<menu id="menu">'
                +'<li class="menuitem" style="color: #ccc">Joe Pea</li><br />'
                //+'<li class="sub menuitem">'
                    //+'<a href="/hello">about me</a>'
                //+'</li><br />'
                +'<li class="sub menuitem frame">'
                    +'<a target="_blank" href="/clobe">Clobe</a>'
                +'</li><br />'
                +'<li class="sub menuitem frame">'
                    +'<a target="_blank" href="/flipDiagonal">Diagonal Grid Flip</a>'
                +'</li><br />'
                +'<li class="sub menuitem frame">'
                    +'<a target="_blank" href="/passwordReveal">Password Prompt</a>'
                +'</li><br />'
                +'<li class="sub menuitem frame">'
                    +'<a target="_blank" href="/calendar">Date Picker</a>'
                +'</li><br />'
                +'<li class="sub menuitem frame">'
                    +'<a target="_blank" href="https://vs5k.trusktr.io">Voting System 5000</a>'
                +'</li><br />'
                +'<li class="sub menuitem frame">'
                    +'<a target="_blank" href="/password">Password Generator</a>'
                +'</li><br />'
                //+'<li class="sub menuitem frame">'
                    //+'<a target="_blank" href="http://ksb.sk8earth.com">Keep Skatin\' Bro</a>'
                //+'</li><br />'
                //+'<li class="sub menuitem frame">'
                    //+'<a target="_blank" href="http://creationofsociety.com">Creation of Society</a>'
                //+'</li><br />'
                //+'<li class="sub menuitem frame">'
                    //+'<a target="_blank" href="http://saccityexpress.com">Sac City Express</a>'
                //+'</li><br />'
                //+'<li class="sub menuitem frame">'
                    //+'<a target="_blank" href="http://str8wayent.net">Straightway</a>'
                //+'</li><br />'
                //+'<li class="sub menuitem frame">'
                    //+'<a target="_blank" href="http://bettafootwear.com/CrownYourFeet">Betta Footwear</a>'
                //+'</li><br />'
                +'<li class="sub menuitem frame">'
                    +'<a target="_blank" href="https://docs.google.com/viewer?embedded=true&url=trusktr.io/boring_resume.pdf">Resume</a>'
                +'</li><br />'
                //+'<li class="sub menuitem">'
                    //+'<a href="/portfolio">more...</a>'
                //+'</li><br />'
            +'</menu>'
        ,
        properties: {
            zIndex: '10'
        }
    });
    window.menuPlane = menuPlane;

    var framePlane = new Plane({
        size: [undefined,undefined],
        content: '<iframe src="/clobe" style="width: 100%; height: 100%"></iframe>',
        properties: {
            zIndex: '0',
        }
    });
    var fadePlane = new Plane({
        size: [undefined,undefined],
        classes: [
            (menuSide == 'left'? 'fadeRight': 'fadeLeft'),
            'hidden'
        ],
        properties: {
            zIndex: '100',
            pointerEvents: 'none'
        }
    });

    var mainMol = new Molecule();
    var menuMol = new Molecule({
        size: [menuWidth,undefined],
    });
    var contentMol = new Molecule({
        size: [contentWidth,undefined],
    });

    var alignment = (menuSide == "left"? 0: 1);
    var opacityTransition = new Transitionable(0);

    // TODO: replace menu easing with physics, using initial velocity and drag to slow it down, and stop immediately when it hit the limit.
    function openMenu() {
        contentMol.transform.halt();
        menuMol.transform.halt();
        contentMol.transform.setTranslateX((menuSide == 'left'? 1: -1)*menuWidth, {duration: 1000, curve: Easing.outExpo});
        menuMol.transform.setTranslateX(0, {duration: 1000, curve: Easing.outExpo});
        contentMol.transform.setRotateY((menuSide == 'left'? 1: -1)*Math.PI/8, {duration: 1000, curve: Easing.outExpo});
        opacityTransition.halt();
        opacityTransition.set(1, {duration: 1000, curve: Easing.outExpo});
        fadePlane.surface.removeClass('hidden');
    }
    window.openMenu = openMenu;
    function closeMenu() {
        contentMol.transform.halt();
        menuMol.transform.halt();
        contentMol.transform.setTranslateX((menuSide == 'left'? 1: -1)*menuHintSize, {duration: 1000, curve: Easing.outExpo});
        menuMol.transform.setTranslateX((menuSide == 'left'? -menuWidth+menuHintSize: +menuWidth-menuHintSize), {duration: 1000, curve: Easing.outExpo});
        contentMol.transform.setRotateY(0, {duration: 1000, curve: Easing.outExpo});
        opacityTransition.halt();
        opacityTransition.set(0, {duration: 1000, curve: Easing.outExpo}, function() {
            fadePlane.surface.addClass('hidden');
        });
    }
    window.closeMenu = closeMenu;
    function toggleMenu() {
        if (typeof toggleMenu.isOpen == 'undefined') {
            toggleMenu.isOpen = false;
        }

        if (toggleMenu.isOpen) {
            closeMenu();
            toggleMenu.isOpen = false;
        }
        else {
            openMenu();
            toggleMenu.isOpen = true;
        }
    }

    function onWindowSizeChange(event) {
        contentWidth = $(window).width()-menuHintSize;
        contentMol.setOptions({size: [contentWidth, undefined]});
    }

    mainMol.setOptions({
        origin: [alignment, 0.5],
        align: [alignment, 0.5]
    });
    contentMol.setOptions({
        origin: [alignment, 0.5],
        align: [alignment, 0.5]
    });

    // FIXME: Why the EFF must I also set align and origin on framePlane and
    // fadePlane when I've already set it on their parent (contentMol)?????
    framePlane.setOptions({
        origin: [alignment, 0.5],
        align: [alignment, 0.5]
    });
    fadePlane.setOptions({
        origin: [alignment, 0.5],
        align: [alignment, 0.5]
    });

    menuMol.setOptions({
        origin: [alignment, 0.5],
        align: [alignment, 0.5]
    });

    if (menuSide == 'left') {
        contentMol.transform.setTranslateX(menuHintSize);
        menuMol.transform.setTranslateX(-menuWidth+menuHintSize);
    }
    else {
        contentMol.transform.setTranslateX(-menuHintSize);
        menuMol.transform.setTranslateX(menuWidth-menuHintSize);
    }

    framePlane.transform.setTranslateZ(-1);
    fadePlane.transform.setTranslateZ(-0.0001);
    fadePlane.setOptions({opacity: opacityTransition});

    context.add(mainMol);

    mainMol.add(menuMol);
    mainMol.add(contentMol);
    contentMol.add(framePlane);
    contentMol.add(fadePlane);
    menuMol.add(menuPlane);

    var pushAreaWidth = 20; // the area on the screen edge that the user can touch and drag to push out the menu.
    var menuTouchPlane = new Plane({
        size: [menuWidth + pushAreaWidth - menuHintSize, undefined],
        properties: {
            background: 'pink',
            zIndex: '9' // below the menu
        }
    });
    window.menuTouchPlane = menuTouchPlane;
    // FIXME: WHY THE EFF must I also set align and origin on menuTouchPlane
    // when I've already set it on it's parent (menuMol)?????
    menuTouchPlane.setOptions({
        origin: [alignment, 0.5],
        align: [alignment, 0.5]
    });
    menuMol.add(menuTouchPlane);

    /*
     * EVENTS
     */
    var sync = new GenericSync(['touch']);
    var handler = new EventHandler();

    menuPlane.pipe(sync); // for touch events only
    menuTouchPlane.pipe(sync);
    sync.pipe(handler);

    // TODO: combine closeMenu/openMenu with this code by instead animating a transitionable between 0 and 1 for the animation state.
    var delta;
    handler.on('update', function(event) { // update == drag
        delta = event.delta;

        // stop current transitions if any.
        if (contentMol.transform.isActive()) { contentMol.transform.halt(); }
        if (menuMol.transform.isActive()) { menuMol.transform.halt(); }
        if (opacityTransition.isActive()) { opacityTransition.halt(); }

        // move the menu, following the user's drag. Don't let the user drag the menu past the menu width.
        // TODO: handle the right-side menu.
        // TODO: optimize by caching function call results instead of repeating.
        contentMol.transform.setTranslateX(Transform.getTranslate(contentMol.transform.get())[0] + delta[0]);
        menuMol.transform.setTranslateX(Transform.getTranslate(menuMol.transform.get())[0] + delta[0]);
        if (Transform.getTranslate(menuMol.transform.get())[0] > 0) {
            menuMol.transform.setTranslateX(0);
            contentMol.transform.setTranslateX(menuWidth);
        }
        else if (Transform.getTranslate(menuMol.transform.get())[0] < -menuWidth + menuHintSize) {
            menuMol.transform.setTranslateX(-menuWidth + menuHintSize);
            contentMol.transform.setTranslateX(0+menuHintSize);
        }
        contentMol.transform.setRotateY( (Math.PI/8) * (menuWidth + Transform.getTranslate(menuMol.transform.get())[0]) / menuWidth );
        opacityTransition.set((menuWidth + Transform.getTranslate(menuMol.transform.get())[0]) / menuWidth);
        fadePlane.surface.removeClass('hidden');
    });
    handler.on('end', function(event) {
        // TODO: optimize by caching function call results instead of repeating.
        if (Transform.getTranslate(menuMol.transform.get())[0] < (-menuWidth+menuHintSize)/2) {
            closeMenu();
        }
        else {
            openMenu();
        }
    });

    menuPlane.on('mouseenter', function() {
        openMenu();
    });
    menuPlane.on('mouseleave', function() {
        closeMenu();
    });

    menuPlane.on('deploy', function() {
        $('.menuitem a').on('click', function(event) {
            var _link = $(this);
            if (_link.parent().is('.frame')) {
                event.preventDefault();
                $('iframe').attr('src', _link.attr('href'));
            }
            else { }
        });
    });

    $(window).on('resize', onWindowSizeChange);

}
