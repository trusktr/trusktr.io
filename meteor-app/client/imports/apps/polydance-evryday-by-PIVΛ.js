/*

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

*/

// pointer events polyfill
import 'pepjs'

import * as React from 'react'
import TWEEN from 'tween.js'
import color from 'tinycolor2'
import Motor from 'infamous/core/Motor'
import 'infamous/html'
import sleep from 'awaitbox/timers/sleep'

if (!window.AudioContext && window.webkitAudioContext) window.AudioContext = window.webkitAudioContext

const colors = {
	skyblue: color('#1a95d9'),
	hotpink: color('#d11482'),
	limegreen: color('#90e818'),
	yellow: color('#fdb833'),
	teal: color('#28c9f6'),
}

export default class App extends React.Component {
	constructor(props) {
		super(props)

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

		this.innerTriangleSizes = _.range(4, 14, 2)

		const spacing = 4
		this.circle2triangleRadii = [
			this.circle2InnerRadius,
			this.circle2InnerRadius + spacing * 1 + 4,
			this.circle2InnerRadius + spacing * 2 + 4 + 6,
			this.circle2InnerRadius + spacing * 3 + 4 + 6 + 8,
			this.circle2InnerRadius + spacing * 4 + 4 + 6 + 8 + 10,
		]

		const individualQuadFlipRotations = []

		this.startAudio()

		this.state = {
			ready: false, // nothing will render until this is true
			triangleColumnAnimParam: 0,
			individualQuadFlipRotations,
			outerTrapezoidRingZPos: 50,
			innerQuadRingZPos: -50,
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

		let {skyblue, hotpink, teal, limegreen, yellow} = colors

		this.calcTriangleRingPositions()

		///////////// AUDIO
		const circle1TrapezoidAudioDatum = mapAudioDataToFewerUnits(audioDataArray, this.circle1Range.length)
		const circle3QuadAudioDatum = mapAudioDataToFewerUnits(audioDataArray, this.circle3Range.length)
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

		const circle1Colors = discreteGradient(this.circle1Range.length, hotpink, skyblue, hotpink)
		const circle2Colors = discreteGradient(this.circle2Range.length, skyblue, hotpink, yellow, hotpink, skyblue)
		const circle3Colors = discreteGradient(this.circle3Range.length, teal, limegreen, yellow, limegreen, teal)
		const circle4Colors = discreteGradient(this.circle4Range.length, teal, limegreen, yellow, limegreen, teal)

		////////////////

		return (
			<div
				ref="container"
				style={{
					visibility: this.state.ready ? 'visible' : 'hidden',
					width: '100%',
					height: '100%',
					position: 'relative',
				}}
			>
				<div
					className="rotation"
					style={{
						position: 'absolute',
						top: '0',
						left: '0',
						width: '100%',
						height: '100%',
						zIndex: '1',
					}}
				>
					<i-scene
						ref="scene"
						webglenabled="true"
						background={`${colorToString(hotpink.clone().darken(38))} 1`}
					>
						<i-node ref="outer" id="outer" sizeMode="proportional proportional" size="1 1">
							<i-node ref="circleRoot" position="0 0 -50">
								{/* outer tiny triangle ring */}
								<i-node
									ref="outerTinyTriangles"
									position={`0 0 ${outerTrapezoidRingZPos}`}
									rotation="0 0 90"
								>
									{this.circle1Range.map(n => (
										<i-node key={n} rotation={`0 0 ${(n * 360) / 48 + 360 / 48 / 2}`}>
											<i-node
												color={colorToString(limegreen)}
												mesh="isotriangle"
												size="4.6 4.6"
												//position={`0 ${this.circle1Radius + 25} 0`}
												position={`0 ${this.circle1Radius + 25} ${1 *
													((circle1TrapezoidAudioDatum[n] - 1) * 120 + 1)}`}
												rotation="0 0 180"
											/>
										</i-node>
									))}
								</i-node>

								{/*trapezoids*/}
								<i-node
									ref="circle1"
									position={`0 0 ${outerTrapezoidRingZPos}`}
									//position={`0 0 ${outerTrapezoidRingZPosWithVibration}`}
									rotation="0 0 90"
								>
									{this.circle1Range.map(n => (
										<i-node key={n} rotation={`0 0 ${(n * 360) / 48}`}>
											<i-node rotation={`0 ${individualQuadFlipRotations[n]} 0`}>
												<i-node
													color={colorToString(circle1Colors[n])}
													//color={colorToString(hotpink)}
													mesh="symtrap"
													//size='10 16'
													size={`10 ${16 * ((circle1TrapezoidAudioDatum[n] - 1) * 5 + 1)}`}
													position={`0 ${this.circle1Radius} 0`}
													rotation="60 0 0"
												/>
											</i-node>
										</i-node>
									))}
								</i-node>

								{/* inner tiny triangle ring */}
								<i-node
									ref="innerTinyTriangles"
									position={`0 0 ${outerTrapezoidRingZPos}`}
									rotation="0 0 90"
								>
									{this.circle2Range.map(n => (
										<i-node key={n} rotation={`0 0 ${(n * 360) / 24 + 360 / 24 / 2}`}>
											<i-node
												color={colorToString(limegreen.clone().setAlpha(1))}
												mesh="isotriangle"
												size="4.6 4.6"
												//position={`0 ${this.circle1Radius + -10} 0`}
												position={`0 ${this.circle1Radius + -10} ${1 *
													((circle3QuadAudioDatum[n] - 1) * 60 + 1)}`}
											/>
										</i-node>
									))}
								</i-node>

								{/*triangle rings*/}
								{this.circle2TriangleRings.map(t => {
									const triangleRotation = columnTriangleRotation(t, triangleColumnAnimParam) + 60
									return (
										<i-node key={t} position={`0 0 ${triangleRingPositions[t]}`} rotation="0 0 90">
											{this.circle2Range.map(n => (
												<i-node key={n} rotation={`0 0 ${(n * 360) / 24}`}>
													<i-node
														rotation={`${triangleRotation} 0 0`}
														//rotation='60 0 0'
														position={`0 ${this.circle2triangleRadii[t]} 0`}
														//position={`0 ${this.circle2triangleRadii[t]} ${Math.abs(4 * ((circle3QuadAudioDatum[n]-1) * 5 + 1))}`}
														size={`${this.innerTriangleSizes[t]} ${this.innerTriangleSizes[
															t
														] * 1.1} 0`}
														mesh="isotriangle"
														color={colorToString(circle2Colors[n])}
														//color={colorToString(skyblue)}
													/>
												</i-node>
											))}
										</i-node>
									)
								})}

								{/*little quads*/}
								<i-node ref="circle3" position={`0 0 ${innerQuadRingZPos}`} rotation="0 0 90">
									{this.circle3Range.map(n => (
										<i-node key={n} rotation={`0 0 ${(n * 360) / 24}`}>
											<i-node
												mesh="quad"
												position={`0 ${this.circle3Radius} 0`}
												//size='6 4'
												size={`6 ${4 * ((circle3QuadAudioDatum[n] - 1) * 5 + 1)}`}
												color={colorToString(circle3Colors[n])}
												//color={colorToString(yellow)}
											/>
										</i-node>
									))}
								</i-node>

								{/* inner triangles*/}
								<i-node ref="circle4" rotation="0 0 -90" position={`0 0 ${innerQuadRingZPos}`}>
									{this.circle4Range.map(n => (
										<i-node key={n} rotation={`0 0 ${(n * 360) / 12}`}>
											<i-node
												mesh="isotriangle"
												size="5 5"
												position={`0 ${this.circle4Radius} 0`}
												color={colorToString(circle4Colors[n])}
												//color={colorToString(teal)}
											/>
										</i-node>
									))}
								</i-node>
							</i-node>
						</i-node>
					</i-scene>
				</div>
			</div>
		)
	}

	calcTriangleRingPositions() {
		const {triangleRingPositions, innerQuadRingZPos, outerTrapezoidRingZPos} = this.state
		const zInterval = (outerTrapezoidRingZPos - innerQuadRingZPos) / 5
		let n = 5
		while (n--) triangleRingPositions[n] = innerQuadRingZPos + zInterval / 2 + n * zInterval
	}

	async componentDidMount() {
		await sleep(1000)
		this.showVisual()
	}

	async showVisual() {
		const {individualQuadFlipRotations, audioDataArray} = this.state

		const {container, circleRoot, outerTinyTriangles, innerTinyTriangles} = this.refs

		let deviceOrientation1 = {x: 0, y: 0, z: 0}
		let deviceOrientation2 = {x: 0, y: 0, z: 0}
		let deviceOrientation3 = {x: 0, y: 0, z: 0}
		//this.receiveBroadcastOrientations(deviceOrientation1, deviceOrientation2, deviceOrientation3)

		let mouseXRatio = 0
		let mouseYRatio = 0
		container.setAttribute('touch-action', 'none') // polyfill
		container.style['touch-events'] = 'none' // native
		container.addEventListener('mousemove', e => {})
		container.addEventListener('pointermove', e => {
			e.preventDefault() // just in case
			mouseXRatio = e.clientX / window.innerWidth
			mouseYRatio = e.clientY / window.innerHeight
		})

		await circleRoot.mountPromise

		const triangleColumnTween = new TWEEN.Tween(this.state)
		triangleColumnTween.__done = false
		triangleColumnTween.__started = false
		triangleColumnTween
			.to({triangleColumnAnimParam: 1}, 2000)
			//.to({p:-1}, 2000)
			.easing(TWEEN.Easing.Cubic.InOut)
			.onComplete(() => (triangleColumnTween.__done = true))
			.onStart(() => (triangleColumnTween.__started = true))
			.repeat(Infinity)
			.yoyo(true) // how?
			.start()
			.update(performance.now()) // actually starts it.

		Motor.addRenderTask(time => {
			//circleRoot.rotation.y = 30 * Math.sin(time * 0.001)
			//circleRoot.rotation.y += 1
			//circleRoot.rotation.x = deviceOrientation1.x % 90
			//* (45/90) // limit to +/-45 degrees
			//circleRoot.rotation.y = deviceOrientation1.y
			//* (45/90) // limit to +/-45 degrees
			circleRoot.rotation.x = mouseYRatio * 60 - 30
			circleRoot.rotation.y = mouseXRatio * 60 - 30

			//this.state.color1AnimParam = deviceOrientation2.z / 360
			this.state.color1AnimParam = mouseXRatio

			//this.state.outerTrapezoidRingZPos = deviceOrientation3.y
			//this.state.innerQuadRingZPos = -deviceOrientation3.y
			this.state.outerTrapezoidRingZPos = mouseYRatio * 90 - 45
			this.state.innerQuadRingZPos = -mouseYRatio * 90 - 45

			//outerTinyTriangles.rotation.x += 2
			//innerTinyTriangles.rotation.y -= 2

			///////////// AUDIO
			this.audioAnalyser.getByteTimeDomainData(audioDataArray)
			/////////////

			if (triangleColumnTween.__started && !triangleColumnTween.__done) triangleColumnTween.update(time)

			if (!this.state.ready) this.state.ready = true
			this.forceUpdate()
		})
	}

	startAudio() {
		///////////////////////////////// AUDIO
		const audio = new AudioContext()

		// make audio source node
		const audioElement = document.createElement('audio')
		audioElement.setAttribute('src', '/mp3/evryday-piva.mp3')
		audioElement.setAttribute('autoplay', 'true')
		document.body.appendChild(audioElement)
		const source = audio.createMediaElementSource(audioElement)

		// create an analyser node to analize the data, and connect source to
		// it. We don't need to output to the AudioContext destination node,
		// since it is already playing from the audio element.
		this.audioAnalyser = audio.createAnalyser()
		this.audioAnalyser.fftSize = 2048 // default 2048
		this.audioBufferLength = this.audioAnalyser.frequencyBinCount
		//this.audioBufferLength = this.audioAnalyser.fftSize;
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
		streamer.on('error', e => {
			throw e
		})
		streamer.on('ready', () => console.log('streamer client ready'))

		streamer.on('orientation2', data => {
			Object.assign(deviceOrientation2, data)
		})
		streamer.on('error', e => {
			throw e
		})
		streamer.on('ready', () => console.log('broadcast client ready'))

		streamer.on('orientation3', data => {
			Object.assign(deviceOrientation3, data)
		})
		streamer.on('error', e => {
			throw e
		})
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
	return `${color.r / 255} ${color.g / 255} ${color.b / 255} ${color.a}`
}

function columnTriangleRotation(index, animParam = 0, numItems = 5, startAngle = 0, endAngle = 360) {
	const interval = 1 / numItems
	const startPoint = interval * index
	const endPoint = startPoint + interval
	let angle = 0

	if (animParam >= startPoint && animParam < endPoint) {
		const intervalPortion = (animParam - startPoint) / interval
		angle = (endAngle - startAngle) * intervalPortion + startAngle
	} else if (animParam < startPoint) {
		angle = startAngle
	} else if (animParam >= endPoint) {
		angle = endAngle
	}

	return angle
}

function getUserAudio() {
	let resolve, reject
	const promise = new Promise((res, rej) => {
		resolve = res
		reject = rej
	})

	navigator.getUserMedia({audio: true}, stream => resolve(stream), err => reject(err))

	return promise
}

const {skyblue, hotpink, teal, yellow, limegreen} = colors

// XXX We can further improve perf by accepting an array to put values into.
// We can also cache the interval calculations of the conditional check in the
// inner loop.
function discreteGradient(n, ...colors) {
	const numberOfColors = colors.length
	const numberOfColorTransitions = numberOfColors - 1
	const interval = Math.floor(n / numberOfColorTransitions)
	const discreteColors = []

	// for each discrete color that we will have
	for (let i = 0; i < n; i += 1) {
		// see which color interval the the discrete color will fall in so we
		// know which two colors to mix with `.mix()`.
		for (let j = 0; j < numberOfColorTransitions; j += 1) {
			if (i >= j * interval && i < (j + 1) * interval) {
				discreteColors.push(
					// mix this color with the next color by a certain percent
					// based on the interval
					color.mix(colors[j], colors[j + 1], (100 / (interval - 1)) * (i % interval))
				)
			}
		}
	}

	return discreteColors
}

// Is mapAudioDataToFewerUnits a good name for this?
function mapAudioDataToFewerUnits(audioDataArray, numberOfUnits) {
	const newAudioDatum = []
	const audioDatumPerUnit = Math.floor(audioDataArray.length / numberOfUnits)

	// normalize. (based off MDN tutorials, I'm guessing 128 is the max size of the values?).
	for (let i = 0; i < numberOfUnits; i += 1) {
		let audioDatumSumForUnit = 0

		for (let j = i * audioDatumPerUnit, l2 = j + audioDatumPerUnit; j < l2; j += 1) {
			audioDatumSumForUnit += audioDataArray[j] / 128 / audioDatumPerUnit
		}

		newAudioDatum.push(audioDatumSumForUnit)
	}

	return newAudioDatum
}
