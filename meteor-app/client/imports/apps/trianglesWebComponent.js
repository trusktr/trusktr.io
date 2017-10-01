import * as React from 'react'
import {Motor} from 'infamous/core'
import forLength from 'army-knife/forLength'

import color from 'tinycolor2'

function forLengthCreate(n, fn) {
    const result = []
    forLength(n, i => result.push(fn(i)))
    return result
}

//styles
import jss from '/client/imports/lib/jss-configured'
import reset from '/client/imports/common/styles/reset'

const style = {
    triangle: {
        transformOrigin: '0px 0px 0px !important',

        '& div': {
            width: 0,
            height: 0,
            borderTop: '50px solid transparent',
            borderBottom: '50px solid transparent',
            borderLeft: '100px solid',
        },
    },
    scene: {
        perspective: '800px!important',
    },
}

const privates = new WeakMap

const _ = obj => {
    let objPrivates = privates.get(obj)
    if (!objPrivates) {
        objPrivates = {}
        privates.set(obj, objPrivates)
    }
    return objPrivates
}

// TODO: Consolidate all the entry points into one, and code the
// style reset only once.
jss.createStyleSheet(reset).attach()
const {classes} = jss.createStyleSheet(style).attach()

// ugly ES5 style class required, otherwise ES6+ class is transpiled to
// non-Reflect.construct version which won't work.
function ColorTriangles() {
    return Reflect.construct(HTMLElement, [], new.target)
}

ColorTriangles.prototype = Object.assign(Object.create(HTMLElement.prototype), {
    markup() {

        const triangleBase = 100

        let angle = - Math.atan((triangleBase/2) / triangleBase)
        angle = angle / Math.PI * 180

        this.triangles = []

        const {color1, color2} = this
        const colors = color1.clone().monochromatic(8)

        return (`
            <div style="width:100%; height:100%;">
                <i-scene class="${classes.scene}">
                    <i-node rotation="0, 0, ${angle}">

                        ${[].concat(...forLengthCreate(12, i =>
                            forLengthCreate(8, n => (`

                                <i-node
                                    data-indices="${i},${n}"
                                    class="${classes.triangle}"
                                    align="0,0"
                                    mountPoint="0,0"
                                    absoluteSize="100,100"
                                    position="${i*100}, ${n*100 + i*50}"
                                    rotation="0, 45, 0"
                                    xopacity="${(1/8)*(8-n)}"
                                >

                                    <div style="
                                        border-left-color: ${color.mix(color1, color2, (100/5) * n).toString()}
                                    ">
                                    </div>

                                    <i-node absoluteSize="100,100">
                                        <div style="
                                            border-left-color: ${color.mix(color1, color2, (100/5) * n).toString()};
                                            transform: translateZ(-5px);
                                        ">
                                        </div>
                                    </i-node>

                                </i-node>

                            `))
                        )).join('')}

                    </i-node>
                </i-scene>
            </div>
        `)
    },

    disconnectedCallback() {
        console.log(' ----------- disconnected', this.tagName)
        if (this.renderTask)
            Motor.removeRenderTask(this.renderTask)

        window.removeEventHandler('mousemove', this._mousemoveHandler)
        this._mousemoveHandler = undefined
    },

    async connectedCallback() {
        console.log(' ----------- connected', this.tagName)
        this.triangleRotation = 0
        this.color1 = color('LightSeaGreen')
        this.color2 = color('PaleVioletRed')

        // internal DOM is hidden, is private, and cannot be accessed from
        // the outside
        //_(this).shadow = this.attachShadow({mode: 'open'})
        //_(this).shadow = this.createShadowRoot()
        //_(this).shadow.innerHTML = this.markup()
        this.innerHTML = this.markup()

        //const scene = _(this).shadow.querySelector('i-scene')
        const scene = this.querySelector('i-scene')
        const triangles = Array.from(scene.querySelectorAll('.'+classes.triangle))
        await scene.mountPromise

        this.nextFrame = null
        this._mousemoveHandler = e => {
            const ratioY = e.clientY / window.innerHeight
            const ratioX = e.clientX / window.innerWidth

            if (this.nextFrame) cancelAnimationFrame(this.nextFrame)
            this.nextFrame = requestAnimationFrame(() => {
                this.nextFrame = null

                const color1 = this.color1.clone().spin(360 * ratioY)
                const color2 = this.color2.clone().spin(360 * ratioX)

                const colors = forLengthCreate(8, n => {
                    return color.mix(color1, color2, (100/5) * n).toString()
                })

                triangles.forEach(t => {
                    const indices = t.dataset.indices.split(',')
                    const n = indices[1]
                    ;[].forEach.call(t.querySelectorAll('div'), d => {
                        d.style['border-left-color'] = colors[n]
                    })
                })
            })
        }

        window.addEventListener('mousemove', this._mousemoveHandler)

        let rate = 180 // per second
        let lastTime  = performance.now()

        this.renderTask = Motor.addRenderTask(time => {
            const delta = time - lastTime
            const sec = delta/1000
            this.triangleRotation -= rate*sec
            //if (this.triangleRotation < -360) return false
            triangles.forEach(t => {
                t.rotation.y = this.triangleRotation
            })
            //triangles[2].rotation.y = this.triangleRotation
            lastTime = time
        })
    },
})

customElements.define('color-triangles', ColorTriangles)

export default
class App extends React.Component {
    render() {
        return <color-triangles />
    }
}
