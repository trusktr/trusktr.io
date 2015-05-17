import jss from 'jss'
import jssNested from 'jss-nested'
import $ from 'jquery'

import TouchSync from 'famous/inputs/TouchSync'
import MouseSync from 'famous/inputs/MouseSync'
import GenericSync from 'famous/inputs/GenericSync'
import Transform from 'famous/core/Transform'
import ContainerSurface from 'famous/surfaces/ContainerSurface'

import Plane from 'infamous/Plane'
import Molecule from 'infamous/Molecule'
import {contextWithPerspective} from 'infamous/utils'

GenericSync.register({
    touch: TouchSync,
    mouse: MouseSync
})

var style = {
    'body': {
        'background-color': '#444'
    },
    'img': {
        width: '100%',
        height: '100%'
    }
}

jss.use(jssNested)
var stylesheet = jss.createStyleSheet(style)
stylesheet.attach()

var clipContainer = new Molecule()

var clip = new ContainerSurface({
    properties: {
        overflow: 'hidden'
    }
})

var imageContainer = new Molecule({
    align: [0.33, 0.66],
    origin: [0.33, 0.66]
})

var backgroundImage = new Plane({
    content: '<img src="/images/giants/giants_game_bg.png" />'
})
var foregroundImage = new Plane({
    content: '<img src="/images/giants/giants_game_fg.png" />'
})

var ctx = contextWithPerspective(1000)
clip.context.setPerspective(1000)

ctx.add(clipContainer)
clipContainer.add(clip)
clip.add(imageContainer)
imageContainer.add(backgroundImage)
imageContainer.add(foregroundImage)

var sync = new GenericSync(['touch','mouse'])
backgroundImage.pipe(sync)
foregroundImage.pipe(sync)

function sizeFromWindow() {
    var w = window
    var overflow = 0.2
    var imgAspect = 1.499
    var windowAspect = w.innerWidth / w.innerHeight
    if (windowAspect < imgAspect) {
        return [
            w.innerWidth,
            w.innerWidth / imgAspect
        ]
    }
    else {
        return [
            w.innerHeight * imgAspect,
            w.innerHeight
        ]
    }
}

function sizeFromContainer() {
    var overflow = 0.2
    var size = sizeFromWindow()
    return [
        size[0]+size[0]*overflow,
        size[1]+size[1]*overflow
    ]
}

clipContainer.modifier.sizeFrom(sizeFromWindow)
backgroundImage.modifier.sizeFrom(sizeFromContainer)
foregroundImage.modifier.sizeFrom(sizeFromContainer)

backgroundImage.transform.set(
    Transform.translate(0,20,-50)
)
foregroundImage.transform.set(Transform.multiply(
    Transform.translate(35,-100,130),
    Transform.scale(1.6)
))

function dragMoveHandler(event) {
    var w = window
    var percentX = event.clientY / w.innerHeight
    var percentY = event.clientX / w.innerWidth
    var limit = Math.PI/20
    imageContainer.transform.halt()
    imageContainer.transform.setRotate([
        -limit*percentX + limit/2,
        limit*percentY - limit/2,
        0
    ], {duration: 1000, curve: "easeOut"})
}

sync.on('update', dragMoveHandler)
$(document).on('mousemove', dragMoveHandler)
