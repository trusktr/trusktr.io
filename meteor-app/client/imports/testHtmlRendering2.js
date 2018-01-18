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

// test that re-rendering a sub-scene by setting innerHTML over and over works, for a whole
// scene. We're just testing that there are no errors.
export default
function testHtmlRerendering2() {

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

    async function trianglesDom() {

        // TODO: Consolidate all the entry points into one, and code the
        // style reset only once.
        jss.createStyleSheet(reset).attach()
        const {classes} = jss.createStyleSheet(style).attach()

        const triangleBase = 100

        let angle = - Math.atan((triangleBase/2) / triangleBase)
        angle = angle / Math.PI * 180

        let triangleRotation = 0

        const appRoot = document.querySelector('#app-root')

        appRoot.innerHTML = (`
            <i-scene class="${classes.scene}">
            </i-scene>
        `)

        const scene = appRoot.querySelector('i-scene')

        function markup() {
            return (`
                <i-node rotation="0, 0, ${angle}">

                    ${forLengthCreate(12, i => (`
                        ${forLengthCreate(8, n => (`
                            <i-node
                                class="${classes.triangle}"
                                align="0,0"
                                mountPoint="0,0"
                                size="100,100"
                                position="${i*100}, ${n*100 + i*50}"
                                rotation="0, ${triangleRotation}, 0"
                            >

                                <div></div>

                            </i-node>
                        `)).join('')}
                    `)).join('')}

                </i-node>
            `)
        }

        // works
        scene.innerHTML = markup()
        await Promise.resolve() // wait for custom element upgrade
        const triangles = document.querySelectorAll('.'+classes.triangle)
        Motor.addRenderTask(() => {
            triangleRotation -= 1.5
            //if (triangleRotation < -360) return false
            triangles.forEach(t => t.rotation.y = triangleRotation)
        })

        // doesn't work.
        //Motor.addRenderTask(() => {
            //triangleRotation -= 1.5
            ////if (triangleRotation < -360) return false
            //scene.innerHTML = markup()
        //})

        // doesn't work.
        //requestAnimationFrame(function loop() {
            //triangleRotation -= 1.5
            ////if (triangleRotation < -360) return false
            //scene.innerHTML = markup()
            //requestAnimationFrame(loop)
        //})
    }
}
