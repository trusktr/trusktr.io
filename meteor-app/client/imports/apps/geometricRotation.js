import * as React from 'react'

import Motor from 'infamous/motor/Motor'
import 'infamous/motor-html'

import geometry from 'csg'

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

        return (
            <motor-scene ref="scene" webglenabled="true">
                <motor-node
                    ref='outer'
                    id='outer'
                    absoluteSize='100, 100'
                >
                    <motor-node
                        ref='inner'
                        id='inner'
                        absoluteSize='100, 100'
                    >
                        {this.positions.map((pos, index) => (
                            <motor-node
                                ref='node2'
                                id='node2'
                                key={index}
                                absoluteSize='10, 10'
                                //rotation={`${index*30} ${index*20} ${index*10}`}
                                position={`${pos.x} ${pos.y} ${pos.z}`}
                                color='0.6, 0.2, 0.3'
                                mesh="cube"
                            >
                            </motor-node>
                        ))}
                    </motor-node>
                </motor-node>
            </motor-scene>
        )
    }

    async componentDidMount() {
        const {inner} = this.refs
        await inner.mountPromise
        inner.rotation.y = -90
        Motor.addRenderTask(time => {
            inner.rotation.x += 5
            inner.rotation.y += 10
            inner.rotation.z += 5
        })
    }
}
