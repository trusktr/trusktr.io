import * as React from 'react'
import * as ReactDOM from 'react-dom'

import {Motor} from 'infamous/motor'
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

export default
class Triangles extends React.Component {
    constructor(props) {
        super(props)
        this.triangleRotation = 0
        this.color1 = color('LightSeaGreen')
        this.color2 = color('PaleVioletRed')

        this.rotationSpeed = 180 // degrees per second
        this.lastTime = performance.now()

        this.state = {
            sceneSize: {x:0, y:0, z:0},
            color1: this.color1,
            color2: this.color2,
        }

        window.triangles = this

        this.resetSheet = jss.createStyleSheet(reset).attach()
        this.styleSheet = jss.createStyleSheet(style).attach()
        this.classes = this.styleSheet.classes

        this.boundSceneSizeChange = this.onSceneSizeChange.bind(this)
    }

    render() {

        const {sceneSize} = this.state
        const triangleBase = 100

        let angle = - Math.atan((triangleBase/2) / triangleBase)
        angle = angle / Math.PI * 180

        this.triangles = []

        const {color1, color2} = this.state
        const colors = color1.clone().monochromatic(8)

        return (
            <motor-scene class={this.classes.scene} ref={el => this.scene = el}>
                <motor-node rotation={`0, 0, ${angle}`}>

                    {[].concat(forLengthCreate(12, i =>
                        forLengthCreate(8, n => (

                            <motor-node
                                ref={el => el ? this.triangles.push(el) : null}
                                class={this.classes.triangle}
                                align="0,0"
                                mountPoint="0,0"
                                absoluteSize="100,100"
                                position={`${i*100}, ${n*100 + i*50}`}
                                //rotation={`0, ${this.triangleRotation}, 0`}
                                rotation={`0, 45, 0`}
                                //opacity={(1/8)*(8-n)}
                            >

                                <div
                                    //style={{borderLeftColor: color1.clone().toString()}}
                                    //style={{borderLeftColor: color1.clone().lighten((100/8) * n).toString()}}
                                    style={{borderLeftColor: color.mix(color1, color2, (100/5) * n).toString()}}
                                    //style={{borderLeftColor: color1.clone().spin((360/8) * n).toString()}}
                                    //style={{borderLeftColor: color.random().toString()}}
                                    //style={{borderLeftColor: colors[n].toString()}}
                                >
                                </div>

                                <motor-node absoluteSize="100,100">
                                    <div style={{
                                        borderLeftColor: color.mix(color1, color2, (100/5) * n).toString(),
                                        transform: 'translateZ(-5px)'
                                    }}>
                                    </div>
                                </motor-node>

                            </motor-node>

                        ))
                    ))}

                </motor-node>
            </motor-scene>
        )
    }

    async componentDidMount() {

        await this.scene.mountPromise
        this.scene.imperativeCounterpart.on('sizechange', this.boundSceneSizeChange)

        window.addEventListener('mousemove', e => {
            const ratioY = e.clientY / window.innerHeight
            const ratioX = e.clientX / window.innerWidth
            this.setState({
                color1: this.color1.clone().spin(360 * ratioY),
                color2: this.color2.clone().spin(360 * ratioX)
            })
        })
    }

    componentWillUpdate() {
        if (this.renderTask)
            Motor.removeRenderTask(this.renderTask)
    }

    componentDidUpdate() {
        this.renderTask = Motor.addRenderTask(time => {
            const delta = time - this.lastTime
            const sec = delta/1000
            this.triangleRotation -= this.rotationSpeed*sec
            //if (this.triangleRotation < -360) return false
            this.triangles.forEach(t => t.rotation.y = this.triangleRotation)
            this.lastTime = time
        })

        // This one makes the tab crash.. why???
        //Motor.addRenderTask(time => {
            //const delta = time - this.lastTime
            //const sec = delta/1000
            //this.triangleRotation -= 180*sec
            ////if (this.triangleRotation < -360) return false
            //this.forceUpdate()
        //})
    }

    componentWillUnmount() {
        this.resetSheet.detach()
        this.styleSheet.detach()
        this.scene.imperativeCounterpart.off('sizechange', this.boundSceneSizeChange)
        if (this.renderTask)
            Motor.removeRenderTask(this.renderTask)
    }

    onSceneSizeChange(sceneSize) { this.setState({sceneSize}) }
}
