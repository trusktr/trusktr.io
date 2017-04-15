import {Scene} from 'infamous/motor'
import {MotorHTMLScene} from 'infamous/motor-html'
import startup from 'awaitbox/meteor/startup'

export default
async function testSceneCreation() {

    await startup()

    const appRoot = document.querySelector('#app-root')

    await test1()
    await test2()
    await test3()
    await test4()

    // test 1, Imperative Scene constructor, without mounting
    async function test1() {
        console.log(' test 1 --------------------------------------- ')
        appRoot.innerHTML = ''
        const scene = new Scene
        console.assert(scene.element.tagName == 'MOTOR-SCENE')
        console.assert(document.querySelector('motor-scene') === null)
        let promiseResolved = false
        setTimeout(() => {
            if (!promiseResolved) console.log('success')
            else throw new Error('The mount promise should not be resolved because we did not mount the scene yet.')
            setTimeout(() => scene.mount('#app-root'), 0)
        }, 0)
        console.assert(scene.mountPromise)
        await scene.mountPromise
        promiseResolved = true
        console.assert(document.querySelector('#app-root > motor-scene') instanceof MotorHTMLScene)
    }

    // test 2, Imperative Scene constructor, mounting
    async function test2() {
        console.log(' test 2 --------------------------------------- ')
        appRoot.innerHTML = ''
        const scene = new Scene
        console.assert(scene.element.tagName == 'MOTOR-SCENE')
        console.assert(document.querySelector('motor-scene') === null)
        let promiseResolved = false
        setTimeout(() => {
            if (!promiseResolved) throw new Error("The mount promise should be resolved because we mounted the scene.")
        }, 0)
        scene.mount('#app-root')
        console.assert(document.querySelector('#app-root > motor-scene') instanceof MotorHTMLScene)
        console.assert(scene.mountPromise)
        await scene.mountPromise
        promiseResolved = true
        console.assert(document.querySelector('#app-root > motor-scene') instanceof MotorHTMLScene)
    }

    // test 3, HTML markup
    async function test3() {
        console.log(' test 3 --------------------------------------- ')
        appRoot.innerHTML = ''
        appRoot.innerHTML = (`
            <motor-scene></motor-scene>
        `)

        // await, because it seems that the element may not be upgraded by the
        // browser during this tick.
        await Promise.resolve()

        const scene = document.querySelector('#app-root > motor-scene')
        console.assert(scene instanceof MotorHTMLScene)
        let promiseResolved = false
        setTimeout(() => {
            if (!promiseResolved) throw new Error("The mount promise should be resolved because we mounted the scene.")
        }, 0)
        console.assert(scene.mountPromise)
        await scene.mountPromise
        promiseResolved = true
        console.assert(document.querySelector('#app-root > motor-scene') instanceof MotorHTMLScene)
        console.assert(scene.imperativeCounterpart instanceof Scene)
    }

    // test 4, HTML constructor
    async function test4() {
        console.log(' test 4 --------------------------------------- ')
        appRoot.innerHTML = ''
        const scene = new MotorHTMLScene
        console.assert(scene.tagName == 'MOTOR-SCENE')
        appRoot.appendChild(scene)
        console.assert(document.querySelector('#app-root > motor-scene') instanceof MotorHTMLScene)
        let promiseResolved = false
        setTimeout(() => {
            if (!promiseResolved) throw new Error("The mount promise should be resolved because we mounted the scene.")
        }, 0)
        console.assert(scene.mountPromise)
        await scene.mountPromise
        promiseResolved = true
        console.assert(document.querySelector('#app-root > motor-scene') instanceof MotorHTMLScene)
        console.assert(scene.imperativeCounterpart instanceof Scene)
    }
}
