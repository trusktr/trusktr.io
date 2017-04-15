import "leaflet/dist/leaflet.css"
import L from "leaflet"

import {Cube} from 'infamous/components'
import {Motor, Scene, Node} from 'infamous/motor'

//styles
import jss from '../common/jss-configured'
import reset from '../common/styles/reset'

export default
function appOpen() {

    // TODO: Consolidate all the entry points into one, and code the
    // style reset only once.
    jss.createStyleSheet(reset).attach()

    //const context = contextWithPerspective(1000);
    const scene = new Scene
    scene.element.style.background = 'url(https://images8.alphacoders.com/397/397989.jpg)'

    const mainNode = new Node({
        align: [0.5, 0.5],
        mountPoint: [0.5, 0.5],
        rotation: [0, 45],
    })
    mainNode.element.id = "mainNode"

    const cubeWidth = 200
    const cube = new Cube(cubeWidth, {
        align: [0.5, 0.5],
        mountPoint: [0.5, 0.5],
    })
    cube.element.id = "cube"
    for (const side of cube.sides)
        side.element.style.background = 'pink'

    console.log(
        cube.children[0].rotation,
        cube.children[1].rotation,
        cube.children[2].rotation,
        cube.children[3].rotation,
        cube.children[4].rotation,
        cube.children[5].rotation
    )

    let cubeRotation = 0

    const shadow = new Node({
        align: [0.5, 0.5],
        mountPoint: [0.5, 0.5],
        absoluteSize: [cubeWidth, cubeWidth],
        opacity: 0.1,
    });
    shadow.element.id = "shadow"
    shadow.element.style.background = 'black'
    shadow.position.y = cubeWidth / 2 + 40
    shadow.rotation.x = 90

    scene.addChild(mainNode)
    mainNode.addChild(cube)
    mainNode.addChild(shadow)
    scene.mount('#app-root')

    //let flingInterval

    /*
     * Set up events.
     */
    //cube.on('update', function(event) {
        //if (flingInterval) {
            //clearInterval(flingInterval)
        //}
        //const delta = event.delta
        //cubeRotation.set(cubeRotation.get() + (delta[0]*0.01))
    //});
    //cube.on('end', function(event) {
        //const delta = event.delta
        //if (delta[0] !== 0) { // if the mouse was dragged (not just a click)
            //const direction = Math.abs(delta[0])/delta[0]
            //const deceleration = 0.3
            //cubeRotation.halt()
            //cube.get().transformFrom(function() {
                //if (delta[0] > deceleration*2) {
                    //delta[0] -= deceleration
                //}
                //else if (delta[0] < -deceleration*2) {
                    //delta[0] += deceleration
                //}
                //else {
                    //cube.get().transformFrom(function() {
                        //cubeRotation.set(cubeRotation.get() + direction*Math.abs(delta[0])*0.005)
                        //return Transform.rotateY(cubeRotation.get())
                    //})
                //}
                //cubeRotation.set(cubeRotation.get() + (delta[0]*0.01))
                //return Transform.rotateY(cubeRotation.get())
            //})
        //}
    //})

    cube.sides.slice(0, 4).forEach((side, index) => { // for each size, except top and bottom
        side.element.id = 'map'+index
        console.log('cube map side:', side, index)
        initmap(index)
    })

    Motor.addRenderTask(() => {
        cubeRotation += 0.1
        mainNode.rotation.y = cubeRotation
    })
}

const coordinates = [
    [9, -87], // North America
    [66,153], // Asia
    [37,36], // Africa and Europe
    //[30,113] // Asia and Australia
    [16,103] // Asia and Australia
]

function initmap(index) {
    // set up the map
    const map = new L.Map('map'+index)

    // create the tile layer with correct attribution
    const osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    //const osmAttrib='Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
    const osmAttrib=''
    const osm = new L.TileLayer(osmUrl, {
        minZoom: 0,
        maxZoom: 18,
        attribution: osmAttrib
    })

    map.touchZoom.disable()
    map.doubleClickZoom.disable()
    map.scrollWheelZoom.disable()
    map.boxZoom.disable()
    map.keyboard.disable()
    //map.dragging.disable()
    if (map.tap) map.tap.disable()

    // start the map in South-East England
    map.setView(new L.LatLng(coordinates[index][0], coordinates[index][1]), 1)
    map.addLayer(osm)

    // TODO: better hook this up to actual size observation.
    setTimeout(function() {
        map.invalidateSize()
    }, 1000)
}
