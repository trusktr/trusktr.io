import React from 'react'
import ReactDOM from 'react-dom'
import sleep from 'awaitbox/timers/sleep'
import startup from 'awaitbox/meteor/startup'
import {MotorHTMLNode, MotorHTMLScene} from 'infamous/motor-html'

import 'document-register-element'

export default
async function testShadowDomUsage() {

    //document.registerElement('motor-node', MotorHTMLNode)
    //document.registerElement('motor-scene', MotorHTMLScene)

    await startup()

    ReactDOM.render(
        <motor-scene id="scene">
            <motor-node id="distributedNode"
                absoluteSize="100,100,0"
                proportionalSize="1,1,1"
                style={{border: '1px solid teal'}}
                >
            </motor-node>
        </motor-scene>,
        document.querySelector('#app-root')
    )

    await sleep(1000)

    const scene = document.querySelector('#scene')
    const root = scene.createShadowRoot()

    const innerNode = document.createElement('motor-node')
    innerNode.style.outline = '1px solid red'
    // root.innerHTML = `
    //     <motor-node id="innerNode">
    //         <content></content>
    //     </motor-node>
    // `
    root.appendChild(innerNode)
    innerNode.appendChild(document.createElement('content'))

    console.log(root)

    await sleep(1000)
    innerNode.setAttribute('absolutesize', '400, 400, 0')

    // The teal node X-size should become relative to the red node, no longer
    // relative to the the scene.
    await sleep(1000)
    const distributedNode = document.querySelector('#distributedNode')
    distributedNode.sizeMode.x = 'proportional'
}
