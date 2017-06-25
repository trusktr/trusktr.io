import * as React from 'react'
import TWEEN from 'tween.js'
import geometry from 'csg'
import color from 'tinycolor2'
import Motor from 'infamous/motor/Motor'
import 'infamous/motor-html'

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

        ///////////////////////////////// AUDIO
        const audio = new AudioContext

        // make audio source node
        const audioElement = document.createElement('audio')
        audioElement.setAttribute('src', '/echo-vulture.mp3')
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
        source.connect(this.audioAnalyser)

        // connect to the speakers
        this.audioAnalyser.connect(audio.destination)
        /////////////////////////////////////////

        const individualQuadFlipRotations = []

        this.state = {
            triangleColumnAnimParam: 0,
            individualQuadFlipRotations,

            outerTrapezoidRingZPos: 50,
            innerQuadRingZPos: -50,
            //outerTrapezoidRingZPos: 0,
            //innerQuadRingZPos: 0,

            audioDataArray: new Uint8Array(this.audioBufferLength),
        }

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
        } = this.state

        const {
            skyblue,
            hotpink,
            limegreen,
        } = colors

        const triangleRingPositions = []
        const zInterval = (outerTrapezoidRingZPos - innerQuadRingZPos) / 5
        for (const n of this.circle2TriangleRings) {
            triangleRingPositions.push( innerQuadRingZPos + zInterval/2 + n * zInterval )
        }

        ///////////// AUDIO
        const circle1AudioData = []
        const {audioDatumPerTrapezoid} = this

        // normalize. (based off MDN tutorials, I'm guessing 128 is the max size of the values?).
        for (let i=0; i<48; i+=1) {
            let audioDatumSumForTrapezoid = 0

            for (let j=i*audioDatumPerTrapezoid, l2=j+audioDatumPerTrapezoid; j<l2; j+=1) {
                audioDatumSumForTrapezoid += audioDataArray[j] / 128 / audioDatumPerTrapezoid
            }

            circle1AudioData.push(audioDatumSumForTrapezoid)
        }
        /////////////

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

                            <motor-node ref='circleRoot' position='0 0 -50'>

                                {/* outer tiny triangle ring */}
                                <motor-node ref='outerTinyTriangles'>
                                    {this.circle1Range.map(n => (
                                        <motor-node
                                            key={n}
                                            rotation={`0 0 ${n * 360/48 + 360/48/2}`}
                                        >
                                            <motor-node color={colorToString(limegreen)} mesh='isotriangle' absoluteSize='4.6 4.6' position={`0 ${this.circle1Radius + 25} 0`} rotation='0 0 180'>
                                            </motor-node>
                                        </motor-node>
                                    ))}
                                </motor-node>

                                {/*trapezoids*/}
                                <motor-node ref='circle1' position={`0 0 ${outerTrapezoidRingZPos}`} rotation='0 0 90'>
                                    {this.circle1Range.map(n => (
                                        <motor-node
                                            key={n}
                                            rotation={`0 0 ${n * 360/48}`}
                                        >
                                            <motor-node
                                                rotation={`0 ${individualQuadFlipRotations[n]} 0`}
                                            >
                                                <motor-node
                                                    color={colorToString(color.mix(hotpink, skyblue, 250/(48-1)*Math.min(n, 48-1-n)))}
                                                    mesh='symtrap'
                                                    absoluteSize={`10 ${16 * ((circle1AudioData[n]-1) * 10 + 1)}`}
                                                    position={`0 ${this.circle1Radius} 0`}
                                                >
                                                </motor-node>
                                            </motor-node>
                                        </motor-node>
                                    ))}
                                </motor-node>

                                {/* inner tiny triangle ring */}
                                <motor-node ref='innerTinyTriangles'>
                                    {this.circle2Range.map(n => (
                                        <motor-node
                                            key={n}
                                            rotation={`0 0 ${n * 360/24 + 360/24/2}`}
                                        >
                                            <motor-node color={colorToString(limegreen)} mesh='isotriangle' absoluteSize='4.6 4.6' position={`0 ${this.circle1Radius + -10} 0`}>
                                            </motor-node>
                                        </motor-node>
                                    ))}
                                </motor-node>

                                {/*triangle rings*/}
                                {this.circle2TriangleRings.map(t => {
                                    const triangleRotation = columnTriangleRotation(t, triangleColumnAnimParam)
                                    return (
                                        <motor-node key={t} position={`0 0 ${triangleRingPositions[t]}`} rotation='0 0 90'>
                                            {this.circle2Range.map(n => (
                                                <motor-node
                                                    key={n}
                                                    rotation={`0 0 ${n * 360/24}`}
                                                >
                                                    <motor-node
                                                        rotation={`${triangleRotation} 0 0`}
                                                        position={`0 ${this.circle2triangleRadii[t]} 0`}
                                                        absoluteSize={`${this.innerTriangleSizes[t]} ${this.innerTriangleSizes[t] * 1.10} 0`}
                                                        mesh="isotriangle"
                                                        color={circle2TriangleColor(Math.min(n, 24-1-n), t)}
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
                                            <motor-node mesh='quad' absoluteSize='6 4' position={`0 ${this.circle3Radius} 0`}
                                                color={circle3Color(n)}
                                            >
                                            </motor-node>
                                        </motor-node>
                                    ))}
                                </motor-node>

                                {/* inner triangles*/}
                                <motor-node ref='circle4' rotation='0 0 -90'>
                                    {this.circle4Range.map(n => (
                                        <motor-node key={n} rotation={`0 0 ${n * 360/12}`}>
                                            <motor-node mesh='isotriangle' absoluteSize='5 5' position={`0 ${this.circle4Radius} 0`}
                                                color={circle4Color(n)}
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
        const {
            individualQuadFlipRotations,
            audioDataArray,
        } = this.state

        let deviceOrientation = { x: 0, y: 0, z: 0, }
        this.receiveBroadcastOrientation(deviceOrientation)

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

        // quad flips for the first (outer) circle.
        const individualTweens = []
        let individualTweensComplete = 0
        for (const n of this.circle1Range) {

            const individualTween = new TWEEN.Tween(individualQuadFlipRotations)
            individualTween.__done = false
            individualTween.__started = false
            individualTween
                .to({[n]:360}, 4000)
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
            .to({p:48 - 1}, 5000)
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
            circleRoot.rotation.y = 30 * Math.sin(time * 0.001)

            ///////////// AUDIO
            this.audioAnalyser.getByteTimeDomainData(audioDataArray)

            if (triangleColumnTween.__started && !triangleColumnTween.__done)
                triangleColumnTween.update(time)

            if (quadFlipTween.__started && !quadFlipTween.__done)
                quadFlipTween.update(time)

            for (const individualTween of individualTweens) {
                if (individualTween.__started && !individualTween.__done)
                    individualTween.update(time)
            }

            //this.state.outerTrapezoidRingZPos--
            outerTinyTriangles.rotation.x += 2
            innerTinyTriangles.rotation.y -= 2

            this.forceUpdate()
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

function colorToString(str) {
    str = str.toRgb()
    return `${str.r/255} ${str.g/255} ${str.b/255}`
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

function circle2TriangleColor(n) {
    if (n >= 0 && n < 6) {
        return colorToString(color.mix(skyblue, hotpink, 100/(6-1) * (n%6)))
    }
    else if (n >= 6 && n < 12) {
        return colorToString(color.mix(hotpink, yellow, 100/(6-1) * (n%6)))
    }
    else if (n >= 12 && n < 18) {
        return colorToString(color.mix(yellow, hotpink, 100/(6-1) * (n%6)))
    }
    else if (n >= 18 && n < 24) {
        return colorToString(color.mix(hotpink, skyblue, 100/(6-1) * (n%6)))
    }
}

function circle3Color(n) {
    if (n >= 0 && n < 6) {
        return colorToString(color.mix(teal, limegreen, 100/(6-1) * (n%6)))
    }
    else if (n >= 6 && n < 12) {
        return colorToString(color.mix(limegreen, yellow, 100/(6-1) * (n%6)))
    }
    else if (n >= 12 && n < 18) {
        return colorToString(color.mix(yellow, limegreen, 100/(6-1) * (n%6)))
    }
    else if (n >= 18 && n < 24) {
        return colorToString(color.mix(limegreen, teal, 100/(6-1) * (n%6)))
    }
}

function circle4Color(n) {
    if (n >= 0 && n < 3) {
        return colorToString(color.mix(teal, limegreen, 100/(3-1) * (n%3)))
    }
    else if (n >= 3 && n < 6) {
        return colorToString(color.mix(limegreen, yellow, 100/(3-1) * (n%3)))
    }
    else if (n >= 6 && n < 9) {
        return colorToString(color.mix(yellow, limegreen, 100/(3-1) * (n%3)))
    }
    else if (n >= 9 && n < 12) {
        return colorToString(color.mix(limegreen, teal, 100/(3-1) * (n%3)))
    }
}
