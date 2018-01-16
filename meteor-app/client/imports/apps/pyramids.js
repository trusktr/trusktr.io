import * as React from 'react'

import Motor from 'infamous/core/Motor'
import 'infamous/html'

export default
class App extends React.Component {

    render() {
        return (
            <i-scene
                ref="scene"
                webglenabled="true"
                background="0 0 0 1"
            >
                <i-node
                    ref='outer'
                    id='outer'
                    //absoluteSize='100, 100'
                    sizeMode='proportional proportional'
                    proportionalSize='1 1'
                >

                    <i-node
                        ref='ground'

                        sizeMode='proportional proportional'
                        proportionalSize='1 1'
                        mountPoint='0.5 0.5'
                        color="1 1 1"
                        mesh="quad"

                        //absoluteSize='50'
                        //mountPoint='0.5 0.5'
                        //position='0 -100 0'
                        //color="0.8 0.2 0.2"
                        //mesh="cube"
                    >

                        <i-node
                            ref="cube"
                            id="cube"
                            color="1 1 1"

                            absoluteSize='100'
                            align='0.5 0.1'
                            position='57 75 -58'
                            rotation="46 34 73"
                            mesh="cube"

                            //absoluteSize='100 100'
                            //mesh="pyramid4"
                        >
                        </i-node>

                    </i-node>

                </i-node>
            </i-scene>
        )
    }

    async componentDidMount() {
        const {ground, cube} = this.refs
        await ground.mountPromise

        const cubeNode = cube
        let vertPos = null

        //ground.rotation.y = -45
        Motor.addRenderTask(() => {
            ground.rotation.y = ground.rotation.y
            //ground.rotation.y += 1
            //ground.rotation.y += 0.1

            if (cubeNode.__shape) {
                if (!vertPos) {
                    vertPos = [
                        cubeNode.__shape.verts[6+0],
                        cubeNode.__shape.verts[6+1],
                        cubeNode.__shape.verts[6+2],
                    ]

                    vertPos[0] += 30
                    vertPos[1] += 30
                    vertPos[2] += 30
                }

                cubeNode.__shape.verts[6+0] = vertPos[0]
                cubeNode.__shape.verts[6+1] = vertPos[1]
                cubeNode.__shape.verts[6+2] = vertPos[2]

                cubeNode.__shape.verts[9+0] = vertPos[0]
                cubeNode.__shape.verts[9+1] = vertPos[1]
                cubeNode.__shape.verts[9+2] = vertPos[2]

                cubeNode.__shape.verts[48+0] = vertPos[0]
                cubeNode.__shape.verts[48+1] = vertPos[1]
                cubeNode.__shape.verts[48+2] = vertPos[2]

                cubeNode.__shape.verts[102+0] = vertPos[0]
                cubeNode.__shape.verts[102+1] = vertPos[1]
                cubeNode.__shape.verts[102+2] = vertPos[2]
            }
        })
    }
}
