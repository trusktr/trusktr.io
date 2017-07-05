import {Motor} from 'infamous/core'
import forLength from 'army-knife/forLength'

function forLengthCreate(n, fn) {
    const result = []
    forLength(n, i => result.push(fn(i)))
    return result
}

//styles
import jss from './lib/jss-configured'
import reset from './common/styles/reset'

// test that re-rendering a whole scene by setting innerHTML over and over works, for a whole
// scene. We're just testing that there are no errors.
export default
function testHtmlRerendering() {

    const style = {
        triangle: {
            transformOrigin: '0px 0px 0px !important',

            '& > div': {
                width: 0,
                height: 0,
                borderTop: '50px solid transparent',
                borderBottom: '50px solid transparent',
                borderLeft: '100px solid teal',
            },
        },
        scene: {
            perspective: '800px!important',
        },
    }

    Meteor.startup(triangles)
    async function triangles() {

        // TODO: Consolidate all the entry points into one, and code the
        // style reset only once.
        jss.createStyleSheet(reset).attach()
        const {classes} = jss.createStyleSheet(style).attach()

        let root = document.querySelector('#app-root')

        const triangleBase = 100

        let angle = - Math.atan((triangleBase/2) / triangleBase)
        angle = angle / Math.PI * 180

        let triangleRotation = 0

        function markup() {
            return (`
                <motor-scene class="${classes.scene}">
                    <motor-node rotation="0, 0, ${angle}">

                        ${forLengthCreate(12, i => (`
                            ${forLengthCreate(8, n => (`
                                <motor-node
                                    class="${classes.triangle}"
                                    align="0,0"
                                    mountPoint="0,0"
                                    absoluteSize="100,100"
                                    position="${i*100}, ${n*100 + i*50}"
                                    rotation="0, ${triangleRotation}, 0"
                                >

                                    <div></div>

                                </motor-node>
                            `)).join('')}
                        `)).join('')}

                    </motor-node>

                </motor-scene>
            `)
        }

        // This works, rendering just once then imperatively applying animation.
        //root.innerHTML = markup()
        //await Promise.resolve() // wait for custom element upgrade
        //const triangles = document.querySelectorAll('.'+classes.triangle)
        //Motor.addRenderTask(() => {
            //triangleRotation -= 1.5
            ////if (triangleRotation < -360) return false
            //triangles.forEach(t => t.rotation.y = triangleRotation)
        //})

        // But this one is (hopefully *was* by the time you read this) throwing an error.
        Motor.addRenderTask(() => {
            triangleRotation -= 1.5
            if (triangleRotation < -180) {
                return false
                console.log('success')
            }
            root.innerHTML = markup()
        })
    }

    let testError = null

    window.addEventListener('error', (...args) => {
        testError = args
    })

    setTimeout(() => {
        console.assert(!testError)
    }, 1000)
}
