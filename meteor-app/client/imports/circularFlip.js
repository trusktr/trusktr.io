
import {Motor, Scene, Node} from 'infamous/motor'
import forLength from 'army-knife/forLength'
import {Tween, Easing} from 'tween.js'
import sleep from 'awaitbox/timers/sleep'

import color from 'tinycolor2'

function forLengthCreate(n, fn) {
    const result = []
    forLength(n, i => result.push(fn(i)))
    return result
}

export default
async function circularFlip() {
    const scene = new Scene
    scene.mount('#app-root')

    //const mainColor = color('#7ac5de')
    //const mainColor = color('#C390D4')
    const mainColor = color('#A1D490')

    document.body.style.background = ''+mainColor

    const gridSizeX = 13
    const gridSizeY = 13
    const gridCellSize = 200

    const grid = new Node({
        absoluteSize: [gridSizeX*gridCellSize, gridSizeY*gridCellSize],
        align: [0.5, 0.5],
        mountPoint: [0.5, 0.5],
        rotation: [30],
        position: {z: -600},
    })

    scene.addChild(grid)

    await grid.mountPromise
    await sleep(500)

    console.log('grid size', grid.actualSize)

    const rippleOptions = {
        // ripple center
        cx: grid.actualSize.x / 2,
        cy: grid.actualSize.y / 2,

        amountToRotate: 180,
        rotationDuration: 1600,
        rotationCurve: Easing.Exponential.Out,

        amountToDisplace: 200,
        displaceDuration: 1600,
        //displaceDuration: 2400,
        displaceCurve: Easing.Exponential.Out,

        amountToOpacify: 1,
        opacifyDuration: 2400,
        opacifyCurve: Easing.Exponential.Out,

        rippleDistance: grid.actualSize.x / 2,
        //rippleDuration: 2000,
        rippleDuration: 1000,
        //rippleCurve: Easing.Exponential.In,
        rippleCurve: Easing.Linear.None,
        //rippleCurve: Easing.Quadratic.Out,

        rotation: true,
        displacement: true,
        opacification: true,
    }

    // make a grid of rectangles
    forLength(gridSizeX, i => {
        forLength(gridSizeY, j => {
            const node = new Node({
                absoluteSize: [gridCellSize,gridCellSize],
                position: [i*gridCellSize, j*gridCellSize],
                opacity: 0,
            })

            node.opacity = 0

            //node.element.style.background = '#eee'
            //node.element.style.border = '1px solid #ccc'
            node.element.style.background = ''+mainColor.clone().darken(10)
            node.element.style.border = '1px solid ' + mainColor.clone().darken(35)

            //node.element.style['backface-visibility'] = 'hidden'

            grid.addChild(node)
        })
    })

    await sleep(500)

    while (true) {
        await ripple(grid, rippleOptions)
        await sleep(1000)
    }
}

function ripple(grid, {
    cx, cy,
    amountToRotate, rotationDuration, rotationCurve,
    amountToDisplace, displaceDuration, displaceCurve,
    amountToOpacify, opacifyDuration, opacifyCurve,
    rippleDistance, rippleDuration, rippleCurve,

    rotation, displacement, opacification
}) {
    let resolve = null
    const promise = new Promise(r => resolve = r)

    let radiusTweenComplete = false
    const radius = {value:0}
    const radiusTween = new Tween(radius)
        .to({value:rippleDistance}, rippleDuration)
        .easing(rippleCurve)
        .onComplete(() => radiusTweenComplete = true)
        .start()

    Motor.addRenderTask(time => {
        radiusTween.update(time)

        for (let i = 0, l=grid.children.length; i<l; i+=1) {
            const node = grid.children[i]

            if (node.animating) continue

            if (!node.distanceFromCircle) {
                const dx = cx - (node.position.x + 50)
                const dy = cy - (node.position.y + 50)
                const distanceToCircleCenter = Math.sqrt(dx**2 + dy**2)
                node.initialDistanceFromCircle = distanceToCircleCenter - radius.value
                node.distanceFromCircle = node.initialDistanceFromCircle
            }
            else {
                node.distanceFromCircle = node.initialDistanceFromCircle - radius.value
            }

            if (node.distanceFromCircle <= 0) {
                node.animating = true

                if (rotation) rotateNode(node, amountToRotate, rotationDuration, rotationCurve)
                if (displacement) displaceNode(node, amountToDisplace, displaceDuration, displaceCurve)
                if (opacification) opacifyNode(node, amountToOpacify, opacifyDuration, opacifyCurve)
            }
        }

        if (radiusTweenComplete) {
            const children = grid.children
            for (let i = 0, l=children.length; i<l; i+=1) {
                children[i].animating = false
            }
            resolve()
            return false
        }
    })

    return promise
}

function rotateNode(node, finalValue, duration, curve) {
    let resolve = null
    const promise = new Promise(r => resolve = r)

    let tweenDone = false

    const rotationTween = new Tween(node.rotation)
        .to({y:'+180'}, duration)
        .easing(curve)
        .onComplete(() => tweenDone = true)
        .start()

    Motor.addRenderTask(time => {
        rotationTween.update(time)
        if (tweenDone) {
            resolve()
            return false
        }
    })

    return promise
}

function displaceNode(node, amount, duration, curve) {
    let resolve = null
    const promise = new Promise(r => resolve = r)

    const displace = {value: 0}
    let tweenDone = false

    const displacementTween = new Tween(displace)
        .to({value: Math.PI}, duration)
        .easing(curve)
        .onComplete(() => tweenDone = true)
        .start()

    Motor.addRenderTask(time => {
        displacementTween.update(time)

        node.position.z = amount * Math.sin(displace.value)

        if (tweenDone) {
            resolve()
            return false
        }
    })

    return promise
}

function opacifyNode(node, amount, duration, curve) {
    let resolve = null
    const promise = new Promise(r => resolve = r)

    const opacify = {value: 0}
    let tweenDone = false

    const opacifyTween = new Tween(opacify)
        .to({value: Math.PI}, duration)
        .easing(curve)
        .onComplete(() => tweenDone = true)
        .start()

    Motor.addRenderTask(time => {
        opacifyTween.update(time)

        node.opacity = amount * Math.sin(opacify.value)

        if (tweenDone) {
            resolve()
            return false
        }
    })

    return promise
}
