<!--

The MIT License

Copyright (c) 2015 Joseph Orbegoso Pea and Anastasiia Vedernikova

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

-->

<template>
    <div ref="container" :style="{ visibility: ready ? 'visible' : 'hidden', width: '100%', height: '100%', position: 'relative' }">
        <i-scene ref="scene" webglenabled="true" :background="`${colorToString(hotpink.clone().darken(38))} 1`" >
            <i-node ref='outer' id='outer' sizemode='proportional proportional' size='1 1' >

                <i-node ref='circleRoot' position='0 0 -50'>

                    <!-- outer tiny triangle ring -->
                    <i-node ref='outerTinyTriangles'
                        :position="`0 0 ${outerTrapezoidRingZPos}`"
                        rotation="0 0 90"
                    >

                        <i-node
                            v-for="n in circle1Range"
                            :key="n"
                            x-rotation="`0 0 ${ n * 360/48 + 360/48/2 }`"
                            :rotation="`0 0 ${ n * 11.25 }`"
                            xx-rotation="[0, 0, n * 11.25]"
                        >
                            <i-node
                                :color="limegreenString"
                                mesh='isotriangle'
                                size='4.6 4.6'
                                :position="`0 ${tinyTrianglesPositionY} ${tinyTrianglesPositionsZ[n]}`"
                                rotation='0 0 180'
                            >
                            </i-node>
                        </i-node>

                    </i-node>

                    <!-- trapezoids -->
                    <i-node
                        ref='circle1'
                        :position="`0 0 ${outerTrapezoidRingZPos}`"
                        rotation='0 0 90'
                    >

                        <i-node
                            v-for="n in circle1Range"
                            :key="n"
                            x-rotation="`0 0 ${n * 360/48}`"
                            :rotation="`0 0 ${n * 7.5}`"
                        >
                            <i-node
                                :rotation="`0 0 0`"
                            >
                                <i-node
                                    :color="circle1Colors[n]"
                                    mesh='symtrap'
                                    :size="`10 ${trapezoidSizesY[n]}`"
                                    :position="`0 ${circle1Radius} 0`"
                                    rotation='60 0 0'
                                >
                                </i-node>
                            </i-node>
                        </i-node>

                    </i-node>

                    <!-- inner tiny triangle ring -->
                    <i-node ref='innerTinyTriangles'
                        :position="`0 0 ${outerTrapezoidRingZPos}`"
                        rotation="0 0 90"
                    >

                        <i-node
                            v-for="n in circle2Range"
                            :key="n"
                            x-rotation="`0 0 ${n * 360/24 + 360/24/2}`"
                            :rotation="`0 0 ${n * 22.5}`"
                        >
                            <i-node
                                :color="limegreenString"
                                mesh='isotriangle'
                                size='4.6 4.6'
                                :position="`0 ${innerTinyTrianglesPositionY} ${innerTinyTrianglesPositionsZ[n]}`"
                            >
                            </i-node>
                        </i-node>

                    </i-node>

                    <!-- triangle rings -->
                    <i-node v-for="t in circle2TriangleRings" :key="t" :position="`0 0 ${triangleRingPositions[t]}`" rotation='0 0 90'>
                        <i-node
                            v-for="n in circle2Range"
                            :key="n"
                            x-rotation="`0 0 ${n * 360/24}`"
                            :rotation="`0 0 ${n * 15}`"
                        >
                            <i-node
                                :rotation="`${columnTriangleRotations[t]} 0 0`"
                                :position="`0 ${circle2triangleRadii[t]} 0`"
                                :size="`${innerTriangleSizes[t]} ${innerTriangleSizes[t] * 1.10} 0`"
                                mesh="isotriangle"
                                :color="circle2Colors[n]"
                            >
                            </i-node>
                        </i-node>
                    </i-node>

                    <!-- little quads -->
                    <i-node ref='circle3' :position="`0 0 ${innerQuadRingZPos}`" rotation='0 0 90'>
                        <i-node v-for="n in circle3Range" :key="n" x-rotation="`0 0 ${n * 360/24}`" :rotation="`0 0 ${n * 15}`">
                            <i-node mesh='quad'
                                :position="`0 ${circle3Radius} 0`"
                                :size="`6 ${littleQuadsSizesY[n]}`"
                                :color="circle3Colors[n]"
                            >
                            </i-node>
                        </i-node>
                    </i-node>

                    <!-- inner triangles -->
                    <i-node ref='circle4' rotation='0 0 -90' :position="`0 0 ${innerQuadRingZPos}`">
                        <i-node v-for="n in circle4Range" :key="n" x-rotation="`0 0 ${n * 360/12}`" :rotation="`0 0 ${n * 30}`">
                            <i-node mesh='isotriangle' size='4 5' :position="`0 ${circle4Radius} 0`"
                                :color="circle4Colors[n]"
                            >
                            </i-node>
                        </i-node>
                    </i-node>
                </i-node>

            </i-node>
        </i-scene>
    </div>
</template>

<script>
    // pointer events polyfill
    import 'pepjs'

    import TWEEN from 'tween.js'
    import geometry from 'csg'
    import color from 'tinycolor2'
    import Motor from 'infamous/core/Motor'
    //import { useDefaultNames } from 'infamous/html' // already called by home.js
    import sleep from 'awaitbox/timers/sleep'

    if (!window.AudioContext && window.webkitAudioContext)
        window.AudioContext = window.webkitAudioContext

    const colors = {
        skyblue_: color('#1a95d9'),
        hotpink_: color('#d11482'),
        limegreen_: color('#90e818'),
        yellow_: color('#fdb833'),
        teal_: color('#28c9f6'),
    }

    const outerTrapezoidRingZPos = 50
    const innerQuadRingZPos = -50

    export default {
        data: () => ({
            ready: false, // nothing will render until this is true

            circle1Radius: 105,
            circle3Radius: 34,

            circle4Radius: 22,

            circle1Range: _.range(48),
            circle2Range: _.range(24),
            circle3Range: _.range(24),
            circle4Range: _.range(12),

            circle2TriangleRings: _.range(5),

            innerTriangleSizes: _.range(4, 14, 2),

            triangleColumnAnimParam: 0,

            outerTrapezoidRingZPos,
            innerQuadRingZPos,

            audioDataArray: [],
            circle1TrapezoidAudioDatum: _.range(48),
            circle3QuadAudioDatum: _.range(24),

            color1AnimParam: 0.5,

            skyblue_: colors.skyblue_,
            hotpink_: colors.hotpink_,
            limegreen_: colors.limegreen_,
            yellow_: colors.yellow_,
            teal_: colors.teal_,
        }),

        computed: {

            tinyTrianglesPositionY: function() {
                return this.circle1Radius + 25
            },

            tinyTrianglesPositionsZ: function() {
                return this.circle1Range.map( n => 1 * ( (this.circle1TrapezoidAudioDatum[n]-1) * 120 + 1 ) )
            },

            trapezoidSizesY: function() {
                return this.circle1Range.map( n => Math.abs(16 * ((this.circle1TrapezoidAudioDatum[n]-1) * 5 + 1)) )
            },

            innerTinyTrianglesPositionY: function() {
                return this.circle1Radius + -10
            },

            innerTinyTrianglesPositionsZ: function() {
                return this.circle2Range.map( n => 1 * ((this.circle3QuadAudioDatum[n]-1) * 60 + 1) )
            },

            littleQuadsSizesY: function() {
                return this.circle3Range.map( n => Math.abs(4 * ((this.circle3QuadAudioDatum[n]-1) * 5 + 1)) )
            },

            triangleRingPositions: function() {
                const newTriangleRingPositions = []

                const zInterval = (this.outerTrapezoidRingZPos - this.innerQuadRingZPos) / 5

                let n = 5
                while (n--)
                    newTriangleRingPositions[n] = this.innerQuadRingZPos + zInterval/2 + n * zInterval

                return newTriangleRingPositions
            },

            circle2triangleRadii: function() {
                const circle2InnerRadius = this.circle3Radius + 8
                const spacing = 4
                return [
                    circle2InnerRadius,
                    circle2InnerRadius + spacing*1 + 4,
                    circle2InnerRadius + spacing*2 + 4 + 6,
                    circle2InnerRadius + spacing*3 + 4 + 6 + 8,
                    circle2InnerRadius + spacing*4 + 4 + 6 + 8 + 10,
                ]
            },

            colorRotation: function() {
                return this.color1AnimParam * 360 - 180
            },

            hotpink: function() {
                return this.hotpink_.clone().spin(this.colorRotation)
            },
            skyblue: function() {
                return this.skyblue_.clone().spin(this.colorRotation)
            },
            yellow: function() {
                return this.yellow_.clone().spin(this.colorRotation)
            },
            teal: function() {
                return this.teal_.clone().spin(this.colorRotation)
            },
            limegreen: function() {
                return this.limegreen_.clone().spin(this.colorRotation)
            },
            limegreenString() {
                return this.colorToString(this.limegreen)
            },

            circle1Colors: function() {
                return this.discreteGradient(
                    this.circle1Range.length,
                    this.hotpink, this.skyblue, this.hotpink,
                )
            },

            circle2Colors: function() {
                return this.discreteGradient(
                    this.circle2Range.length,
                    this.skyblue, this.hotpink, this.yellow, this.hotpink, this.skyblue,
                )
            },

            circle3Colors: function() {
                return this.discreteGradient(
                    this.circle3Range.length,
                    this.teal, this.limegreen, this.yellow, this.limegreen, this.teal
                )
            },

            circle4Colors: function() {
                return this.discreteGradient(
                    this.circle4Range.length,
                    this.teal, this.limegreen, this.yellow, this.limegreen, this.teal
                )
            },

            columnTriangleRotations() {
                return this.circle2TriangleRings.map( t => this.columnTriangleRotation(t, this.triangleColumnAnimParam) + 60 )
            },
        },

        methods: {
            initialize() {
                if (this.isInitialized) return
                this.isInitialized = true

                this.audioAnalyser = null

                this.startAudio()
            },

            startAudio() {
                ///////////////////////////////// AUDIO
                const audio = new AudioContext

                // make audio source node
                const audioElement = document.createElement('audio')
                audioElement.setAttribute('src', '/UnionMystica.mp3')
                //audioElement.setAttribute('src', '/laikamori-masken.mp3')
                audioElement.setAttribute('autoplay', 'true')
                document.body.appendChild(audioElement)
                const source = audio.createMediaElementSource(audioElement)

                // create an analyser node to analize the data, and connect source to
                // it. We don't need to output to the AudioContext destination node,
                // since it is already playing from the audio element.
                this.audioAnalyser = audio.createAnalyser()
                this.audioAnalyser.fftSize = 2048; // default 2048
                const audioBufferLength = this.audioAnalyser.frequencyBinCount;
                //const audioBufferLength = this.audioAnalyser.fftSize;
                this.audioDataArray = new Uint8Array(audioBufferLength)
                this.calcAudioData()
                source.connect(this.audioAnalyser)

                // connect to the speakers
                this.audioAnalyser.connect(audio.destination)
                /////////////////////////////////////////
            },

            async showVisual() {
                const { audioDataArray } = this
                const { container, circleRoot } = this.$refs

                let deviceOrientation1 = { x: 0, y: 0, z: 0, }
                let deviceOrientation2 = { x: 0, y: 0, z: 0, }
                let deviceOrientation3 = { x: 0, y: 0, z: 0, }
                //this.receiveBroadcastOrientations(deviceOrientation1, deviceOrientation2, deviceOrientation3)

                let mouseXRatio = 0
                let mouseYRatio = 0
                container.setAttribute('touch-action', 'none') // polyfill
                container.style['touch-events'] = 'none' // native
                container.addEventListener('mousemove', e => {
                })
                container.addEventListener('pointermove', e => {
                    e.preventDefault() // just in case
                    mouseXRatio = e.clientX / window.innerWidth
                    mouseYRatio = e.clientY / window.innerHeight
                })

                await circleRoot.mountPromise

                const triangleColumnTween = new TWEEN.Tween(this)
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

                Motor.addRenderTask(time => {
                    this.audioAnalyser.getByteTimeDomainData(audioDataArray)
                    this.calcAudioData()

                    // TODO set this with state
                    circleRoot.rotation.x = mouseYRatio * 60 - 30;
                    circleRoot.rotation.y = mouseXRatio * 60 - 30;

                    if (triangleColumnTween.__started && !triangleColumnTween.__done)
                        triangleColumnTween.update(time)

                    //this.color1AnimParam = deviceOrientation2.z / 360
                    this.color1AnimParam = mouseXRatio

                    //this.outerTrapezoidRingZPos = deviceOrientation3.y
                    //this.innerQuadRingZPos = -deviceOrientation3.y
                    this.outerTrapezoidRingZPos = mouseYRatio * 90 - 45
                    this.innerQuadRingZPos = -mouseYRatio * 90 - 45

                    this.ready = true
                })
            },

            colorToString(color) {
                color = color.toRgb()
                return `${color.r/255} ${color.g/255} ${color.b/255} ${color.a}`
            },

            columnTriangleRotation(
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
            },

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
            },

            // Is mapAudioDataToFewerUnits a good name for this?
            mapAudioDataToFewerUnits(audioDataArray, numberOfUnits) {
                const newAudioDatum = []
                const audioDatumPerUnit = Math.floor(audioDataArray.length / numberOfUnits)

                // normalize. (based off MDN tutorials, I'm guessing 128 is the max size of the values?).
                for (let i=0; i<numberOfUnits; i+=1) {
                    let audioDatumSumForUnit = 0

                    for (let j=i*audioDatumPerUnit, l2=j+audioDatumPerUnit; j<l2; j+=1) {
                        audioDatumSumForUnit += audioDataArray[j] / 128 / audioDatumPerUnit
                    }

                    newAudioDatum.push(audioDatumSumForUnit)
                }

                return newAudioDatum
            },

            calcAudioData() {
                this.circle1TrapezoidAudioDatum = this.mapAudioDataToFewerUnits(this.audioDataArray, this.circle1Range.length)
                this.circle3QuadAudioDatum = this.mapAudioDataToFewerUnits(this.audioDataArray, this.circle3Range.length)
            },

            // XXX We can further improve perf by accepting an array to put values into.
            // We can also cache the interval calculations of the conditional check in the
            // inner loop.
            discreteGradient(n, ...colors) {
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
                                this.colorToString(color.mix(colors[j], colors[j+1], 100 / (interval - 1) * (i % interval)))
                            )
                        }
                    }
                }

                return discreteColors
            },
        },

        async mounted() {
            console.log('oh yeah Vue!!')
            this.initialize()
            await sleep(1000)
            this.showVisual()
        }
    }
</script>
