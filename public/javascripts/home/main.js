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

var context = contextWithPerspective(1000);

var menuPlane = new Plane({
    size: [200,200],
    classes: ['blahj'],
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
                +'<a target="_blank" href="/calendar">Date Picker</a>'
            +'</li><br />'
            +'<li class="sub menuitem frame">'
                +'<a target="_blank" href="/password">Password Generator</a>'
            +'</li><br />'
            +'<li class="sub menuitem">'
                +'<a target="_blank" href="https://vs5k.trusktr.io">Voting System 5000</a>'
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
    content: '<iframe src="/clobe" style="width: 100%; height: 100%"></iframe>',
    properties: {
        zIndex: '0',
    }
});
var gradientPlane = new Plane({
    classes: ['gradient', 'hidden'],
    properties: {
        zIndex: '100',
    }
});

var mainMol = new Molecule();

mainMol.componentNode.add(framePlane.getNode());
mainMol.componentNode.add(gradientPlane.getNode());
mainMol.componentNode.add(menuPlane.getNode());

context.add(mainMol.getNode());

menuPlane.componentMod.originFrom([0, 0]);
menuPlane.componentMod.alignFrom([0, 0]);
framePlane.componentMod.originFrom([1, 0.5]);
framePlane.componentMod.alignFrom([1, 0.5]);
gradientPlane.componentMod.originFrom([1, 0.5]);
gradientPlane.componentMod.alignFrom([1, 0.5]);
framePlane.componentTransform.setTranslateZ(-1);
gradientPlane.componentTransform.setTranslateZ(-0.0001);
var t = new Transitionable(0);
gradientPlane.componentMod.opacityFrom(t);
menuPlane.componentSurface.on('mouseenter', function() {
    //framePlane.componentTransform.halt();
    //framePlane.componentTransform.setRotateY(-Math.PI/14, {duration: 1000, curve: Easing.outExpo});
    //gradientPlane.componentTransform.halt();
    //gradientPlane.componentTransform.setRotateY(-Math.PI/14, {duration: 1000, curve: Easing.outExpo});
    //t.halt();
    //t.set(1, {duration: 1000, curve: Easing.outExpo});
    //gradientPlane.componentSurface.removeClass('hidden');

    $('.menuitem a').on('click', function(event) {
        var _link = $(this);
        if (_link.parent().is('.frame')) {
            event.preventDefault();
            $('iframe').attr('src', _link.attr('href'));
        }
        else { }
    });
});
menuPlane.componentSurface.on('mouseleave', function() {
    //framePlane.componentTransform.halt();
    //framePlane.componentTransform.setRotateY(0, {duration: 1000, curve: Easing.outExpo});
    //gradientPlane.componentTransform.halt();
    //gradientPlane.componentTransform.setRotateY(0, {duration: 1000, curve: Easing.outExpo});
    //t.halt();
    //t.set(0, {duration: 1000, curve: Easing.outExpo}, function() {
        //gradientPlane.componentSurface.addClass('hidden');
    //});
});
