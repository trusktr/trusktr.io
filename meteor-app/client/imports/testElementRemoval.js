import HTMLNode from 'infamous/html/HTMLNode'
import HTMLScene from 'infamous/html/HTMLScene'
import Scene from 'infamous/core/Scene'
import startup from 'awaitbox/meteor/startup'
import sleep from 'awaitbox/timers/sleep'

export default
async function testElementRemoval() {

    // case1()
    case2()
    // case3()
    // case4()
    // case5()
    // case6()
    // case7()

    // case 1, append new node to new scene (works)
    async function case1() {
        await startup()
        const scene = new HTMLScene
        scene.id = 'myScene'
        const node = new HTMLNode
        node.id = "myNode"
        scene.appendChild(node)
        document.querySelector('#app-root').appendChild(scene)
    }

    // case 2, remove old node from old scene (works)
    async function case2() {
        await startup()
        const scene = new HTMLScene
        scene.id = 'myScene'
        const node = new HTMLNode
        node.id = "myNode"
        scene.appendChild(node)
        document.querySelector('#app-root').appendChild(scene)

        await sleep(500)
        scene.removeChild(node)

        // WebComponent#deinit is called in following tick, so _scene should still exist.
        console.log('true:', node.imperativeCounterpart._scene instanceof Scene)

        // WebComponent#deinit is called in a following tick, so await
        await sleep(500)

        console.log('true:', node.imperativeCounterpart._scene === null)
    }

    // case 3, append old node to a new scene that is immediately mounted (works)
    async function case3() {
        await startup()
        const scene = new HTMLScene
        scene.id = 'myScene'
        const node = new HTMLNode
        node.id = "myNode"
        scene.appendChild(node)
        document.querySelector('#app-root').appendChild(scene)

        await sleep(500)
        scene.removeChild(node)

        await sleep(500)
        console.log('true:', node.imperativeCounterpart._scene === null)

        await sleep(500)
        const scene2 = new HTMLScene
        document.querySelector('#app-root').appendChild(scene2)
        scene2.appendChild(node)
        // WebComponent#init is called sync in the same tick, so,
        console.log('true:', node.imperativeCounterpart._scene instanceof Scene)
    }

    // case 4, append node to a new non-mounted scene (broken).
    // Is the same code as case3 but with one line disabled so scene2 is never appended into DOM.
    // Results in: Uncaught TypeError: Cannot read property 'addChild' of null
    async function case4() {
        await startup()
        const scene = new HTMLScene
        scene.id = 'myScene'
        const node = new HTMLNode
        node.id = "myNode"
        scene.appendChild(node)
        document.querySelector('#app-root').appendChild(scene)

        await sleep(500)
        scene.removeChild(node)

        await sleep(500)
        console.log('true:', node.imperativeCounterpart._scene === null)

        await sleep(500)
        const scene2 = new HTMLScene
        // document.querySelector('#app-root').appendChild(scene2)
        scene2.appendChild(node)
        // WebComponent#init is called sync in the same tick, so,
        console.log('true:', node.imperativeCounterpart._scene === null) // because scene isn't mounted.
    }

    // case 5, remove node from second non-mounted scene then append node to a new mounted scene (broken)
    // Same code as case 4, but then move node to a new mounted scene.
    // Results in the same error, plus a new error due to trying to move the node after the first error.
    // Will probably work after fixing case 4.
    async function case5() {
        await startup()
        const scene = new HTMLScene
        scene.id = 'myScene'
        const node = new HTMLNode
        node.id = "myNode"
        scene.appendChild(node)
        document.querySelector('#app-root').appendChild(scene)

        await sleep(500)
        scene.removeChild(node)

        await sleep(500)
        console.log('true:', node.imperativeCounterpart._scene === null)

        await sleep(500)
        const scene2 = new HTMLScene
        // document.querySelector('#app-root').appendChild(scene2)
        scene2.appendChild(node)
        // WebComponent#init is called sync in the same tick, so,
        console.log('true:', node.imperativeCounterpart._scene === null) // because scene isn't mounted.

        await sleep(500)
        scene2.removeChild(node)
        const scene3 = new HTMLScene
        scene3.appendChild(node)
        document.querySelector('#app-root').appendChild(scene3) // without this line, it throws an error in a following tick, but should not, and this line can be called in the future.
    }

    // case 6, remove node from second mounted scene then append node to a third new mounted scene after async delay (works)
    async function case6() {
        await startup()
        const scene = new HTMLScene
        scene.id = 'myScene'
        const node = new HTMLNode
        node.id = "myNode"
        scene.appendChild(node)
        document.querySelector('#app-root').appendChild(scene)

        await sleep(500)
        scene.removeChild(node)

        await sleep(500)
        console.log('true:', node.imperativeCounterpart._scene === null)

        await sleep(500)
        const scene2 = new HTMLScene
        document.querySelector('#app-root').appendChild(scene2)
        scene2.appendChild(node)
        // WebComponent#init is called sync in the same tick, so,
        console.log('true:', node.imperativeCounterpart._scene instanceof Scene)

        await sleep(500)
        scene2.removeChild(node)

        await sleep(500)
        console.log('true:', node.imperativeCounterpart._scene === null)
        const scene3 = new HTMLScene
        document.querySelector('#app-root').appendChild(scene3)
        scene3.appendChild(node)
        // WebComponent#init is called sync in the same tick, so,
        console.log('true:', node.imperativeCounterpart._scene instanceof Scene)
    }

    // case 7, remove node from second mounted scene then append node to a third new mounted scene without async delay (works)
    // same as case 6 except without delay before adding to third scene.
    // Causes infinite loop.
    async function case7() {
        await startup()
        const scene = new HTMLScene
        scene.id = 'myScene'
        const node = new HTMLNode
        node.id = "myNode"
        scene.appendChild(node)
        document.querySelector('#app-root').appendChild(scene)

        await sleep(500)
        scene.removeChild(node)

        await sleep(500)
        console.log('true:', node.imperativeCounterpart._scene === null)

        await sleep(500)
        const scene2 = new HTMLScene
        document.querySelector('#app-root').appendChild(scene2)
        scene2.appendChild(node)
        // WebComponent#init is called sync in the same tick, so,
        console.log('true:', node.imperativeCounterpart._scene instanceof Scene)

        await sleep(500)
        scene2.removeChild(node)

        // await sleep(500) // This is the only difference between case 6 and case 7.
        console.log('true:', node.imperativeCounterpart._scene === null)
        const scene3 = new HTMLScene
        document.querySelector('#app-root').appendChild(scene3)
        scene3.appendChild(node)
        // WebComponent#init is called sync in the same tick, so,
        console.log('true:', node.imperativeCounterpart._scene instanceof Scene)
    }
}
