import jss from 'jss';
import $ from 'jquery';

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
        background: '#f2ecdc'
    }
};

var stylesheet = jss.createStylesheet(style);
stylesheet.attach();

function initializeGlobe() {
    var earth = new WE.map('webglearth');
    WE.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(earth);

    var marker = WE.marker([51.5, -0.09]).addTo(earth);
    marker.bindPopup("<b>Hello sk8spot!</b><br>I am a sk8spot.<br /><span style='font-size:10px;color:#999'>Come sk8 me. :)</span>", {maxWidth: 150, closeButton: true}).openPopup();

    var marker2 = WE.marker([30.058056, 31.228889]).addTo(earth);
    marker2.bindPopup("<b>Hello sk8spot!</b><br>I am a sk8spot.<br /><span style='font-size:10px;color:#999'>Come sk8 me. :)</span>", {maxWidth: 120, closeButton: false});

    earth.setView([51.505, 0], 6);
}

$(document).ready(function() {
    initializeGlobe();
});
