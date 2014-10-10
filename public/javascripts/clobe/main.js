import Engine         from 'famous/core/Engine';
import Modifier       from 'famous/core/Modifier';
import Surface        from 'famous/core/Surface';
import Transform      from 'famous/core/Transform';
import RenderNode     from 'famous/core/RenderNode';
import EventHandler   from 'famous/core/EventHandler';
import Transitionable from 'famous/transitions/Transitionable';
import MouseSync      from 'famous/inputs/MouseSync';
import TouchSync      from 'famous/inputs/TouchSync';
import GenericSync    from 'famous/inputs/GenericSync';

GenericSync.register({
    mouse: MouseSync,
    touch: TouchSync
});

var cubeWidth = 200;

var context = contextWithPerspective(1000);
var mainModTransform = Transform.rotateY(0);
var mainSize = [0,0];
var mainMod = new Modifier({
    size: [undefined, undefined],
    align: [0.5,0.5],
    origin: [0.5,0.5],
    transform: Transform.rotateY(Math.PI/4)
});
//mainMod.transformFrom(function() {
    //mainModTransform = Transform.multiply(mainModTransform, Transform.rotateY(Math.PI/100))
    //return mainModTransform;
//});
var mainNode = context.add(mainMod);

var cubeHandler = new EventHandler();
var cubeRotation = new Transitionable(0);
var cubeNode = createCube(cubeWidth, cubeHandler);
cubeNode.get().transformFrom(function() {
    cubeRotation.set(cubeRotation.get()+0.002);
    return Transform.rotateY(cubeRotation.get());
});
mainNode.add(cubeNode);

var shadowNode = createShadow(cubeWidth);
var defaultShadowTransform = Transform.multiply(Transform.translate(0,cubeWidth/2+40,0), Transform.rotateX(Math.PI/2));
shadowNode.get().transformFrom(function() {
    return Transform.multiply(Transform.rotateY(cubeRotation.get()), defaultShadowTransform);
});
mainNode.add(shadowNode);

// when dragged
var flingInterval;
cubeHandler.on('update', function(event) {
    if (flingInterval) {
        clearInterval(flingInterval);
    }
    var delta = event.delta;
    cubeRotation.set(cubeRotation.get() + (delta[0]*0.01));
});
cubeHandler.on('end', function(event) {
    var delta = event.delta;
    var direction = Math.abs(delta[0])/delta[0];
    var deceleration = 0.3;
    cubeRotation.halt();
    cubeNode.get().transformFrom(function() {
        if (delta[0] > deceleration*2) {
            delta[0] -= deceleration;
        }
        else if (delta[0] < -deceleration*2) {
            delta[0] += deceleration;
        }
        else {
            cubeNode.get().transformFrom(function() {
                cubeRotation.set(cubeRotation.get() + direction*Math.abs(delta[0])*0.005);
                return Transform.rotateY(cubeRotation.get());
            });
        }
        cubeRotation.set(cubeRotation.get() + (delta[0]*0.01));
        return Transform.rotateY(cubeRotation.get());
    });
});

cubeNode.cubeSides.splice(0, 4).forEach(function(side, index) {
    side.on('deploy', function() {
        side._currentTarget.id='map'+index;
        var map;
        initmap(map, index);
    });
});

var coordinates = [
    [9, -87], // North America
    [66,153], // Asia
    [37,36], // Africa and Europe
    //[30,113] // Asia and Australia
    [16,103] // Asia and Australia
];

function initmap(map, index) {
    var ajaxRequest;
    var plotlist;
    var plotlayers = [];

    // set up the map
    map = new L.Map('map'+index);

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


function createShadow(width) {
    var shadowMod = new Modifier({
        opacity: 0.1,
        align: [0.5,0.5],
        origin: [0.5,0.5]
    });
    var shadow = new Surface({
        size: [width, width],
        properties: {
            background: 'black',
            backfaceVisibility: 'visible'
        }
    });
    var shadowNode = new RenderNode();
    shadowNode.add(shadowMod).add(shadow);
    return shadowNode;
}
function createCube(cubeWidth, eventHandler, type) { // type is either Plane or Surface
    var t = Transform;

    var cubeMod = new Modifier({
        //size: [cubeWidth, cubeWidth],
        align: [0.5,0.5],
        origin: [0.5,0.5]
    });

    var cubeNode = new RenderNode();
    cubeNode.cubeSides = [];
    var node = cubeNode.add(cubeMod);

    var cubeEventHandler = new EventHandler();
    cubeEventHandler.pipe(eventHandler);

    for (var i=0; i<6; i+=1) {
        (function () {
            var sideMod = new Modifier({ });
            var side = new Surface({
                size: [cubeWidth,cubeWidth],
                properties: {
                    background: 'pink',
                    backfaceVisibility: 'visible'
                }
            });
            cubeNode.cubeSides.push(side);
            var sync = new GenericSync(['mouse','touch']);
            sync.pipe(cubeEventHandler);
            side.pipe(sync);

            // rotate and place each side.
            if (i < 4) { // sides
                sideMod.transformFrom( t.multiply(t.rotate(0, (Math.PI/2)*i, 0), t.translate(0,0,cubeWidth/2)));
            }
            else { // top/bottom
                sideMod.transformFrom( t.multiply(t.rotate( (Math.PI/2)*(i%2?-1:1), 0, 0), t.translate(0,0,cubeWidth/2)));
            }

            node.add(sideMod).add(side);
        })();
    }

    return cubeNode;
}
function contextWithPerspective(perspective) {
    var context = Engine.createContext();
    context.setPerspective(perspective);
    return context;
}
