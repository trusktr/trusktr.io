import * as React from 'react'
import * as ReactDOM from 'react-dom'

import 'infamous/motor-html'
import Motor from 'infamous/motor/Motor'

import cssReset from './common/styles/reset'
import jss from "./lib/jss-configured"
jss.createStyleSheet(cssReset, {named: false}).attach()

import {Tween, Easing} from 'tween.js'

import startup from 'awaitbox/meteor/startup'

import router from './routes'

export default
async function home2() {
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

    const menuColor = 'rgb(45,45,45)'

    const style = {
        html: {
            '& body': {
                background: '#222',

                '& .hidden': {
                    display: 'none',
                },

                '& .invisible': {
                    visibility: 'visible',
                },

                '& #menu': {
                    'box-sizing': 'border-box',
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    padding: '20px',
                    margin: 0,
                    'list-style': 'none',
                    background: menuColor,
                    display: 'block',
                    'font-size': '1.3rem',

                    '& li': {
                        'padding-bottom': '10px',
                        display: 'inline',
                        //'text-shadow': '0px 4px 2px #000',
                    },
                    '& a': {
                        'text-decoration': 'none',
                        color: '#1DD326', // green
                        'border-radius': '2px',
                        padding: '0 3px',
                    },
                    '& a:hover': {
                        'text-decoration': 'none',
                        color: menuColor,
                        background: '#1DD326',
                    },
                    '& .sub.menuitem': {
                        'font-size': '0.8rem',
                    },
                }
            }
        }
    }

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
                return <motor-scene ref="scene">

                    {/* BUG: if we remove this wrapper, then content always renders on top of the menu for some reason.
                        TODO: See if this has to do with the root context, and preserve-3d?
                        */}
                    <motor-node sizeMode="proportional, proportional, absolute" proportionalSize="1, 1, 0"
                        style={{
                            pointerEvents: 'none',
                            //background: '#F5DABD' // light tan
                        }}
                        >

                        <motor-node id="menuNode" ref="menuNode"
                            sizeMode="absolute, proportional, absolute"
                            absoluteSize="230, 0, 0"
                            position="-230, 0, 1"
                            proportionalSize="0, 1, 0"
                            style={{pointerEvents: 'auto'}}
                            >

                            <motor-node id="invisibleGrip" ref="invisibleGrip"
                                sizeMode="absolute, proportional, absolute"
                                absoluteSize="50, 0, 0"
                                proportionalSize="0, 1, 0"
                                position="225, 0, 0"
                                >
                            </motor-node>

                            <motor-node id="menuHint" ref="menuHint"
                                absoluteSize="10, 20, 0"
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
                            </motor-node>

                            <menu id="menu">
                                <li className="menuitem" style={{color: '#ccc'}}>Joe Pea</li><br />
                                {/*<li className="sub menuitem">*/}
                                    {/*<a href="/hello">about me</a>*/}
                                {/*</li><br />*/}
                                <li className="sub menuitem frame">
                                    {/* TODO: Move random bits to local demo. */}
                                    <a target="_blank" data-route="randomBits" href="//mightydevs.com">Random Bits</a>
                                </li><br />
                                <li className="sub menuitem frame">
                                    <a target="_blank" data-route="3dDomCar" href="//jsfiddle.net/trusktr/ymonmo70/15/embedded/result,js,html,css">3D DOM Car</a>
                                </li><br />
                                {/*
                                <li className="sub menuitem">
                                    <a target="_blank" data-route="appOpen" href="">Cube to App</a>
                                </li><br />
                                */}
                                <li className="sub menuitem">
                                    <a target="_blank" data-route="rippleFlip" href="">Ripple Flip</a>
                                </li><br />
                                <li className="sub menuitem">
                                    <a target="_blank" data-route="rainbowTriangles" href="">Rainbow Triangles</a>
                                </li><br />
                                <li className="sub menuitem frame">
                                    <a target="_blank" data-route="clobe" href="/clobe">Clobe</a>
                                </li><br />
                                <li className="sub menuitem frame">
                                    <a target="_blank" data-route="infamous" href="//infamous.io">Infamous</a>
                                </li><br />
                                <li className="sub menuitem frame">
                                    <a target="_blank" data-route="mom2015" href="/mom2015">3D Mother's Day 2015</a>
                                </li><br />
                                <li className="sub menuitem frame">
                                    <a target="_blank" data-route="flipDiagonal" href="/flipDiagonal">Diagonal Grid Flip</a>
                                </li><br />
                                <li className="sub menuitem frame">
                                    <a target="_blank" data-route="passwordReveal" href="/passwordReveal">Password Prompt</a>
                                </li><br />
                                {/*<li className="sub menuitem frame">*/}
                                    {/*<a target="_blank" href="vs5k.trusktr.io">Voting System 5000</a>*/}
                                {/*</li><br />*/}
                                <li className="sub menuitem frame">
                                    <a target="_blank" data-route="password" href="/password">Password Generator</a>
                                </li><br />
                                {/*<li className="sub menuitem frame">*/}
                                    {/*<a target="_blank" href="http://ksb.sk8earth.com">Keep Skatin\' Bro</a>*/}
                                {/*</li><br />*/}
                                {/*<li className="sub menuitem frame">*/}
                                    {/*<a target="_blank" href="http://creationofsociety.com">Creation of Society</a>*/}
                                {/*</li><br />*/}
                                {/*<li className="sub menuitem frame">*/}
                                    {/*<a target="_blank" href="http://saccityexpress.com">Sac City Express</a>*/}
                                {/*</li><br />*/}
                                {/*<li className="sub menuitem frame">*/}
                                    {/*<a target="_blank" href="http://str8wayent.net">Straightway</a>*/}
                                {/*</li><br />*/}
                                {/*<li className="sub menuitem frame">*/}
                                    {/*<a target="_blank" href="http://bettafootwear.com/CrownYourFeet">Betta Footwear</a>*/}
                                {/*</li><br />*/}
                                {/*<li className="sub menuitem frame">
                                    <a target="_blank" data-route="hello" href="//trusktr.io/hello">Hello (2013)</a>
                                </li><br />
                                <li className="sub menuitem frame">
                                    <a target="_blank" data-route="oldPortfolio" href="//trusktr.io/portfolio">Old Portfolio (2013)</a>
                                </li><br />*/}
                                <li className="sub menuitem frame">
                                    <a target="_blank" data-route="resume" href={(
                                        document.location.hostname == 'localhost' ?
                                        document.location.origin :
                                        `//docs.google.com/viewer?embedded=true&url=${document.location.origin}`
                                    ) + `/resume.pdf`}>Resume</a>
                                </li><br />
                                {/*<li className="sub menuitem">*/}
                                    {/*<a href="/portfolio">more...</a>*/}
                                {/*</li><br />*/}
                            </menu>

                        </motor-node>

                        <motor-node id="contentNode" ref="contentNode"
                            sizeMode="proportional, proportional, absolute"
                            proportionalSize="1, 1, 0"
                            position="0, 0, -1"
                            style={{
                                //background: 'salmon',
                                pointerEvents: 'auto'
                            }}
                            >

                            <iframe src="" style={{width: '100%', height: '100%'}}></iframe>
                        </motor-node>

                        <motor-node id="fadeEffect" ref="fadeEffect"
                            sizeMode="proportional, proportional, absolute"
                            proportionalSize="1, 1, 0"
                            position="0, 0, -0.9" // slightly above the content
                            opacity="0.0"
                            style={{
                                background: '#333',
                                pointerEvents: 'none'
                            }}
                            >
                        </motor-node>

                    </motor-node>

                </motor-scene>
            }

            async componentDidMount() {
                window.layout = this
                const menu = this.refs.menuNode
                const content = this.refs.contentNode
                const scene = this.refs.scene

                // TODO: better thing so end users don't have to await mountPromise?
                await Promise.all([menu.mountPromise, content.mountPromise, scene.mountPromise])

                // push menu specific
                this.initMouseEvents()
                this.initTouchEvents()

                // end user specific
                this.initMenuEvents()
                this.startHintAnimation()
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

            initMenuEvents() {
                const x = document.querySelectorAll.bind(document)

                x('iframe')[0].setAttribute('src', x('.menuitem a')[0].getAttribute('href'))

                let App = null
                const {contentNode} = this.refs

                Array.from(x('.menuitem a')).forEach(link => link.addEventListener('click', async (event) => {
                    // TODO:
                    //  [ ] change the current route using router.go()
                    //  [ ] Set the iframe to the same route (done)
                    //  [ ] Set up server-side routing so that we send back the
                    //      specific demos without the main UI.

                    event.preventDefault()

                    await this.closeMenu()

                    if (App) ReactDOM.unmountComponentAtNode(contentNode)

                    router.go(link.getAttribute('data-route'))

                    if (link.parentNode.classList.contains('frame')) {
                        contentNode.innerHTML = (`
                            <iframe src="${link.getAttribute('href')}" style="width: 100%; height: 100%;"></iframe>
                        `)
                    }
                    else {
                        //const app = require(`./${link.dataset.route}`) // works
                        //const app = require('./appOpen').default // doesn't work
                        //import app from './appOpen' // works
                        //const {app} = await import('./appOpen') // works
                        //const {app} = await import(`./${link.dataset.route}`) // doesn't work

                        switch (link.dataset.route) {
                            case 'appOpen':
                                App = (require('./appOpen')).default
                                break
                            case 'rippleFlip':
                                App = (require('./rippleFlip')).default
                                break
                            case 'rainbowTriangles':
                                App = (require('./trianglesReact')).default
                                break
                            default:
                                App = (require('./rippleFlip')).default
                        }

                        ReactDOM.render(<App />, contentNode)
                    }
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

    await startup()
    main()
}
