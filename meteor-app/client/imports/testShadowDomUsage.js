import React from 'react'
import ReactDOM from 'react-dom'
import sleep from 'awaitbox/timers/sleep'
import startup from 'awaitbox/meteor/startup'
import {useDefaultNames} from 'infamous/html'

useDefaultNames()

import 'document-register-element'

export default
async function testShadowDomUsage() {

    //document.registerElement('i-node', MotorHTMLNode)
    //document.registerElement('i-scene', MotorHTMLScene)

    await startup()

    ReactDOM.render(
        <i-scene id="scene">
            <i-node id="distributedNode"
                size="100,100,0"
                style={{border: '1px solid teal'}}
                >
            </i-node>
        </i-scene>,
        document.querySelector('#app-root')
    )

    await sleep(1000)

    const scene = document.querySelector('#scene')
    const root = scene.createShadowRoot()

    const innerNode = document.createElement('i-node')
    innerNode.style.outline = '1px solid red'
    // root.innerHTML = `
    //     <i-node id="innerNode">
    //         <content></content>
    //     </i-node>
    // `
    root.appendChild(innerNode)
    innerNode.appendChild(document.createElement('content'))

    console.log(root)

    await sleep(1000)
    innerNode.setAttribute('size', '400, 400, 0')

    // The teal node X-size should become relative to the red node, no longer
    // relative to the the scene.
    await sleep(1000)
    const distributedNode = document.querySelector('#distributedNode')
    distributedNode.sizeMode.x = 'proportional'
    distributedNode.size.x = 1
}
