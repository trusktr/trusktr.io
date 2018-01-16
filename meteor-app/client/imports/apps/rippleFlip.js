import * as React from 'react'
import * as ReactDOM from 'react-dom'

import {Motor, Scene, Node} from 'infamous/core'
import forLength from 'army-knife/forLength'
import {Tween, Easing} from 'tween.js'
import sleep from 'awaitbox/timers/sleep'

import jss from '/client/imports/lib/jss-configured'
import reset from '/client/imports/common/styles/reset'

import color from 'tinycolor2'

function forLengthCreate(n, fn) {
    const result = []
    forLength(n, i => result.push(fn(i)))
    return result
}

const gridSizeX = 13
const gridSizeY = 13
const gridCellSize = 200

export default
class App extends React.Component {
    constructor(props) {
        super(props)

        this.scene = null
        this.tasks = []

        this.setMainColor(props)
    }

    render() {
        return (
            <div style={{width: '100%', height: '100%', background: ''+this.mainColor}} ref={el => this.el = el}></div>
        )
    }

    componentWillReceiveProps(newProps) {
        console.log('componentWillReceiveProps')
        this.setMainColor(newProps)
        this.updateColor()
    }

    setMainColor(props) {
        //this.mainColor = color('#7ac5de')
        //this.mainColor = color('#C390D4')
        this.mainColor = props.color || color('#A1D490')
    }

    updateColor() {
        let index = 0
        const grid = this.scene.children[0]
        console.log('updateColor', grid.children.length)
        for (let node of grid.children) {
            node.style.background = ''+this.mainColor.clone().darken(10)
            node.style.border = '1px solid ' + this.mainColor.clone().darken(35)
        }
    }

    async componentDidMount() {
        console.log('componentDidMount')
        this.sheet = jss.createStyleSheet(reset).attach()

        this.scene = new Scene
        this.scene.mount(this.el)

        const grid = new Node({
            absoluteSize: [gridSizeX*gridCellSize, gridSizeY*gridCellSize],
            align: [0.5, 0.5],
            mountPoint: [0.5, 0.5],
            rotation: [30],
            position: {z: -600},
        })

        this.scene.add(grid)

        await grid.mountPromise
        await sleep(500)

        console.log('grid size', grid.calculatedSize)

        const rippleOptions = {
            // ripple center
            cx: grid.calculatedSize.x / 2,
            cy: grid.calculatedSize.y / 2,

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

            rippleDistance: grid.calculatedSize.x / 2,
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

                //node.style.background = '#eee'
                //node.style.border = '1px solid #ccc'
                node.style.background = ''+this.mainColor.clone().darken(10)
                node.style.border = '1px solid ' + this.mainColor.clone().darken(35)

                //node.style['backface-visibility'] = 'hidden'

                grid.add(node)
            })
        })

        await sleep(500)

        while (true) {
            await ripple(grid, {...rippleOptions, taskArray: this.tasks})
            await sleep(1000)
        }
    }

    componentWillUnmount() {
        this.scene.unmount()
        delete this.scene
        this.sheet.detach()
        delete this.sheet
        console.log(this.tasks.length)
        for (const task of this.tasks) {
            Motor.removeRenderTask(task)
        }
        this.tasks.length = 0
        delete this.tasks
    }
}

function ripple(grid, {
    cx, cy,
    amountToRotate, rotationDuration, rotationCurve,
    amountToDisplace, displaceDuration, displaceCurve,
    amountToOpacify, opacifyDuration, opacifyCurve,
    rippleDistance, rippleDuration, rippleCurve,
    rotation, displacement, opacification,

    // pass an array onto which render tasks will be added, in case you want to
    // use references later (f.e. exammple to clean them up)
    taskArray = []
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

    taskArray.push(Motor.addRenderTask(time => {
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

                if (rotation) rotateNode(node, amountToRotate, rotationDuration, rotationCurve, taskArray)
                if (displacement) displaceNode(node, amountToDisplace, displaceDuration, displaceCurve, taskArray)
                if (opacification) opacifyNode(node, amountToOpacify, opacifyDuration, opacifyCurve, taskArray)
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
    }))

    return promise
}

function rotateNode(node, finalValue, duration, curve, taskArray) {
    let resolve = null
    const promise = new Promise(r => resolve = r)

    let tweenDone = false

    const rotationTween = new Tween(node.rotation)
        .to({y:'+180'}, duration)
        .easing(curve)
        .onComplete(() => tweenDone = true)
        .start()

    taskArray.push(Motor.addRenderTask(time => {
        rotationTween.update(time)
        if (tweenDone) {
            resolve()
            return false
        }
    }))

    return promise
}

function displaceNode(node, amount, duration, curve, taskArray = []) {
    let resolve = null
    const promise = new Promise(r => resolve = r)

    const displace = {value: 0}
    let tweenDone = false

    const displacementTween = new Tween(displace)
        .to({value: Math.PI}, duration)
        .easing(curve)
        .onComplete(() => tweenDone = true)
        .start()

    taskArray.push(Motor.addRenderTask(time => {
        displacementTween.update(time)

        node.position.z = amount * Math.sin(displace.value)

        if (tweenDone) {
            resolve()
            return false
        }
    }))

    return promise
}

function opacifyNode(node, amount, duration, curve, taskArray) {
    let resolve = null
    const promise = new Promise(r => resolve = r)

    const opacify = {value: 0}
    let tweenDone = false

    const opacifyTween = new Tween(opacify)
        .to({value: Math.PI}, duration)
        .easing(curve)
        .onComplete(() => tweenDone = true)
        .start()

    taskArray.push(Motor.addRenderTask(time => {
        opacifyTween.update(time)

        node.opacity = amount * Math.sin(opacify.value)

        if (tweenDone) {
            resolve()
            return false
        }
    }))

    return promise
}
