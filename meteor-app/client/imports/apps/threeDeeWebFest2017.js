import * as React from 'react'
import TWEEN from 'tween.js'
import geometry from 'csg'
import color from 'tinycolor2'
import Motor from 'infamous/motor/Motor'
import 'infamous/motor-html'
import sleep from 'awaitbox/timers/sleep'

import RippleFlip from './rippleFlip'

const colors = {
    skyblue: color('#1a95d9'),
    hotpink: color('#d11482'),
    limegreen: color('#90e818'),
    yellow: color('#fdb833'),
    teal: color('#28c9f6'),
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

        this.circle4Radius = 22

        this.circle1Range = _.range(48)
        this.circle2Range = _.range(24)
        this.circle3Range = _.range(24)
        this.circle4Range = _.range(12)

        this.circle2TriangleRings = _.range(5)

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

        const individualQuadFlipRotations = []

        this.startAudio()

        this.state = {
            ready: false, // nothing will render until this is true

            triangleColumnAnimParam: 0,
            individualQuadFlipRotations,

            outerTrapezoidRingZPos: 50,
            innerQuadRingZPos: -50,
            //outerTrapezoidRingZPos: 0,
            //innerQuadRingZPos: 0,
            //outerTrapezoidRingZPos: -100,
            //innerQuadRingZPos: 100,

            audioDataArray: new Uint8Array(this.audioBufferLength),

            color1AnimParam: 0.5,

            triangleRingPositions: [],

            opacity: 0,
        }

        this.calcTriangleRingPositions()

        // init values in individualQuadFlipRotations
        let i = 48
        // TODO which is faster?
        while (i--) individualQuadFlipRotations[i] = 0
        //_.times(i, () => individualQuadFlipRotations.push(0))
    }

    render() {
        const {
            triangleColumnAnimParam,
            individualQuadFlipRotations,
            outerTrapezoidRingZPos,
            innerQuadRingZPos,
            audioDataArray,
            color1AnimParam,
            triangleRingPositions,
        } = this.state

        let {
            skyblue,
            hotpink,
            teal,
            limegreen,
            yellow,
        } = colors

        this.calcTriangleRingPositions()

        ///////////// AUDIO
        const circle1TrapezoidAudioDatum = []
        const {audioDatumPerTrapezoid} = this

        // normalize. (based off MDN tutorials, I'm guessing 128 is the max size of the values?).
        for (let i=0; i<48; i+=1) {
            let audioDatumSumForTrapezoid = 0

            for (let j=i*audioDatumPerTrapezoid, l2=j+audioDatumPerTrapezoid; j<l2; j+=1) {
                audioDatumSumForTrapezoid += audioDataArray[j] / 128 / audioDatumPerTrapezoid
            }

            circle1TrapezoidAudioDatum.push(audioDatumSumForTrapezoid)
        }
        /////////////

        ///////////// AUDIO
        const circle3QuadAudioDatum = []
        const {audioDatumPerQuad} = this

        // normalize. (based off MDN tutorials, I'm guessing 128 is the max size of the values?).
        for (let i=0; i<24; i+=1) {
            let audioDatumSumForQuad = 0

            for (let j=i*audioDatumPerQuad, l2=j+audioDatumPerQuad; j<l2; j+=1) {
                audioDatumSumForQuad += audioDataArray[j] / 128 / audioDatumPerQuad
            }

            circle3QuadAudioDatum.push(audioDatumSumForQuad)
        }
        /////////////

        ///////////////// COLOR
        const colorRotation = color1AnimParam * 360 - 180
        hotpink = hotpink.clone().spin(colorRotation)
        skyblue = skyblue.clone().spin(colorRotation)
        yellow = yellow.clone().spin(colorRotation)
        teal = teal.clone().spin(colorRotation)
        limegreen = limegreen.clone().spin(colorRotation)

        const opacity = this.state.opacity

        if (this.state.opacity <= 1) {
            this.state.opacity += 0.05
            hotpink.setAlpha(opacity)
            skyblue.setAlpha(opacity)
            yellow.setAlpha(opacity)
            teal.setAlpha(opacity)
            limegreen.setAlpha(opacity)
        }

        const circle1Colors = discreteGradient(
            this.circle1Range.length,
            hotpink, skyblue, hotpink,
        )

        const circle2Colors = discreteGradient(
            this.circle2Range.length,
            skyblue, hotpink, yellow, hotpink, skyblue,
        )

        const circle3Colors = discreteGradient(
            this.circle3Range.length,
            teal, limegreen, yellow, limegreen, teal
        )

        const circle4Colors = discreteGradient(
            this.circle4Range.length,
            teal, limegreen, yellow, limegreen, teal
        )
        ////////////////

        return (
            <div style={{visibility: this.state.ready ? 'visible' : 'hidden', width:'100%', height:'100%', position: 'relative'}}>
                <div className="rippleFlip" style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width:'100%',
                    height:'100%',
                    zIndex:'0'
                }}>
                    {/*
                    <RippleFlip color={hotpink} />
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
                    <motor-scene ref="scene" webglenabled="true" background={`${colorToString(hotpink.clone().darken(38))} 1`} >
                        <motor-node ref='outer' id='outer' sizeMode='proportional proportional' proportionalSize='1 1' >

                            <motor-node ref='circleRoot' position='0 0 -50'>

                                {/* outer tiny triangle ring */}
                                <motor-node ref='outerTinyTriangles'
                                    position={`0 0 ${outerTrapezoidRingZPos}`}
                                >
                                    {this.circle1Range.map(n => (
                                        <motor-node
                                            key={n}
                                            rotation={`0 0 ${n * 360/48 + 360/48/2}`}
                                        >
                                            <motor-node
                                                color={colorToString(limegreen)}
                                                mesh='isotriangle'
                                                absoluteSize='4.6 4.6'
                                                //position={`0 ${this.circle1Radius + 25} 0`}
                                                position={`10 ${this.circle1Radius + 25} ${1 * ((circle1TrapezoidAudioDatum[n]-1) * 120 + 1)}`}
                                                rotation='0 0 180'
                                            >
                                            </motor-node>
                                        </motor-node>
                                    ))}
                                </motor-node>

                                {/*trapezoids*/}
                                <motor-node
                                    ref='circle1'
                                    position={`0 0 ${outerTrapezoidRingZPos}`}
                                    //position={`0 0 ${outerTrapezoidRingZPosWithVibration}`}
                                    rotation='0 0 90'
                                >
                                    {this.circle1Range.map(n => (
                                        <motor-node
                                            key={n}
                                            rotation={`0 0 ${n * 360/48}`}
                                        >
                                            <motor-node
                                                rotation={`0 ${individualQuadFlipRotations[n]} 0`}
                                            >
                                                <motor-node
                                                    color={colorToString(circle1Colors[n])}
                                                    //color={colorToString(hotpink)}
                                                    mesh='symtrap'
                                                    //absoluteSize='10 16'
                                                    absoluteSize={`10 ${16 * ((circle1TrapezoidAudioDatum[n]-1) * 5 + 1)}`}
                                                    position={`0 ${this.circle1Radius} 0`}
                                                    rotation='60 0 0'
                                                >
                                                </motor-node>
                                            </motor-node>
                                        </motor-node>
                                    ))}
                                </motor-node>

                                {/* inner tiny triangle ring */}
                                <motor-node ref='innerTinyTriangles'
                                    position={`0 0 ${outerTrapezoidRingZPos}`}
                                >
                                    {this.circle2Range.map(n => (
                                        <motor-node
                                            key={n}
                                            rotation={`0 0 ${n * 360/24 + 360/24/2}`}
                                        >
                                            <motor-node
                                                color={colorToString(limegreen.clone().setAlpha(1))}
                                                mesh='isotriangle'
                                                absoluteSize='4.6 4.6'
                                                //position={`0 ${this.circle1Radius + -10} 0`}
                                                position={`0 ${this.circle1Radius + -10} ${1 * ((circle3QuadAudioDatum[n]-1) * 60 + 1)}`}
                                            >
                                            </motor-node>
                                        </motor-node>
                                    ))}
                                </motor-node>

                                {/*triangle rings*/}
                                {this.circle2TriangleRings.map(t => {
                                    const triangleRotation = columnTriangleRotation(t, triangleColumnAnimParam) + 60
                                    return (
                                        <motor-node key={t} position={`0 0 ${triangleRingPositions[t]}`} rotation='0 0 90'>
                                            {this.circle2Range.map(n => (
                                                <motor-node
                                                    key={n}
                                                    rotation={`0 0 ${n * 360/24}`}
                                                >
                                                    <motor-node
                                                        rotation={`${triangleRotation} 0 0`}
                                                        //rotation='60 0 0'
                                                        position={`0 ${this.circle2triangleRadii[t]} 0`}
                                                        //position={`0 ${this.circle2triangleRadii[t]} ${Math.abs(4 * ((circle3QuadAudioDatum[n]-1) * 5 + 1))}`}
                                                        absoluteSize={`${this.innerTriangleSizes[t]} ${this.innerTriangleSizes[t] * 1.10} 0`}
                                                        mesh="isotriangle"
                                                        color={colorToString(circle2Colors[n])}
                                                        //color={colorToString(skyblue)}
                                                    >
                                                    </motor-node>
                                                </motor-node>
                                            ))}
                                        </motor-node>
                                    )
                                })}

                                {/*little quads*/}
                                <motor-node ref='circle3' position={`0 0 ${innerQuadRingZPos}`} rotation='0 0 90'>
                                    {this.circle3Range.map(n => (
                                        <motor-node key={n} rotation={`0 0 ${n * 360/24}`}>
                                            <motor-node mesh='quad'
                                                position={`0 ${this.circle3Radius} 0`}
                                                //absoluteSize='6 4'
                                                absoluteSize={`6 ${4 * ((circle3QuadAudioDatum[n]-1) * 5 + 1)}`}
                                                color={colorToString(circle3Colors[n])}
                                                //color={colorToString(yellow)}
                                            >
                                            </motor-node>
                                        </motor-node>
                                    ))}
                                </motor-node>

                                {/* inner triangles*/}
                                <motor-node ref='circle4' rotation='0 0 -90' position={`0 0 ${innerQuadRingZPos}`}>
                                    {this.circle4Range.map(n => (
                                        <motor-node key={n} rotation={`0 0 ${n * 360/12}`}>
                                            <motor-node mesh='isotriangle' absoluteSize='5 5' position={`0 ${this.circle4Radius} 0`}
                                                color={colorToString(circle4Colors[n])}
                                                //color={colorToString(teal)}
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

    calcTriangleRingPositions() {
        const {
            triangleRingPositions,
            innerQuadRingZPos,
            outerTrapezoidRingZPos,
        } = this.state
        const zInterval = (outerTrapezoidRingZPos - innerQuadRingZPos) / 5
        let n = 5
        while (n--)
            triangleRingPositions[n] = innerQuadRingZPos + zInterval/2 + n * zInterval
    }

    async componentDidMount() {
        await sleep(1000)
        this.showVisual()
    }

    async showVisual() {
        const {
            individualQuadFlipRotations,
            audioDataArray,
        } = this.state

        let deviceOrientation1 = { x: 0, y: 0, z: 0, }
        let deviceOrientation2 = { x: 0, y: 0, z: 0, }
        let deviceOrientation3 = { x: 0, y: 0, z: 0, }
        this.receiveBroadcastOrientations(deviceOrientation1, deviceOrientation2, deviceOrientation3)

        const {circleRoot, outerTinyTriangles, innerTinyTriangles} = this.refs

        await circleRoot.mountPromise

        const triangleColumnTween = new TWEEN.Tween(this.state)
        triangleColumnTween.__done = false
        triangleColumnTween.__started = false
        triangleColumnTween
            .to({triangleColumnAnimParam:1}, 2000)
            //.to({p:-1}, 2000)
            .easing(TWEEN.Easing.Cubic.InOut)
            .onComplete(() => triangleColumnTween.__done = true)
            .onStart(() => triangleColumnTween.__started = true)
            .repeat(Infinity)
            .yoyo(true) // how?
            .start()
            .update(performance.now()) // actually starts it.

        //// quad flips for the first (outer) circle.
        //const individualTweens = []
        //let individualTweensComplete = 0
        //let n = this.circle1Range.length
        //while (n--) {

            //const individualTween = new TWEEN.Tween(individualQuadFlipRotations)
            //individualTween.__done = false
            //individualTween.__started = false
            //individualTween
                //.to({[n]:360}, 4000)
                //.easing(TWEEN.Easing.Exponential.InOut)
                //.onComplete(() => {individualTween.__done = true; individualTweensComplete++})
                //.onStart(() => individualTween.__started = true)
                ////.repeat(Infinity)
                ////.start()

            //individualTweens.push(individualTween)
        //}
        //let lastIndividualTweenStarted = -1;
        //const quadFlipAnimParam = {p:0}
        //const quadFlipTween = new TWEEN.Tween(quadFlipAnimParam)
        //quadFlipTween.__done = false
        //quadFlipTween.__started = false
        //quadFlipTween
            //.to({p:48 - 1}, 5000)
            //.easing(TWEEN.Easing.Exponential.InOut)
            //.onComplete(() => quadFlipTween.__done = true)
            //.onStart(() => quadFlipTween.__started = true)
            //.onUpdate(() => {
                //const index = Math.floor(quadFlipAnimParam.p)
                //for (let i = lastIndividualTweenStarted+1; i <= index; i+=1) {
                    //const individualTween = individualTweens[i]
                    //if (!individualTween.__started)
                        //individualTween.start().update(performance.now())
                //}
                //lastIndividualTweenStarted = index
            //})
            ////.repeat(Infinity)
            //.start()
            //.update(performance.now()) // actually starts it.

        Motor.addRenderTask(time => {
            //circleRoot.rotation.y = 30 * Math.sin(time * 0.001)
            //circleRoot.rotation.y += 1
            circleRoot.rotation.x = deviceOrientation1.x % 90
                * (45/90) // limit to +/-45 degrees
            circleRoot.rotation.y = deviceOrientation1.y
                * (45/90) // limit to +/-45 degrees

            this.state.color1AnimParam = deviceOrientation2.z / 360

            this.state.outerTrapezoidRingZPos = deviceOrientation3.y
            this.state.innerQuadRingZPos = -deviceOrientation3.y

            //outerTinyTriangles.rotation.x += 2
            //innerTinyTriangles.rotation.y -= 2

            ///////////// AUDIO
            this.audioAnalyser.getByteTimeDomainData(audioDataArray)
            /////////////

            if (triangleColumnTween.__started && !triangleColumnTween.__done)
                triangleColumnTween.update(time)

            //if (quadFlipTween.__started && !quadFlipTween.__done)
                //quadFlipTween.update(time)

            //let individualTween = individualTweens.length
            //while (individualTween--) {
                //const tween = individualTweens[individualTween]
                //if (tween.__started && !tween.__done)
                    //tween.update(time)
            //}

            if (!this.state.ready) this.state.ready = true
            this.forceUpdate()
        })
    }

    startAudio() {
        ///////////////////////////////// AUDIO
        const audio = new AudioContext

        // make audio source node
        const audioElement = document.createElement('audio')
        audioElement.setAttribute('src', '/UnionMystica.mp3')
        audioElement.setAttribute('autoplay', 'true')
        document.body.appendChild(audioElement)
        const source = audio.createMediaElementSource(audioElement)

        // create an analyser node to analize the data, and connect source to
        // it. We don't need to output to the AudioContext destination node,
        // since it is already playing from the audio element.
        this.audioAnalyser = audio.createAnalyser()
        this.audioAnalyser.fftSize = 2048; // default 2048
        this.audioBufferLength = this.audioAnalyser.frequencyBinCount;
        //this.audioBufferLength = this.audioAnalyser.fftSize;
        this.audioDatumPerTrapezoid = Math.floor(this.audioBufferLength / 48)
        this.audioDatumPerQuad = Math.floor(this.audioBufferLength / 24)
        this.audioDatumPer12th = Math.floor(this.audioBufferLength / 12)
        source.connect(this.audioAnalyser)

        // connect to the speakers
        this.audioAnalyser.connect(audio.destination)
        /////////////////////////////////////////
    }

    receiveBroadcastOrientations(deviceOrientation1, deviceOrientation2, deviceOrientation3) {
        const streamer = new Meteor.Streamer('orientation')

        streamer.on('orientation1', data => {
            Object.assign(deviceOrientation1, data)
        })
        streamer.on('error', e => {throw e})
        streamer.on('ready', () => console.log('streamer client ready'))

        streamer.on('orientation2', data => {
            Object.assign(deviceOrientation2, data)
        })
        streamer.on('error', e => {throw e})
        streamer.on('ready', () => console.log('broadcast client ready'))

        streamer.on('orientation3', data => {
            Object.assign(deviceOrientation3, data)
        })
        streamer.on('error', e => {throw e})
        streamer.on('ready', () => console.log('broadcast3 client ready'))

        ////////////////////////////////////////

        //const broadcast1 = new Meteor.Broadcast('orientation1')
        //broadcast1.on('data', data => {
            //Object.assign(deviceOrientation1, data)
        //})
        //broadcast1.on('error', e => {throw e})
        //broadcast1.on('ready', () => console.log('broadcast1 client ready'))

        //const broadcast2 = new Meteor.Broadcast('orientation2')
        //broadcast2.on('data', data => {
            //Object.assign(deviceOrientation2, data)
        //})
        //broadcast2.on('error', e => {throw e})
        //broadcast2.on('ready', () => console.log('broadcast2 client ready'))

        //const broadcast3 = new Meteor.Broadcast('orientation3')
        //broadcast3.on('data', data => {
            //Object.assign(deviceOrientation3, data)
        //})
        //broadcast3.on('error', e => {throw e})
        //broadcast3.on('ready', () => console.log('broadcast3 client ready'))
    }
}

function colorToString(color) {
    color = color.toRgb()
    return `${color.r/255} ${color.g/255} ${color.b/255} ${color.a}`
}

function columnTriangleRotation(
    index,
    animParam = 0,
    numItems = 5,
    startAngle = 0,
    endAngle = 360
) {
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

const {
    skyblue,
    hotpink,
    teal,
    yellow,
    limegreen,
} = colors

// XXX We can further improve perf by accepting an array to put values into.
// We can also cache the interval calculations of the conditional check in the
// inner loop.
function discreteGradient(n, ...colors) {
    const numberOfColors = colors.length
    const numberOfColorTransitions = numberOfColors - 1
    const interval = Math.floor(n / numberOfColorTransitions)
    const discreteColors = []

    // for each discrete color that we will have
    for (let i=0; i<n; i+=1) {

        // see which color interval the the discrete color will fall in so we
        // know which two colors to mix with `.mix()`.
        for (let j=0; j<numberOfColorTransitions; j+=1) {
            if (i >= j*interval && i < (j+1)*interval) {
                discreteColors.push(
                    // mix this color with the next color by a certain percent
                    // based on the interval
                    color.mix(colors[j], colors[j+1], 100 / (interval - 1) * (i % interval))
                )
            }
        }
    }

    return discreteColors
}
