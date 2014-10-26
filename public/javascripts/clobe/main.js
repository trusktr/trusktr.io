console.log('clobe/main.js');
import Transform      from 'famous/core/Transform';
import Transitionable from 'famous/transitions/Transitionable';

import Molecule from 'javascripts/components/Molecule';
import Plane from 'javascripts/components/Plane';
import Cube from 'javascripts/components/Cube';
import {contextWithPerspective} from 'javascripts/components/utils';

/*
 * Vars
 */
var cubeWidth = 200;

var context = contextWithPerspective(1000);
var mainModTransform = Transform.rotateY(0);
var mainSize = [0,0];
var mainMol = new Molecule({
    size: [undefined, undefined],
    align: [0.5,0.5],
    origin: [0.5,0.5],
    transform: Transform.rotateY(Math.PI/4)
});
//mainMol.options = {
    //test: "",
    //foo: ""
//};
var mainMolNode;

var cube = new Cube(cubeWidth);
var cubeRotation = new Transitionable(0);

var shadow = new Plane({
    size: [cubeWidth, cubeWidth],
    opacity: 0.1,
    properties: {
        background: 'black',
        backfaceVisibility: 'visible'
    }
});

var defaultShadowTransform = Transform.multiply(Transform.translate(0,cubeWidth/2+40,0), Transform.rotateX(Math.PI/2));
var flingInterval;

var coordinates = [
    [9, -87], // North America
    [66,153], // Asia
    [37,36], // Africa and Europe
    //[30,113] // Asia and Australia
    [16,103] // Asia and Australia
];

/*
 * Functions
 */
function initmap(index) {
    var ajaxRequest;
    var plotlist;
    var plotlayers = [];

    // set up the map
    var map = new L.Map('map'+index);

    // create the tile layer with correct attribution
    var osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    //var osmAttrib='Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
    var osmAttrib='';
    var osm = new L.TileLayer(osmUrl, {
        minZoom: 0,
        maxZoom: 18,
        attribution: osmAttrib
    });

    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
    map.dragging.disable();
    if (map.tap) map.tap.disable();

    // start the map in South-East England
    map.setView(new L.LatLng(coordinates[index][0], coordinates[index][1]), 1);
    map.addLayer(osm);

    setTimeout(function() {
        map.invalidateSize();
    }, 1000);
}

/*
 * Events
 */
cube.on('update', function(event) {
    if (flingInterval) {
        clearInterval(flingInterval);
    }
    var delta = event.delta;
    cubeRotation.set(cubeRotation.get() + (delta[0]*0.01));
});
cube.on('end', function(event) {
    var delta = event.delta;
    if (delta[0] != 0) { // if the mouse was dragged (not just a click)
        var direction = Math.abs(delta[0])/delta[0];
        var deceleration = 0.3;
        cubeRotation.halt();
        cube.get().transformFrom(function() {
            if (delta[0] > deceleration*2) {
                delta[0] -= deceleration;
            }
            else if (delta[0] < -deceleration*2) {
                delta[0] += deceleration;
            }
            else {
                cube.get().transformFrom(function() {
                    cubeRotation.set(cubeRotation.get() + direction*Math.abs(delta[0])*0.005);
                    return Transform.rotateY(cubeRotation.get());
                });
            }
            cubeRotation.set(cubeRotation.get() + (delta[0]*0.01));
            return Transform.rotateY(cubeRotation.get());
        });
    }
});
cube.cubeSides.splice(0, 4).forEach(function(side, index) {
    side.on('deploy', function() {
        side.surface._currentTarget.id='map'+index;
        initmap(index);
    });
});

/*
 * Initial Logic
 */
//mainMol.mod.transformFrom(function() {
    //mainModTransform = Transform.multiply(mainModTransform, Transform.rotateY(Math.PI/1000))
    //return mainModTransform;
//});
mainMol.mod.alignFrom([0,0]);
mainMol.mod.originFrom([0,0]);

    cubeRotation.set(2);
cube.get().transformFrom(function() {
    //cubeRotation.set(cubeRotation.get()+0.002);
    return Transform.rotateY(cubeRotation.get());
});
context.add(mainMol);
mainMol.add(cube);
//mainMol.add(new Plane({
    //size: [500,500],
    //properties: {
        //backfaceVisibility: 'visible',
        //outline: '1px solid red'
    //}
//}));
shadow.get().transformFrom(function() {
    return Transform.multiply(Transform.rotateY(cubeRotation.get()), defaultShadowTransform);
});
console.log(mainMol);
mainMol.add(shadow);

