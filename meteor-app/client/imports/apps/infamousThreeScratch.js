import * as React from 'react'

import Motor from 'infamous/core/Motor'
window.Motor = Motor
import 'infamous/html'

export default
class App extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div style={{width:'100%', height:'100%'}}>
                <i-scene
                    ref="scene"
                    experimental-webgl="true"
                    background="0.4 0.3 0.5 0.2"
                >
                    <i-node
                        ref='outerRoot'
                        id='outerRoot'
                        size='100, 100'
                    >
                        <i-node
                            ref='innerRoot'
                            id='innerRoot'
                            size='200, 200'
                            mesh='quad'
                            color='0.5 0.5 0.5 1'
                        >
                        </i-node>
                    </i-node>
                </i-scene>
            </div>
        )
    }

    async componentDidMount() {
        const {innerRoot} = this.refs

        await innerRoot.mountPromise

        //Motor.addRenderTask(time => {
            //innerRoot.rotation.y += 1
        //})
    }
}
