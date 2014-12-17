import jss from 'jss';
import jssNested from 'jss-nested';
import $ from 'jquery';

import TouchSync from 'famous/inputs/TouchSync';
import MouseSync from 'famous/inputs/MouseSync';
import GenericSync from 'famous/inputs/GenericSync';

import Plane from 'infamous/Plane';
import {contextWithPerspective} from 'infamous/utils';

GenericSync.register({
    touch: TouchSync,
    mouse: MouseSync
});

var earth = null;
var initialAnimation = null;
var markers = [];

var style = {
    'html, body': {
        padding: 0,
        margin: 0
    },
    '#webglearth': {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        position: "absolute !important",
        background: [
            '-webkit-linear-gradient(top, hsl(0, 80%, 70%), #bada55)',
            'black',
            '#f2ecdc' // overrides the previous two
        ]
    }
};

jss.use(jssNested);
var stylesheet = jss.createStyleSheet(style);
stylesheet.attach();

var mapPlane = new Plane({
    size: [undefined, undefined],
    content: '<div id="webglearth"></div>'
});

var ctx = contextWithPerspective(1000);

ctx.add(mapPlane);

mapPlane.on('deploy', function(event) {
    var sync = new GenericSync(['touch','mouse']);
    initializeGlobe();
    showSpots();
    wireUpMouseAndTouchEvents(earth, mapPlane._.handler);
    mapPlane.pipe(sync);
    sync.on('update', function() {
        cancelAnimationFrame(initialAnimation);
    });
    $('#webglearth .we-pm-icon').on('click', function() {
        var _clickedMarker = $(this);
        console.log(_clickedMarker[0]);
        markers.forEach(function(marker) { // close all other popups except for this marker's
            if (marker.element.children[0] !== _clickedMarker[0]) {
                marker.closePopup();
            }
        });
    });
});

function initializeGlobe() {
    earth = new WE.map('webglearth');
    WE.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(earth);

    earth.setView([51.505, 0], 1.2);

    var before = null;
    initialAnimation = requestAnimationFrame(function animate(now) {
        var center = earth.getPosition();
        var elapsed = before? now - before: 0;
        before = now;
        earth.setView([center[0], center[1] + 0.2*(elapsed/30)]);
        initialAnimation = requestAnimationFrame(animate);
    });
}

function wireUpMouseAndTouchEvents(source, handler) {
    // pass mouse events to the plane.
    source.on('click', function(event) {
        handler.emit('click', event);
    });
    source.on('mousedown', function(event) {
        handler.emit('mousedown', event);
    });
    source.on('mousemove', function(event) {
        handler.emit('mousemove', event);
    });
    source.on('mouseup', function(event) {
        handler.emit('mouseup', event);
    });
    source.on('mouseenter', function(event) {
        handler.emit('mouseenter', event);
    });
    source.on('mouseleave', function(event) {
        handler.emit('mouseleave', event);
    });
    source.on('mouseover', function(event) {
        handler.emit('mouseover', event);
    });
    source.on('mouseout', function(event) {
        handler.emit('mouseout', event);
    });

    //pass touch events to the plane.
    source.on('touchcancel', function(event) {
        handler.emit('touchcancel', event);
    });
    source.on('touchend', function(event) {
        handler.emit('touchend', event);
    });
    source.on('touchenter', function(event) {
        handler.emit('touchenter', event);
    });
    source.on('touchleave', function(event) {
        handler.emit('touchleave', event);
    });
    source.on('touchmove', function(event) {
        handler.emit('touchmove', event);
    });
    source.on('touchstart', function(event) {
        handler.emit('touchstart', event);
    });
}

function showSpots() {
    var marker = WE.marker([51.5, -0.09]).addTo(earth);
    markers.push(marker);
    marker.bindPopup(
        "I am a sk8spot.<br /><span style='font-size:10px;color:#999'>Come sk8 me. :)</span>",
        {maxWidth: 150, closeButton: true}
    );

    var marker2 = WE.marker([30.058056, 31.228889]).addTo(earth);
    markers.push(marker2);
    marker2.bindPopup(
        "I am a sk8spot.<br /><span style='font-size:10px;color:#999'>Come sk8 me. :)</span>",
        {maxWidth: 120, closeButton: true}
    );
}
