import * as React from 'react'
import TWEEN from 'tween.js'

import Motor from 'infamous/motor/Motor'
import 'infamous/motor-html'

import geometry from 'csg'

import RippleFlip from './rippleFlip'

function getUserAudio() {
    let resolve, reject
    const promise = new Promise((res, rej) => {resolve = res; reject = rej})

    navigator.getUserMedia (
        { audio: true },
        stream => resolve(stream),
        err => reject(err),
    )

    return promise
}

export default
class App extends React.Component {

    constructor(props) {
        super(props)
/*
 *
 *        //const shape = geometry.sphere({ radius: 130 })
 *        const shape = geometry.cube({ radius: 70 })
 *
 *        const polys = shape.toPolygons()
 *
 *        //const positions = polys.map(poly => poly.vertices[Math.round(poly.vertices.length/2)].pos)
 *        this.positions = polys.reduce((output, poly) => output.concat(poly.vertices.map(v => v.pos)), [])
 */

        this.circle1Radius = 105
        this.circle3Radius = 34

        this.circle2OuterRadius = this.circle1Radius - 5
        this.circle2InnerRadius = this.circle3Radius + 8

        this.circle4Radius = 25

        this.circle1Range = _.range(48)
        this.circle2Range = _.range(24)
        this.circle3Range = _.range(24)
        this.circle4Range = _.range(12)

        this.circle2triangles = _.range(5)

        const innerTriangleSize = 4
        const outerTriangleSize = 14
        this.innerTriangleSizes = _.range(4, 14, 2)

        const spacing = 4
        this.circle2triangleRadii = [
            this.circle2InnerRadius,
            this.circle2InnerRadius + spacing*1 + 4,
            this.circle2InnerRadius + spacing*2 + 4 + 6,
            this.circle2InnerRadius + spacing*3 + 4 + 6 + 8,
            this.circle2InnerRadius + spacing*4 + 4 + 6 + 8 + 10,
        ]
        //this.circle2triangleRadii = _.map(this.innerTriangleSizes, (n, index) => {
            //return this.circle2InnerRadius + index + this.innerTriangleSizes[index - 1]
        //})

        this.state = {
            triangleColumnAnimParam: 0,
            individualQuadFlipRotations: [],
            outerTrapezoidRingZPos: 50,
            innerQuadRingZPos: -50,
        }

        _.times( this.circle1Range.length,
            () => this.state.individualQuadFlipRotations.push(0)
        )
    }

    render() {
        const {
            triangleColumnAnimParam,
        } = this.state

        const columnTriangleRotation = (
            index,
            animParam = triangleColumnAnimParam,
            numItems = this.circle2triangles.length,
            startAngle = 0,
            endAngle = 360
        ) => {
            const interval = 1 / numItems
            const startPoint = interval * index
            const endPoint = startPoint + interval
            let angle = 0

            if (animParam >= startPoint && animParam < endPoint) {
                const intervalPortion = (animParam - startPoint) / interval
                angle = (endAngle - startAngle) * intervalPortion + startAngle
            }
            else if (animParam < startPoint) {
                angle = startAngle
            }
            else if (animParam >= endPoint) {
                angle = endAngle
            }

            return angle
        }

        const colors = {
            trapezoids: `${21/255} ${131/255} ${224/255}`,
            quads: `${21/255} ${131/255} ${224/255}`,
            triangles: `${255/255} ${120/255} ${24/255}`,
        }

        const triangleRingPositions = []
        const zInterval = this.state.outerTrapezoidRingZPos - this.state.innerQuadRingZPos
        for (const n of this.circle2triangles) {
            triangleRingPositions.push(n+1 * zInterval)
        }
        console.log(triangleRingPositions)

        return (
            <div style={{width:'100%', height:'100%', position: 'relative'}}>
                <div className="rippleFlip" style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width:'100%',
                    height:'100%',
                    zIndex:'0'
                }}>
                    {/*
                    <RippleFlip />
                    */}
                </div>
                <div className="rotation" style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width:'100%',
                    height:'100%',
                    zIndex:'1'
                }}>
                    <motor-scene ref="scene" webglenabled="true" background="0 0 0 1" >
                        <motor-node ref='outer' id='outer' sizeMode='proportional proportional' proportionalSize='1 1' >

                            <motor-node ref='circleRoot' position='0 0 50' rotation="0 30 0">

                                {/*trapezoids*/}
                                <motor-node ref='circle1' position={`0 0 ${this.state.outerTrapezoidRingZPos}`}>
                                    {this.circle1Range.map(n => (
                                        <motor-node
                                            key={n}
                                            rotation={`0 0 ${n * 360/this.circle1Range.length}`}
                                        >
                                            <motor-node
                                                rotation={`0 ${this.state.individualQuadFlipRotations[n]} 0`}
                                            >
                                                <motor-node color={colors.trapezoids} mesh='symtrap' absoluteSize='12 20' position={`0 ${this.circle1Radius} 0`}>
                                                </motor-node>
                                            </motor-node>
                                        </motor-node>
                                    ))}
                                </motor-node>

                                {/*circles of triangles*/}
                                {this.circle2triangles.map(t => (
                                    <motor-node key={t} position={`0 0 ${triangleRingPositions[t]}`}>
                                        {this.circle2Range.map(n => (
                                            <motor-node
                                                key={n}
                                                rotation={`0 0 ${n * 360/this.circle2Range.length}`}
                                            >
                                                <motor-node
                                                    rotation={`${columnTriangleRotation(t)} 0 0`}
                                                    position={`0 ${this.circle2triangleRadii[t]} 0`}
                                                    absoluteSize={`${this.innerTriangleSizes[t]} ${this.innerTriangleSizes[t] * 1.10} 0`}
                                                    mesh="isotriangle"
                                                    color={colors.triangles}
                                                >
                                                </motor-node>
                                            </motor-node>
                                        ))}
                                    </motor-node>
                                ))}

                                {/*little quads*/}
                                <motor-node ref='circle3' position={`0 0 ${this.state.innerQuadRingZPos}`}>
                                    {this.circle3Range.map(n => (
                                        <motor-node key={n} rotation={`0 0 ${n * 360/this.circle3Range.length}`}>
                                            <motor-node mesh='quad' absoluteSize='6 6' position={`0 ${this.circle3Radius} 0`}
                                                color={colors.quads}
                                            >
                                            </motor-node>
                                        </motor-node>
                                    ))}
                                </motor-node>

                                {/*little triangles*/}
                                <motor-node ref='circle4'>
                                    {this.circle4Range.map(n => (
                                        <motor-node key={n} rotation={`0 0 ${n * 360/this.circle4Range.length}`}>
                                            <motor-node mesh='isotriangle' absoluteSize='5 5' position={`0 ${this.circle4Radius} 0`}
                                                color={colors.triangles}
                                            >
                                            </motor-node>
                                        </motor-node>
                                    ))}
                                </motor-node>
                            </motor-node>

                        </motor-node>
                    </motor-scene>
                </div>
            </div>
        )
    }

    async componentDidMount() {
        let deviceOrientation = { x: 0, y: 0, z: 0, }
        this.receiveBroadcastOrientation(deviceOrientation)

        const {circleRoot} = this.refs
        await circleRoot.mountPromise

        Motor.addRenderTask(() => circleRoot.rotation.y++)

        const triangleColumnAnimParam = {p:-1}
        const triangleColumnTween = new TWEEN.Tween(triangleColumnAnimParam)
        triangleColumnTween.__done = false
        triangleColumnTween.__started = false
        triangleColumnTween
            .to({p:1}, 2000)
            //.to({p:-1}, 2000)
            .easing(TWEEN.Easing.Exponential.InOut)
            .onComplete(() => triangleColumnTween.__done = true)
            .onStart(() => triangleColumnTween.__started = true)
            .repeat(Infinity)
            .yoyo(true) // how?
            .start()
            .update(performance.now()) // actually starts it.

        // quad flips for the first (outer) circle.
        const individualTweens = []
        let individualTweensComplete = 0
        for (const n of this.circle1Range) {

            const individualTween = new TWEEN.Tween(this.state.individualQuadFlipRotations)
            individualTween.__done = false
            individualTween.__started = false
            individualTween
                .to({[n]:360}, 1000)
                .easing(TWEEN.Easing.Exponential.InOut)
                .onComplete(() => {individualTween.__done = true; individualTweensComplete++})
                .onStart(() => individualTween.__started = true)
                //.repeat(Infinity)
                //.start()

            individualTweens.push(individualTween)
        }
        let lastIndividualTweenStarted = -1;
        const quadFlipAnimParam = {p:0}
        const quadFlipTween = new TWEEN.Tween(quadFlipAnimParam)
        quadFlipTween.__done = false
        quadFlipTween.__started = false
        quadFlipTween
            .to({p:this.circle1Range.length - 1}, 5000)
            .easing(TWEEN.Easing.Exponential.InOut)
            .onComplete(() => quadFlipTween.__done = true)
            .onStart(() => quadFlipTween.__started = true)
            .onUpdate(() => {
                const index = Math.floor(quadFlipAnimParam.p)
                for (let i = lastIndividualTweenStarted+1; i <= index; i+=1) {
                    const individualTween = individualTweens[i]
                    if (!individualTween.__started)
                        individualTween.start().update(performance.now())
                }
                lastIndividualTweenStarted = index
            })
            //.repeat(Infinity)
            .start()
            .update(performance.now()) // actually starts it.

        Motor.addRenderTask(time => {
            if (triangleColumnTween.__started && !triangleColumnTween.__done)
                triangleColumnTween.update(time)

            if (quadFlipTween.__started && !quadFlipTween.__done)
                quadFlipTween.update(time)

            for (const individualTween of individualTweens) {
                if (individualTween.__started && !individualTween.__done)
                    individualTween.update(time)
            }

            this.state.triangleColumnAnimParam = triangleColumnAnimParam.p
            this.forceUpdate()

            if (
                triangleColumnTween.__done &&
                quadFlipTween.__done &&
                individualTweensComplete == this.circle1Range.length
            ) return false
        })
    }

    receiveBroadcastOrientation(receiver) {
        const broadcast = new Meteor.Broadcast('orientation')
        broadcast.on('data', data => {
            console.log('data')
            Object.assign(receiver, data)
        })
        broadcast.on('error', e => {throw e})
        broadcast.on('ready', () => console.log('broadcast client ready'))
    }
}
