import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { useDefaultNames } from 'infamous/html'
import Motor from 'infamous/core/Motor'
import {Tween, Easing} from 'tween.js'
import startup from 'awaitbox/meteor/startup'
import router from './routes'
import jss from "./lib/jss-configured"
import cssReset from './common/styles/reset'
import style, {menuColor} from './home.style'

console.log('web components during module load?', window.WebComponents, window.WebComponents && window.WebComponents.ready)

export default
async function home() {
    class StatusTween extends Tween {
        constructor(...args) {
            super(...args)

            this.started = false
            this.onStart(() => this.started = true)

            this.stopped = false
            this.onStop(() => this.stopped = true)

            this.completed = false
            this.onComplete(() => this.completed = true)
        }
    }

    jss.createStyleSheet(cssReset, {named: false}).attach()

    const {classes} = jss.createStyleSheet(style).attach()
    document.querySelector('html').classList.add(classes.html)

    function main() {

        class App extends React.Component {
            constructor() {
                super()
                this.menuIsClosing = false
                this.menuIsOpening = false
                this.menuPosition = 0
            }

            render() {
                return <i-scene ref="scene">

                    {/* BUG: if we remove this wrapper, then content always renders on top of the menu for some reason.
                        TODO: See if this has to do with the root context, and preserve-3d?
                        */}
                    <i-node id="layoutRootNode" ref="layoutRootNode" sizeMode="proportional, proportional, literal" size="1, 1, 0"
                        style={{
                            pointerEvents: 'none',
                            //background: '#F5DABD' // light tan
                        }}
                        >

                        <i-node id="menuNode" ref="menuNode"
                            sizeMode="literal, proportional, literal"
                            size="230, 1, 0"
                            position="-230, 0, 1"
                            style={{pointerEvents: 'auto'}}
                            >

                            <i-node id="invisibleGrip" ref="invisibleGrip"
                                sizeMode="literal, proportional, literal"
                                size="50, 1, 0"
                                position="225, 0, 0"
                                >
                            </i-node>

                            <i-node id="menuHint" ref="menuHint"
                                size="10, 20, 0"
                                align="1, 0.5, 0"
                                mountPoint="0, 0.5, 0"
                                >

                                <div className="triangle" style={{
                                    position: 'absolute',
                                    top: '-2px',
                                    width: 0,
                                    height: 0,
                                    borderTop: '12px solid transparent',
                                    borderBottom: '12px solid transparent',
                                    borderLeft: '12px solid #1DD326', //green
                                }}>
                                </div>

                                <div className="triangle" style={{
                                    position: 'absolute',
                                    width: 0,
                                    height: 0,
                                    borderTop: '10px solid transparent',
                                    borderBottom: '10px solid transparent',
                                    borderLeft: '10px solid '+menuColor,
                                }}>
                                </div>
                            </i-node>

                            <menu id="menu">
                                <li className="menuitem" style={{color: '#ccc'}}>Joe Pea</li><br />
                                {/*
                                <li className="sub menuitem">
                                    <a href="/hello">about me</a>
                                </li><br />
                                */}
                                <li className="sub menuitem">
                                    <a data-route="morphingSpiral" href="">Morphing ColorShape Spiral</a>
                                </li><br />
                                <li className="sub menuitem">
                                    <a data-route="shadowButtons" href="">HTML Buttons with Lighting</a>
                                </li><br />
                                <li className="sub menuitem">
                                    <a data-route="cubeWithLights" href="">Cube with Lights</a>
                                </li><br />
                                <li className="sub menuitem">
                                    <a data-route="polydance" href="">Polydance</a>
                                </li><br />
				{/* NEEDS UPDATE
                                <li className="sub menuitem frame">
                                    <a data-route="geometricRotation" href="">Geometric Rotation</a>
                                </li><br />
				*/}
				{/* NEEDS UPDATE
                                <li className="sub menuitem">
                                    <a data-route="rippleFlip" href="">Ripple Flip</a>
                                </li><br />
				*/}
                                <li className="sub menuitem">
                                    <a data-route="rainbowTriangles" href="">Rainbow Triangles</a>
                                </li><br />
                                <li className="sub menuitem">
                                    <a data-route="3dDomCar" href="">DOM Car</a>
                                </li><br />
				{/* NEEDS SMALL FIXES */}
                                <li className="sub menuitem frame">
                                    <a data-route="randomBits" href="">Random Bits</a>
                                </li><br />

                                {/*
                                <li className="sub menuitem">
                                    <a data-route="appOpen" href="">Cube to App</a>
                                </li><br />

                                FIXME
                                <li className="sub menuitem">
                                    <a data-route="clobe" href="">Clobe</a>
                                </li><br />
                                */}
                                <li className="sub menuitem">
                                    <a data-route="infamous" href="//infamous.io">Infamous</a>
                                </li><br />
                                <li className="sub menuitem">
                                    <a data-route="mom2015" href="">3D Mother's Day 2015</a>
                                </li><br />
                                <li className="sub menuitem">
                                    <a data-route="flipDiagonal" href="">Diagonal Grid Flip</a>
                                </li><br />
				{/* NEEDS UPDATE
                                <li className="sub menuitem">
                                    <a data-route="passwordReveal" href="">Password Prompt</a>
                                </li><br />
				*/}
                                {/* TODO: get this back up.
                                <li className="sub menuitem frame">
                                    <a href="vs5k.trusktr.io">Voting System 5000</a>
                                </li><br />
                                */}
				{/* NEEDS FONT FIX */}
                                <li className="sub menuitem">
                                    <a data-route="password" href="">Password Generator</a>
                                </li><br />
                                {/*
                                <li className="sub menuitem frame">
                                    <a href="http://ksb.sk8earth.com">Keep Skatin\' Bro</a>
                                </li><br />
                                <li className="sub menuitem frame">
                                    <a href="http://creationofsociety.com">Creation of Society</a>
                                </li><br />
                                <li className="sub menuitem frame">
                                    <a href="http://saccityexpress.com">Sac City Express</a>
                                </li><br />
                                <li className="sub menuitem frame">
                                    <a href="http://str8wayent.net">Straightway</a>
                                </li><br />
                                <li className="sub menuitem frame">
                                    <a href="http://bettafootwear.com/CrownYourFeet">Betta Footwear</a>
                                </li><br />
                                <li className="sub menuitem frame">
                                    <a data-route="hello" href="//trusktr.io/hello">Hello (2013)</a>
                                </li><br />
                                <li className="sub menuitem frame">
                                    <a data-route="oldPortfolio" href="//trusktr.io/portfolio">Old Portfolio (2013)</a>
                                </li><br />
                                */}
                                <li className="sub menuitem">
                                    <a data-route="resume" href="">Resume</a>
                                </li><br />
                                {/*
                                <li className="sub menuitem">
                                    <a href="/portfolio">more...</a>
                                </li><br />
                                */}
                            </menu>

                        </i-node>

                        <i-node id="contentNode" ref="contentNode"
                            sizeMode="proportional, proportional, literal"
                            size="1, 1, 0"
                            position="0, 0, -1"
                            style={{
                                //background: 'salmon',
                                pointerEvents: 'auto'
                            }}
                            >
                        </i-node>

                        <i-node id="fadeEffect" ref="fadeEffect"
                            sizeMode="proportional, proportional, literal"
                            size="1, 1, 0"
                            position="0, 0, -0.9" // slightly above the content
                            opacity="0.0"
                            style={{
                                background: '#333',
                                pointerEvents: 'none'
                            }}
                            >
                        </i-node>

                    </i-node>

                </i-scene>
            }

            async componentDidMount() {
                window.layout = this
                const menu = this.refs.menuNode
                const content = this.refs.contentNode
                const scene = this.refs.scene

                this.temporaryHackForFirefoxAndEdge()

                // TODO: better thing so end users don't have to await mountPromise?
                await Promise.all([menu.mountPromise, content.mountPromise, scene.mountPromise])

                // push menu specific
                this.initMouseEvents()
                this.initTouchEvents()

                // end user specific
                this.initMenuEvents()
                this.startHintAnimation()
                setTimeout(() => this.openMenu(), 1000)

                this.startRouter()
            }

            // hack needed because for some reason the WebComponents.js
            // polyfill doesn't trigger attributeChangedCallback for some
            // attributes in FF or Edge
            temporaryHackForFirefoxAndEdge() {
                this.refs.layoutRootNode.sizeMode = [ 'proportional', 'proportional', 'literal' ]
                this.refs.menuNode.sizeMode       = [ 'literal',      'proportional', 'literal' ]
                this.refs.invisibleGrip.sizeMode  = [ 'literal',      'proportional', 'literal' ]
                this.refs.contentNode.sizeMode    = [ 'proportional', 'proportional', 'literal' ]
                this.refs.fadeEffect.sizeMode     = [ 'proportional', 'proportional', 'literal' ]
            }

            startRouter() {
                const {contentNode} = this.refs

                router.start({
                    closeMenu: () => this.closeMenu(),
                    contentNode,
                })
            }

            initMouseEvents() {
                const menu = this.refs.menuNode
                const menuHint = this.refs.menuHint

                let hintStopped = false

                menu.addEventListener('mouseenter', event => {
                    if (!hintStopped) {
                        hintStopped = true
                        this.hintTween.stop();
                        menuHint.position.x = 4
                    }

                    this.openMenu()
                })
                menu.addEventListener('mouseleave', event => {
                    this.closeMenu()
                })
            }

            initTouchEvents() {
                const menu = this.refs['menuNode']
                const menuHint = this.refs['menuHint']

                let hintStopped = false

                let direction = 1 // opening
                let lastX = 0
                let delta = 0
                let dragX = 0

                menu.addEventListener('touchstart', event => {
                    const touches = event.touches

                    if (touches.length === 1) {
                        if (!hintStopped) {
                            hintStopped = true
                            this.hintTween.stop();
                            menuHint.position.x = 4
                        }

                        if (this.menuTween) this.menuTween.stop()

                        lastX = touches[0].screenX
                        dragX = this.menuPosition
                    }
                })
                menu.addEventListener('touchmove', event => {
                    const touches = event.touches

                    if (touches.length === 1) {
                        const touch = touches[0]

                        delta = touch.screenX - lastX
                        dragX += delta / 230

                        this.updateMenuPosition(dragX)

                        lastX = touch.screenX
                    }
                })
                menu.addEventListener('touchend', event => {
                    const touches = event.changedTouches

                    if (touches.length === 1) {
                        if (delta > 0) {
                            this.openMenu()
                        }
                        else if (delta < 0) {
                            this.closeMenu()
                        }
                        else {
                            if (this.menuPosition >= 0.5) this.openMenu()
                            else this.closeMenu()
                        }
                    }
                })
            }

            // TODO:
            //  [x] change the current route using router.go()
            //  [x] Set the iframe to the same route
            //  [x] Set up server-side routing so that we send back the
            //      specific demos without the main UI.
            //  [x] Convert all link into apps, an app can contain an iframe.
            //  [x] Move view change logic to route handler.
            //  [ ] Load initial route on full-page load/reload.
            async initMenuEvents() {
                const menuItems = Array.from(document.querySelectorAll('.menuitem a'))

                menuItems.forEach(link => link.addEventListener('click', event => {
                    event.preventDefault()
                    router.go(link.dataset.route)
                }))
            }

            startHintAnimation() {
                const menuHint = this.refs.menuHint

                this.hintTween = new StatusTween(menuHint.position)
                    .to({x: 5}, 1000)
                    .yoyo()
                    .repeat(Infinity)
                    .easing(Easing.Quintic.Out)
                    .start()

                const hintTask = Motor.addRenderTask(time => {
                    if (this.hintTween.stopped) Motor.removeRenderTask(hintTask)
                    this.hintTween.update(time)
                })
            }

            openMenu() {
                if (!this.menuIsOpening) {
                    this.menuIsOpening = true

                    const promise = this.animateTo(1.0)

                    promise.then(() => {
                        this.menuIsOpening = false
                    })

                    return promise
                }
            }

            closeMenu() {
                if (!this.menuIsClosing) {
                    this.menuIsClosing = true

                    const promise = this.animateTo(0.0)

                    promise.then(() => {
                        this.menuIsClosing = false
                    })

                    return promise
                }
            }

            updateMenuPosition(value) {
                // limit value to between 0 and 1
                value = value > 1 ? 1 : value < 0 ? 0 : value

                this.menuPosition = value

                const menu = this.refs.menuNode
                //const grip = this.refs.invisibleGrip
                const content = this.refs.contentNode
                const fade = this.refs.fadeEffect

                menu.position.x = value * 230 - 230
                content.position.z = value * -70 - 1
                fade.position.z = value * -70 - 0.9
                fade.opacity = value * 0.6
                //grip.position.x = value * -50 + 230
            }

            animateTo(value) {
                let resolve = null
                const promise = new Promise(r => resolve = r)

                if (this.menuTween) this.menuTween.stop()

                this.menuTween = new StatusTween(this)
                    .to({menuPosition: value}, 1000)
                    .easing(Easing.Exponential.Out)
                    .start()

                const tween = this.menuTween

                const task = Motor.addRenderTask(time => {
                    if (tween.stopped) {
                        Motor.removeRenderTask(task)
                        setTimeout(resolve, 0) // setTimeout so that we don't resolve during rAF. Use postMessage instead?
                        return
                    }

                    tween.update(time)

                    this.updateMenuPosition(this.menuPosition)

                    if (tween.completed) {
                        Motor.removeRenderTask(task)
                        setTimeout(resolve, 0) // setTimeout so that we don't resolve during rAF. Use postMessage instead?
                    }
                })

                return promise
            }
        }

        ReactDOM.render(<App />, document.body.querySelector('#app-root'))
    }

    const awaitThese = [ startup() ]

    // we need to wait for the WebComponentsReady event if we're using the
    // webcomponentsjs polyfill
    if ( window.WebComponents && !window.WebComponents.ready ) {

        awaitThese.push( new Promise( resolve => {

            document.addEventListener( 'WebComponentsReady', () => {
                console.log('web components ready!', window.WebComponents, window.WebComponents && window.WebComponents.ready)
                resolve()
            } )

        } ) )

    }

    await Promise.all( awaitThese )

    useDefaultNames()
    main()
}
