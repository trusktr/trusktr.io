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
                    ref='node1'
                    id='node1'
                    absoluteSize='100, 100'
                    //rotation='30, 30, 30'
                    //align='0.5, 0.5'
                    //mountPoint='0.5, 0.5'
                >
                    {this.positions.map((pos, index) => (
                        <motor-node
                            ref='node2'
                            id='node2'
                            key={index}
                            absoluteSize='10, 10'
                            //rotation={`${index*30} ${index*20} ${index*10}`}
                            //align='0.5, 0.5'
                            //mountPoint='0.5, 0.5'
                            position={`${pos.x} ${pos.y} ${pos.z}`}
                        >
                        </motor-node>
                    ))}
                </motor-node>
            </motor-scene>
        )
    }

    async componentDidMount() {
        const {node1} = this.refs
        await node1.mountPromise
        node1.rotation.y = -90
        Motor.addRenderTask(time => {
            node1.rotation.x += 5
            node1.rotation.y += 10
            node1.rotation.z += 5
        })
    }
}
