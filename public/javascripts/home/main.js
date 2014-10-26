import $ from 'jquery';

import Transform from 'famous/core/Transform';
import Transitionable from 'famous/transitions/Transitionable';
import Easing from 'famous/transitions/Easing';

import Plane from 'javascripts/components/Plane';
import Molecule from 'javascripts/components/Molecule';
import {contextWithPerspective} from 'javascripts/components/utils';

import stylus from "stylus";
    $.ajax('stylesheets/reset.styl', {
        complete: function(data) {
            stylus(data.responseText).render(function(err, css) {
                if (err) { console.log(err.message); }
                else { $('head').append('<style>'+css+'</style>'); }
            });
        }
    });
    $.ajax('stylesheets/password/main.css', {
        complete: function(data) {
            console.log(data);
            stylus(data.responseText).render(function(err, css) {
                if (err) { console.log(err.message); }
                else { $('head').append('<style>'+css+'</style>'); }
            });
        }
    });
    $.ajax('stylesheets/home/main.styl', {
        complete: function(data) {
            stylus(data.responseText).render(function(err, css) {
                if (err) { console.log(err.message); }
                else { $('head').append('<style>'+css+'</style>'); }
            });
        }
    });

var menuSide = 'left';
//var menuSide = 'right';
var menuWidth = 200;
var menuHintSize = 10;
var contentWidth = $(window).width()-menuHintSize;

var context = contextWithPerspective(1000);

function onWindowSizeChange(event) {
    contentWidth = $(window).width()-menuHintSize;
    contentMol.componentMod.sizeFrom([contentWidth, undefined]);
}
$(window).on('resize', onWindowSizeChange);

var menuPlane = new Plane({
    size: [undefined,undefined],
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
        zIndex: '1000',
    }
});

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
    }
});

var mainMol = new Molecule();
var menuMol = new Molecule({
    size: [menuWidth,undefined],
});
var contentMol = new Molecule({
    size: [contentWidth,undefined],
});

if (menuSide == 'left') {
    contentMol.componentTransform.setTranslateX(menuHintSize);
    menuMol.componentTransform.setTranslateX(-menuWidth+menuHintSize);
}
else {
    contentMol.componentTransform.setTranslateX(-menuHintSize);
    menuMol.componentTransform.setTranslateX(menuWidth-menuHintSize);
}

mainMol.componentNode.add(menuMol);
mainMol.componentNode.add(contentMol);
contentMol.componentNode.add(framePlane);
contentMol.componentNode.add(fadePlane);
menuMol.componentNode.add(menuPlane);

context.add(mainMol);

var alignment = (menuSide == "left"? 0: 1);
mainMol.componentMod.originFrom([alignment, 0.5]);
mainMol.componentMod.alignFrom([alignment, 0.5]);
contentMol.componentMod.originFrom([alignment, 0.5]);
contentMol.componentMod.alignFrom([alignment, 0.5]);

// FIXME: Why the EFF must I also set align and origin on framePlane and
// fadePlane when I've already set it on their parent (contentMol)?????
framePlane.componentMod.originFrom([alignment, 0.5]);
framePlane.componentMod.alignFrom([alignment, 0.5]);
fadePlane.componentMod.originFrom([alignment, 0.5]);
fadePlane.componentMod.alignFrom([alignment, 0.5]);

menuMol.componentMod.originFrom([alignment, 0.5]);
menuMol.componentMod.alignFrom([alignment, 0.5]);

framePlane.componentTransform.setTranslateZ(-1);
fadePlane.componentTransform.setTranslateZ(-0.0001);
var t = new Transitionable(0);
fadePlane.componentMod.opacityFrom(t);

menuPlane.surface.on('mouseenter', function() {
    contentMol.componentTransform.halt();
    menuMol.componentTransform.halt();
    contentMol.componentTransform.setTranslateX((menuSide == 'left'? 1: -1)*menuWidth, {duration: 1000, curve: Easing.outExpo});
    menuMol.componentTransform.setTranslateX(0, {duration: 1000, curve: Easing.outExpo});
    contentMol.componentTransform.setRotateY((menuSide == 'left'? 1: -1)*Math.PI/8, {duration: 1000, curve: Easing.outExpo});
    t.halt();
    t.set(1, {duration: 1000, curve: Easing.outExpo});
    fadePlane.surface.removeClass('hidden');
});
menuPlane.surface.on('mouseleave', function() {
    contentMol.componentTransform.halt();
    menuMol.componentTransform.halt();
    contentMol.componentTransform.setTranslateX((menuSide == 'left'? 1: -1)*menuHintSize, {duration: 1000, curve: Easing.outExpo});
    menuMol.componentTransform.setTranslateX((menuSide == 'left'? -menuWidth+menuHintSize: +menuWidth-menuHintSize), {duration: 1000, curve: Easing.outExpo});
    contentMol.componentTransform.setRotateY(0, {duration: 1000, curve: Easing.outExpo});
    t.halt();
    t.set(0, {duration: 1000, curve: Easing.outExpo}, function() {
        fadePlane.surface.addClass('hidden');
    });
});

menuPlane.surface.on('deploy', function() {
    $('.menuitem a').on('click', function(event) {
        var _link = $(this);
        if (_link.parent().is('.frame')) {
            event.preventDefault();
            $('iframe').attr('src', _link.attr('href'));
        }
        else { }
    });
});
