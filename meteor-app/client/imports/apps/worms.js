import * as React from 'react'
import TWEEN from 'tween.js'

import Motor from 'infamous/core/Motor'
window.Motor = Motor
import 'infamous/html'

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
        this.sheet = null

        //const shape = geometry.sphere({ radius: 130 })
        const shape = geometry.cube({ radius: 70 })

        const spherePolys = shape.toPolygons()

        //const positions = spherePolys.map(poly => poly.vertices[Math.round(poly.vertices.length/2)].pos)
        this.positions = spherePolys.reduce((output, poly) => output.concat(poly.vertices.map(v => v.pos)), [])
    }

    render() {
        let items = [0,1,2]

        this.dancers = []

        function createWorm({numberOfSections, directions, offset, color, mesh}) {
            numberOfSections = numberOfSections || 5
            directions = directions || {x:1, y:1, z:1}
            offset = offset || 5
            color = color || '0.5, 0.5, 0.5'
            mesh = mesh || 'cube'

            const sections = []

            const collectSectionsThenAnimate = el => {
                if (!el) return

                sections.push(el)

                if (sections.length === numberOfSections) {
                    const angle = {w:0}
                    let done = false
                    const tween = new TWEEN.Tween(angle)
                        .to({w:360}, 8000)
                        .easing(TWEEN.Easing.Exponential.InOut)
                        .onComplete(() => done = true)
                        .repeat(Infinity)
                        .start()

                    Motor.addRenderTask(time => {
                        tween.update(time)
                        if (done) return false

                        for (const section of sections) {
                            section.rotation.x = angle.w
                            section.rotation.y = angle.w
                            section.rotation.z = angle.w
                        }
                    })
                }
            }

            function _createWorm(section) {
                const {x,y,z} = directions

                return (
                    <motor-node
                        ref={collectSectionsThenAnimate}
                        color={color}
                        mesh={mesh}
                        position={`${offset*x} ${offset*y} ${offset*z}`}
                    >
                        {section+1 < numberOfSections ?
                            _createWorm(section+1)
                        :[]}
                    </motor-node>
                )
            }

            return _createWorm(0)
        }

        return (
            <div style={{width:'100%', height:'100%'}}>
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
                    <motor-scene
                        ref="scene"
                        webglenabled="true"
                        background="0.4 0.3 0.5 0.2"
                    >
                        <motor-node
                            ref='outerRoot'
                            id='outerRoot'
                            absoluteSize='100, 100'
                        >

                            <motor-node
                                ref='innerRoot'
                                id='innerRoot'
                                absoluteSize='100, 100'
                            >
                                {items.map(i => (
                                    <motor-node
                                        ref={el => this.dancers.push(el)}
                                        class='dancer'
                                        id={`dancer${i}`}
                                        absoluteSize='100, 100'
                                        position={`${i*300} 0 0`}
                                        color="0.1 0.9 0.5"
                                        mesh='cube'
                                    >
                                        {/*//////////////////////////////////////////////////////////////////////////////////*/}
                                        {createWorm({directions: {x:1,  y:1,  z:1 }, color: '0.2, 0.2, 0.9'})}
                                        {createWorm({directions: {x:-1, y:1,  z:1 }, color: '0.2, 0.2, 0.9'})}
                                        {createWorm({directions: {x:1,  y:-1, z:1 }, color: '0.2, 0.2, 0.9'})}
                                        {createWorm({directions: {x:-1, y:-1, z:1 }, color: '0.2, 0.2, 0.9'})}
                                        {createWorm({directions: {x:1,  y:1,  z:-1}, color: '0.2, 0.2, 0.9'})}
                                        {createWorm({directions: {x:-1, y:1,  z:-1}, color: '0.2, 0.2, 0.9'})}
                                        {createWorm({directions: {x:1,  y:-1, z:-1}, color: '0.2, 0.2, 0.9'})}
                                        {createWorm({directions: {x:-1, y:-1, z:-1}, color: '0.2, 0.2, 0.9'})}

                                        {this.positions.map((pos, index) => (
                                            <motor-node
                                                class='cube'
                                                id={`cube${index}`}
                                                key={index}
                                                absoluteSize='10, 10'
                                                position={`${pos.x} ${pos.y} ${pos.z}`}
                                                //color="0.2 0.4 0.9"
                                                mesh='cube'
                                            >

                                            </motor-node>
                                        ))}
                                    </motor-node>
                                ))}
                            </motor-node>
                        </motor-node>
                    </motor-scene>
                </div>
            </div>
        )
    }

    async componentDidMount() {
        let deviceOrientation = { x: 0, y: 0, z: 0, }
        const broadcast = new Meteor.Broadcast('orientation')
        broadcast.on('data', data => {
            console.log('data')
            deviceOrientation = data
        })
        broadcast.on('error', e => {throw e})
        broadcast.on('ready', () => console.log('broadcast client ready'))

        const {dancers} = this
        const {innerRoot} = this.refs

        await dancers[0].mountPromise
        //dancers.rotation.y = -90
        Motor.addRenderTask(time => {
            let index = 0
            for (const dancer of dancers) {
                dancer.position.x = 100 * Math.sin(time*0.001) + 300*index++

                //dancer.rotation.x += 5
                //dancer.rotation.y += 10
                //dancer.rotation.z += 5

                //dancer.rotation.x += 3
                //dancer.rotation.y += 6
                //dancer.rotation.z += 3

                dancer.rotation.x += 1
                dancer.rotation.y += 2
                dancer.rotation.z += 1

                const backAndForth = deviceOrientation.x
                dancer.position.z = 100 * Math.sin(time * 0.005 + index*0.8) - backAndForth
                //dancer.position.z = backAndForth
            }

            let offset = (300*(index-1)) / 2
            innerRoot.position.x = -offset
        })
    }
}
