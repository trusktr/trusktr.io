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

        this.state = {
            triangleColumnAnimParam: 0,
            quadFlipAnimParam: 0,
        }

        this.circle1Radius = 105
        this.circle2Radius = 50
        this.circle3Radius = 34
        this.circle4Radius = 25

        this.circle1Range = _.range(36)
        this.circle2Range = _.range(27)
        this.circle3Range = _.range(24)
        this.circle4Range = _.range(15)

        this.circle2triangles = _.range(5)
    }

    render() {

        const {
            triangleColumnAnimParam,
            quadFlipAnimParam,
        } = this.state

        const columnTriangleRotation = (
            index,
            animParam = triangleColumnAnimParam,
            numItems = this.circle2triangles.length,
            startAngle = 0,
            endAngle = 180
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

        const quadFlipRotation = (
            index,
            animParam = quadFlipAnimParam,
            numItems = this.circle1Range.length,
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
            quads: `${21/255} ${131/255} ${224/255}`,
            triangles: `${255/255} ${120/255} ${24/255}`,
        }

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

                            <motor-node ref='circleRoot' position='0 0 100'>

                                {/*quads*/}
                                <motor-node ref='circle1'>
                                    {this.circle1Range.map(n => (
                                        <motor-node
                                            key={n}
                                            rotation={`0 0 ${n * 360/this.circle1Range.length}`}
                                        >
                                            <motor-node
                                                rotation={`0 ${quadFlipRotation(n)} 0`}
                                            >
                                                <motor-node color={colors.quads} mesh='quad' absoluteSize='8 20' position={`0 ${this.circle1Radius} 0`}>
                                                </motor-node>
                                            </motor-node>
                                        </motor-node>
                                    ))}
                                </motor-node>

                                {/*columns of triangles*/}
                                <motor-node ref='circle2'>
                                    {this.circle2Range.map(n => (
                                        <motor-node key={n} rotation={`0 0 ${n * 360/this.circle2Range.length}`}>
                                            <motor-node position={`0 ${this.circle2Radius} 0`}>
                                                {/*column of triangles*/}
                                                {this.circle2triangles.map(t => (
                                                    <motor-node key={t}
                                                        position={`0 ${t * 10} 0`}
                                                        rotation={`${columnTriangleRotation(t, triangleColumnAnimParam + (1/this.circle2Range.length)*n)} 0 0`}
                                                    >
                                                        <motor-node mesh='isotriangle' absoluteSize='8 8'
                                                            color={colors.triangles}
                                                            position='0 -5 0'
                                                        >
                                                        </motor-node>
                                                    </motor-node>
                                                ))}
                                            </motor-node>
                                        </motor-node>
                                    ))}
                                </motor-node>

                                {/*little quads*/}
                                <motor-node ref='circle3'>
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

        const triangleColumnAnimParam = {p:-1}
        triangleColumnTweenDone = false
        const triangleColumnTween = new TWEEN.Tween(triangleColumnAnimParam)
            .to({p:1}, 2000)
            //.to({p:-1}, 2000)
            .easing(TWEEN.Easing.Exponential.InOut)
            .onComplete(() => triangleColumnTweenDone = true)
            //.yoyo() // how?
            .repeat(Infinity)
            .start()

        const quadFlipAnimParam = {p:0}
        quadFlipAnimTweenDone = false
        const quadFlipTween = new TWEEN.Tween(quadFlipAnimParam)
            .to({p:1}, 10000)
            //.to({p:0}, 2000)
            //.easing(TWEEN.Easing.Exponential.InOut)
            .onComplete(() => quadFlipAnimTweenDone = true)
            .repeat(Infinity)
            .start()

        // CONTINUE: making the quad flips be smooth with one animation per quad.
        //let individualQuadFlips = []
        //for (const n of this.circle1Range) {

            //const individualParam = {p:0}
            //individualTweenDone = false
            //const individualTween = new TWEEN.Tween(individualParam)
                //.to({p:1}, 10000)
                ////.to({p:0}, 2000)
                ////.easing(TWEEN.Easing.Exponential.InOut)
                //.onComplete(() => individualTweenDone = true)
                //.repeat(Infinity)
                //.start()

            //individualQuadFlips.push(individualTween)
        //}

        Motor.addRenderTask(time => {
            triangleColumnTween.update(time)
            quadFlipTween.update(time)

            this.setState({
                triangleColumnAnimParam: triangleColumnAnimParam.p,
                quadFlipAnimParam: quadFlipAnimParam.p,
            })

            if (
                triangleColumnTweenDone &&
                quadFlipAnimTweenDone
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
