import webglFundamentals from './webglFundamentals'
webglFundamentals()

//home1()
//home2()
//earthDefense()
//lettersToGrid()
//motorPushMenuDev()
//motorParentToChildAPI()
//testElementRemoval()
//testSceneUnmount()
//testShadowDomUsage()

const l = m => console.log(m)

async function home2() {
    import './silence-react'
    import * as React from 'react'
    import * as ReactDOM from 'react-dom'

    import 'infamous/motor-html'
    import Motor from 'infamous/motor/Motor'

    import cssReset from './common/styles/reset'
    import jss from "/client/common/jss-configured"
    jss.createStyleSheet(cssReset, {named: false}).attach()

    import {Tween, Easing} from 'tween.js'

    import startup from 'awaitbox/meteor/startup'

    import router from './routes'

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

    jss.createStyleSheet(style, {named: false}).attach()

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
                const menu = this.refs['menuNode']
                const content = this.refs['contentNode']
                const scene = this.refs.scene

                document.body.addEventListener('click', event => {
                    console.log('WE SHOULD SEE THIS IN CONSOLE.')
                })

                // TODO: better thing so end users don't have to await ready?
                await Promise.all([menu.ready, content.ready, scene.ready])

                // push menu specific
                this.initMouseEvents()
                this.initTouchEvents()

                // end user specific
                this.initMenuEvents()
                this.startHintAnimation()
            }

            initMouseEvents() {
                const menu = this.refs['menuNode']
                const menuHint = this.refs['menuHint']

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
                const $ = document.querySelectorAll.bind(document)

                $('iframe')[0].setAttribute('src', $('.menuitem a')[0].getAttribute('href'))

                Array.prototype.forEach.call($('.menuitem a'), link => link.addEventListener('click', async (event) => {
                    // TODO:
                    //  [ ] change the current route using router.go()
                    //  [ ] Set the iframe to the same route (done)
                    //  [ ] Set up server-side routing so that we send back the
                    //      specific demos without the main UI.

                    event.preventDefault()

                    await this.closeMenu()

                    router.go(link.getAttribute('data-route'))

                    if (link.parentNode.classList.contains('frame')) {
                        $('iframe')[0].setAttribute('src', link.getAttribute('href'))
                    }
                }))
            }

            startHintAnimation() {
                const menuHint = this.refs['menuHint']

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

                const menu = this.refs['menuNode']
                //const grip = this.refs['invisibleGrip']
                const content = this.refs['contentNode']
                const fade = this.refs['fadeEffect']

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

function home1() {
    import $ from 'jquery';

    //famous
    import 'famous/src/core/famous.css'

    //infamous
    import Plane from 'infamous/Plane';
    import PushMenuLayout from 'infamous/PushMenuLayout';
    import {contextWithPerspective} from 'infamous/utils';

    //utils
    import callAfter from 'army-knife/callAfter';

    import './routes'

    //styles
    import jss from "/client/common/jss-configured"
    import reset from './common/styles/reset'

    // apply global reset
    jss.createStyleSheet(reset, {named: false}).attach()

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
                        color: '#1DD326',
                        'border-radius': '2px',
                        padding: '0 3px',
                    },
                    '& a:hover': {
                        'text-decoration': 'none',
                        color: 'rgb(45,45,45)',
                        background: '#1DD326',
                    },
                    '& .sub.menuitem': {
                        'font-size': '0.8rem',
                    },
                    '&:after': {
                        content: '""',
                        position: 'absolute',
                        top: '50%',
                        'margin-top': '-10px',
                        left: '100%',

                        //triangle
                        //TODO: Move this into PushMenuLayout, and make optional.
                        width: 0,
                        height: 0,
                        'border-top': '10px solid transparent',
                        'border-bottom': '10px solid transparent',
                        'border-left': '10px solid '+menuColor,
                    }
                }
            }
        }
    }

    jss.createStyleSheet(style, {named: false}).attach()

    const layout = new PushMenuLayout();
    window.layout = layout

    // The menuPlane contains a collection of links made with traditional HTML.
    const menuPlane = new Plane({
        size: [layout.menuWidth + 0, undefined],

        // TODO: use a template engine.
        content: ''+
            '<menu id="menu">'+
                '<li class="menuitem" style="color: #ccc">Joe Pea</li><br />'+
                //'<li class="sub menuitem">'+
                    //'<a href="/hello">about me</a>'+
                //'</li><br />'+
                '<li class="sub menuitem frame">'+
                    '<a target="_blank" href="/pages/mom2015/index.html">3D Mother\'s Day 2015</a>'+
                '</li><br />'+
                //'<li class="sub menuitem frame">'+
                    //'<a target="_blank" href="/pages/webglearth/index.html">Globe</a>'+
                //'</li><br />'+
                '<li class="sub menuitem frame">'+
                    '<a target="_blank" href="/pages/clobe/index.html">Clobe</a>'+
                '</li><br />'+
                '<li class="sub menuitem frame">'+
                    '<a target="_blank" href="/pages/flipDiagonal/index.html">Diagonal Grid Flip</a>'+
                '</li><br />'+
                '<li class="sub menuitem frame">'+
                    '<a target="_blank" href="/pages/passwordReveal/index.html">Password Prompt</a>'+
                '</li><br />'+
                //'<li class="sub menuitem frame">'+
                    //'<a target="_blank" href="/pages/calendar/index.html">Date Picker</a>'+
                //'</li><br />'+
                //'<li class="sub menuitem frame">'+
                    //'<a target="_blank" href="https://vs5k.trusktr.io">Voting System 5000</a>'+
                //'</li><br />'+
                '<li class="sub menuitem frame">'+
                    '<a target="_blank" href="/pages/password/index.html">Password Generator</a>'+
                '</li><br />'+
                //'<li class="sub menuitem frame">'+
                    //'<a target="_blank" href="http://ksb.sk8earth.com">Keep Skatin\' Bro</a>'+
                //'</li><br />'+
                //'<li class="sub menuitem frame">'+
                    //'<a target="_blank" href="http://creationofsociety.com">Creation of Society</a>'+
                //'</li><br />'+
                //'<li class="sub menuitem frame">'+
                    //'<a target="_blank" href="http://saccityexpress.com">Sac City Express</a>'+
                //'</li><br />'+
                //'<li class="sub menuitem frame">'+
                    //'<a target="_blank" href="http://str8wayent.net">Straightway</a>'+
                //'</li><br />'+
                //'<li class="sub menuitem frame">'+
                    //'<a target="_blank" href="http://bettafootwear.com/CrownYourFeet">Betta Footwear</a>'+
                //'</li><br />'+
                '<li class="sub menuitem frame">'+
                    '<a target="_blank" href="https://docs.google.com/viewer?embedded=true&url=trusktr.io/boring_resume.pdf">Resume</a>'+
                '</li><br />'+
                //'<li class="sub menuitem">'+
                    //'<a href="/portfolio">more...</a>'+
                //'</li><br />'+
            '</menu>'+
        '',

        properties: {
            zIndex: '10'
        }
    });

    console.log('created menuPlane:', menuPlane)

    const iframePlane = new Plane({
        size: [undefined,undefined],
        content: '<iframe src="" style="width: 100%; height: 100%"></iframe>',
        properties: {
            zIndex: '0',
        }
    });

    const context = contextWithPerspective(1000);

    // FIXME: Why the EFF must I also set align and origin on iframePlane when
    // I've already set it on it's parent (layout.contentMol)?????
    iframePlane.setOptions({
        origin: [layout.alignment, 0.5],
        align: [layout.alignment, 0.5]
    });

    iframePlane.transform.setTranslateZ(-1); // TODO: move this into PushMenuLayout

    layout.contentMol.node.add(iframePlane.node);
    layout.menuMol.node.add(menuPlane.node);

    context.add(layout.node);

    // When you add something to the menu area of a PushMenuLayout, the
    // PushMenuLayout will automatically pipe events from the thing to the
    // PushMenuLayout's touch sync if the thing you added to the menu are has a
    // pipe method (falling back to subscribe).
    //
    // If whatever you put in the menu area doesn't have a pipe or subscribe
    // method (e.g. Modifiers, RenderNodes, etc), be sure to pipe it's events
    // (or it's children's events) to the menu area's touch sync so the menu
    // will be properly reactive to touch.
    menuPlane.pipe(layout.touchSync);

    // A PushMenuLayout by default opens and closes only by dragging with touch
    // and ignores mouse events. You can add your own handling for mouse events
    // like this:
    menuPlane.on('mouseenter', function() {
        if (!layout.isOpening) {
            layout.openMenu();
        }
    });
    menuPlane.on('mouseleave', function() {
        if (!layout.isClosing) {
            layout.closeMenu();
        }
    });

    const loadFirstMenuItemContent = callAfter(2, function() {
        $('iframe').attr('src', $('.menuitem a').attr('href'));
    });

    // Set up the click handlers to change the content of the iframe.
    menuPlane.on('deploy', function() {
        loadFirstMenuItemContent();
        $('.menuitem a').on('click', function(event) {
            const _link = $(this);
            layout.closeMenu(function() {
                if (_link.parent().is('.frame')) {
                    $('iframe').attr('src', _link.attr('href'));
                }
            });
            event.preventDefault();
        });
    });

    iframePlane.on('deploy', function() {
        loadFirstMenuItemContent();
    });
}

async function earthDefense() {
    import startup from 'awaitbox/meteor/startup'
    import {Tween, Easing} from 'tween.js'

    import './silence-react'
    import React from 'react'
    import ReactDOM from 'react-dom'

    import Motor from 'infamous/motor/Motor'
    import {MotorHTMLNode, MotorHTMLScene} from 'infamous/motor-html'

    // html
    import './main.html'

    //styles
    import jss from "/client/common/jss-configured"
    import reset from './common/styles/reset'

    // apply global reset
    jss.createStyleSheet(reset, {named: false}).attach()

    class Game extends React.Component {
        render() {
            return (
                <motor-scene id="scene" ref="scene">
                    <motor-node id="rotator" ref="rotator"
                        align="0.5, 0.5, 0.5"
                        mountPoint="0.5, 0.5, 0.5"
                        >

                        <motor-node id="earth" ref="earth"
                            sizeMode="absolute, absolute, absolute"
                            absoluteSize="100,100,100"
                            style={{'border': '1px solid blue', 'borderRadius':'50px'}}
                            align="0.5,0.5,0.5"
                            mountPoint="0.5,0.5,0.5"
                            >

                        </motor-node>

                        <motor-node id="rocket" ref="rocket"
                            sizeMode="absolute, absolute, absolute"
                            absoluteSize="10, 10, 10"
                            style={{border: '1px solid red', borderRadius:'5px'}}
                            align="0.5,0.5,0.5"
                            mountPoint="0.5,0.5,0.5"
                            position={`${Math.random()*500-250}, ${Math.random()*500-250}, 0`}
                            >

                        </motor-node>
                    </motor-node>

                </motor-scene>
            )
        }

        async componentDidMount() {
            const rocket = this.refs.rocket
            await rocket.ready

            const {position, absoluteSize} = rocket

            const rocketToEarthTween = new Tween(position)

            rocketToEarthTween.to({
                x:0,
                y:0,
            }, 2000)

            rocketToEarthTween.easing(Easing.Cubic.In)

            rocketToEarthTween.start(performance.now())

            const positionTask = Motor.addRenderTask(time => {
                rocketToEarthTween.update(time)

                if (position.x === 0 && position.y === 0) {
                    rocketToEarthTween.stop()
                    Motor.removeRenderTask(positionTask)

                    this.refs.rocket.style.border = 'none'
                    this.refs.rocket.style.background = 'yellow'
                    this.refs.rocket.style['border-radius'] = '15px'
                    absoluteSize.x = 30
                    absoluteSize.y = 30

                    const fadeOutTask = Motor.addRenderTask(() => {
                        rocket.opacity -= 0.01
                        if (rocket.opacity <= 0) Motor.removeRenderTask(fadeOutTask)
                    })
                }
            })

            //const rotator = this.refs.rotator
            //Motor.addRenderTask(() => {
                //rotator.rotation.y++
            //})
        }
    }

    function startGame() {
        const appRoot = document.querySelector('#app-root')
        ReactDOM.render(<Game />, appRoot)
    }

    await startup()
    startGame()
}

async function lettersToGrid() {
    import startup from 'awaitbox/meteor/startup'
    import sleep from 'awaitbox/timers/sleep'

    import React from 'react'
    import ReactDOM from 'react-dom'

    import TWEEN from 'tween.js'

    import 'infamous/motor-html'
    import Motor from 'infamous/motor/Motor'
    import Scene from 'infamous/motor/Scene'
    import Node from 'infamous/motor/Node'

    import './main.html';

    class GridLayout2D extends React.Component {

        render() {
            const {gridSize, cellSize} = this.props
            const gridCells = []

            let index = 0

            for (let row = 0, height = gridSize.height; row < height; row += 1) {

                for (let column = 0, width = gridSize.width; column < width; column += 1) {

                    gridCells.push(
                        <motor-node
                            key={index} ref={''+index}
                            absoluteSize={[cellSize.width, cellSize.height, 0]}
                            position={[
                                cellSize.width * (column % gridSize.width),
                                cellSize.height * (row % gridSize.height),
                                0
                            ]}

                            // enable the style to visualize text grid.
                            //style={{outline: '1px solid red'}}
                            >

                        </motor-node>
                    )

                    index += 1
                }
            }

            return (
                <motor-node ref="cellContainer"

                    // passed via props
                    align={this.props.align}
                    mountPoint={this.props.mountPoint}
                    //origin={this.props.origin}
                    //position={this.props.position}
                    //rotation={this.props.rotation}
                    //scale={this.props.scale}
                    //skew={this.props.skew}
                    //opacity={this.props.opacity}

                    // not passed via props
                    absoluteSize={[gridSize.width * cellSize.width, gridSize.height * cellSize.height, 0]}
                    >
                    {gridCells}
                </motor-node>
            )
        }

        constructor() {
            super()
            this.resolveReadyPromise = null
            this.ready = new Promise(r => this.resolveReadyPromise = r)
        }

        componentDidMount() {
            let readyCount = 0
            let numberOfCells = this.props.gridSize.width * this.props.gridSize.height

            for (let i = 0; i< numberOfCells; i++) {
                ~async function() {
                    await this.refs[`${i}`].ready
                    readyCount++

                    // If we've awaited all cells to be ready, let's signal that the
                    // grid is ready. This might be the type of thing to abstract
                    // into a React component (f.e. MotorNode).
                    if (readyCount == numberOfCells) {

                        // also wait for the cellContainer to be ready.
                        await this.refs.cellContainer.ready

                        console.log(' ****************** grid ready! *****************')
                        this.resolveReadyPromise()
                    }
                }.call(this)
            }
        }
    }

    class LettersToGrid extends React.Component {

        constructor() {
            super()
            this.letterWidth = 14
            this.letterHeight = 20
        }

        render() {
            const props = this.props
            return (
                <motor-scene ref='scene'>
                    <motor-node ref={el => this.rotator = el}
                        position='-0, 0, -0'
                        absoluteSize='200,200,0'
                        align='0.5,0.5,0'
                        mountPoint='0.5,0.5,0'
                        rotation='0,30,0'
                    >

                        <GridLayout2D ref={el => this.grid = el}
                            gridSize={{width: 15, height: 8 }}
                            cellSize={{width: this.letterWidth+2, height: this.letterHeight+2}}
                            align='0.5, 0.5, 0.5'
                            mountPoint='0.5, 0.5, 0.5'
                            >

                        </GridLayout2D>

                    </motor-node>
                </motor-scene>
            )
        }

        async componentDidMount() {

            const letters = this.props.msg.split('')

            // why exactly do we need to wait for ready here? Once we have the
            // `ref`, why is the element not ready? It's not obvious that we need to
            // do this, andifwe don't we get unexpected results below (the positions
            // of the cell nodes are all reported as zero.)
            await this.grid.ready
            console.log('grid ready!', this.grid.ready)

            // for each letter make an Infamous Node.
            const letterNodes = letters.map(letter => {

                const node = new Node({
                    position: {
                        x: Math.random() * 300 - 150,
                        y: Math.random() * 300 - 150,
                        z: Math.random() * 300 - 150
                    },

                    rotation: {
                        x: Math.random() * 360,
                        y: Math.random() * 360,
                        z: Math.random() * 360
                    },

                    absoluteSize: {
                        x: this.letterWidth,
                        y: this.letterHeight,
                    },
                })

                // render the letter into the motor-node
                node._el.element.innerHTML = letter
                node._el.element.style['font-size'] = `${this.letterHeight}px`
                node._el.element.style['text-align'] = 'center'
                node._el.element.style['vertical-align'] = 'middle'

                // append children to node common to
                //this.rotator.appendChild(node._el.element)
                // we could also do:
                this.rotator.imperativeCounterpart.addChild(node)

                return node
            })

            const cellContainer = this.grid.refs.cellContainer.imperativeCounterpart
            const rotator = this.rotator.imperativeCounterpart
            const gridCellNodes = [...cellContainer.children]

            const cellPositions = gridCellNodes.map(cellNode => {
                return getPositionFromAncestor(cellNode, rotator)
            })

            // Add a render task, which is a function that gets executed at about
            // 60hz repeatedly. We modify the rotator node within this render task,
            // which causes the rotator node to be re-rendered.
            //
            // Here we increment the "angle" variable by 1 each tick of the Motor's
            // animation loop (the animation loop executes this following render task
            // over and over at about 60 times per second).
            let angle = -65
            this.rotationTask = Motor.addRenderTask(() => {
                angle += 0.2
                this.rotator.rotation.y = angle
            })

            // after 2 seconds...
            await sleep(3000)

            const tweens = []

            // ... animate the letters into the layout.
            letterNodes.forEach((letterNode, index) => {

                const positionTween = new TWEEN.Tween({
                    x: letterNode.position.x,
                    y: letterNode.position.y,
                    z: letterNode.position.z,
                })
                    .to(cellPositions[index], 2000)
                    .easing(TWEEN.Easing.Exponential.InOut)
                    .onUpdate(function() {
                        letterNode.position = { x: this.x, y: this.y, z: this.z, }
                    })
                    .onComplete(function() { positionTween.completed = true })
                    .onStop(function() { positionTween.stopped = true })

                const rotationTween = new TWEEN.Tween({
                    x: letterNode.rotation.x,
                    y: letterNode.rotation.y,
                    z: letterNode.rotation.z,
                })
                    .to({x:0, y:0, z:0}, 2000)
                    .easing(TWEEN.Easing.Exponential.Out)
                    .onUpdate(function() {
                        letterNode.rotation = { x: this.x, y: this.y, z: this.z, }
                    })
                    .onComplete(function() { rotationTween.completed = true })
                    .onStop(function() { rotationTween.stopped = true })

                tweens.push([positionTween, rotationTween])
            })

            console.log( 'Add render task to animate letters into grid positions!' )
            let completedTweens = 0
            let counter = 0
            const task = Motor.addRenderTask(time => {

                for (let i = 0, l = tweens.length; i<l; i+=1) {
                    if (!tweens[i][0].started) {
                        tweens[i][0].start(time)
                        tweens[i][0].started = true
                    }
                    else tweens[i][0].update(time)

                    if (!tweens[i][1].started) {
                        tweens[i][1].start(time)
                        tweens[i][1].started = true
                    }
                    else tweens[i][1].update(time)

                    if (tweens[i][0].completed || tweens[i][0].stopped) {
                        completedTweens++
                    }
                    if (tweens[i][1].completed || tweens[i][1].stopped) {
                        completedTweens++
                    }
                }

                if (completedTweens == tweens.length * 2) {
                    console.log('Done animating, remove render task!')
                    Motor.removeRenderTask(task)
                }
            })

            //After animating to new positions, transfer to the layout?
        }

        componentWillUnmount() {
            Motor.removeRenderTask(this.rotationTask)
        }
    }

    function getPositionFromAncestor(descendant, ancestor) {
        const position = { x: 0, y: 0, z: 0 }
        let currentNode = descendant

        while(currentNode && currentNode !== ancestor) {
            const currentNodeParent = currentNode.parent

            const parentSize = currentNodeParent.actualSize
            const currentAlign = currentNode.align
            const currentSize = currentNode.actualSize
            const alignOffset = {
                x: parentSize.x * currentAlign.x,
                y: parentSize.y * currentAlign.y,
                z: parentSize.z * currentAlign.z,
            }
            const currentMountPoint = currentNode.mountPoint
            const mountPointOffest = {
                x: currentSize.x * currentMountPoint.x,
                y: currentSize.y * currentMountPoint.y,
                z: currentSize.z * currentMountPoint.z,
            }

            position.x += currentNode.position.x + alignOffset.x - mountPointOffest.x
            position.y += currentNode.position.y + alignOffset.y - mountPointOffest.y
            position.z += currentNode.position.z + alignOffset.z - mountPointOffest.z

            currentNode = currentNodeParent
        }

        return position
    }

    function startGame() {
        const appRoot = document.querySelector('#app-root')
        ReactDOM.render(<LettersToGrid msg="This is a sentence of random text, just some random bits somewhere in the universe. :]" />, appRoot)
    }

    await startup()
    startGame()
}

function motorPushMenuDev() {
    import PushPaneLayout from 'infamous/motor/PushPaneLayout'
    console.log('push pane layout!', PushPaneLayout)
}

function motorParentToChildAPI() {
    //
}

// needed until Meteor 1.4.2, which solves meteor issue #7662
function testElementRemovalImports() {
    import MotorHTMLNode from 'infamous/motor-html/node'
    import MotorHTMLScene from 'infamous/motor-html/scene'
    import Scene from 'infamous/motor/Scene'
    import startup from 'awaitbox/meteor/startup'
    import sleep from 'awaitbox/timers/sleep'

    return {
        MotorHTMLNode,
        MotorHTMLScene,
        Scene,
        startup,
        sleep,
    }
}
async function testElementRemoval() {
    const {
        MotorHTMLNode,
        MotorHTMLScene,
        Scene,
        startup,
        sleep,
    } = testElementRemovalImports()

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
        const scene = new MotorHTMLScene
        scene.id = 'myScene'
        const node = new MotorHTMLNode
        node.id = "myNode"
        scene.appendChild(node)
        document.querySelector('#app-root').appendChild(scene)
    }

    // case 2, remove old node from old scene (works)
    async function case2() {
        await startup()
        const scene = new MotorHTMLScene
        scene.id = 'myScene'
        const node = new MotorHTMLNode
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
        const scene = new MotorHTMLScene
        scene.id = 'myScene'
        const node = new MotorHTMLNode
        node.id = "myNode"
        scene.appendChild(node)
        document.querySelector('#app-root').appendChild(scene)

        await sleep(500)
        scene.removeChild(node)

        await sleep(500)
        console.log('true:', node.imperativeCounterpart._scene === null)

        await sleep(500)
        const scene2 = new MotorHTMLScene
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
        const scene = new MotorHTMLScene
        scene.id = 'myScene'
        const node = new MotorHTMLNode
        node.id = "myNode"
        scene.appendChild(node)
        document.querySelector('#app-root').appendChild(scene)

        await sleep(500)
        scene.removeChild(node)

        await sleep(500)
        console.log('true:', node.imperativeCounterpart._scene === null)

        await sleep(500)
        const scene2 = new MotorHTMLScene
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
        const scene = new MotorHTMLScene
        scene.id = 'myScene'
        const node = new MotorHTMLNode
        node.id = "myNode"
        scene.appendChild(node)
        document.querySelector('#app-root').appendChild(scene)

        await sleep(500)
        scene.removeChild(node)

        await sleep(500)
        console.log('true:', node.imperativeCounterpart._scene === null)

        await sleep(500)
        const scene2 = new MotorHTMLScene
        // document.querySelector('#app-root').appendChild(scene2)
        scene2.appendChild(node)
        // WebComponent#init is called sync in the same tick, so,
        console.log('true:', node.imperativeCounterpart._scene === null) // because scene isn't mounted.

        await sleep(500)
        scene2.removeChild(node)
        const scene3 = new MotorHTMLScene
        scene3.appendChild(node)
        document.querySelector('#app-root').appendChild(scene3) // without this line, it throws an error in a following tick, but should not, and this line can be called in the future.
    }

    // case 6, remove node from second mounted scene then append node to a third new mounted scene after async delay (works)
    async function case6() {
        await startup()
        const scene = new MotorHTMLScene
        scene.id = 'myScene'
        const node = new MotorHTMLNode
        node.id = "myNode"
        scene.appendChild(node)
        document.querySelector('#app-root').appendChild(scene)

        await sleep(500)
        scene.removeChild(node)

        await sleep(500)
        console.log('true:', node.imperativeCounterpart._scene === null)

        await sleep(500)
        const scene2 = new MotorHTMLScene
        document.querySelector('#app-root').appendChild(scene2)
        scene2.appendChild(node)
        // WebComponent#init is called sync in the same tick, so,
        console.log('true:', node.imperativeCounterpart._scene instanceof Scene)

        await sleep(500)
        scene2.removeChild(node)

        await sleep(500)
        console.log('true:', node.imperativeCounterpart._scene === null)
        const scene3 = new MotorHTMLScene
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
        const scene = new MotorHTMLScene
        scene.id = 'myScene'
        const node = new MotorHTMLNode
        node.id = "myNode"
        scene.appendChild(node)
        document.querySelector('#app-root').appendChild(scene)

        await sleep(500)
        scene.removeChild(node)

        await sleep(500)
        console.log('true:', node.imperativeCounterpart._scene === null)

        await sleep(500)
        const scene2 = new MotorHTMLScene
        document.querySelector('#app-root').appendChild(scene2)
        scene2.appendChild(node)
        // WebComponent#init is called sync in the same tick, so,
        console.log('true:', node.imperativeCounterpart._scene instanceof Scene)

        await sleep(500)
        scene2.removeChild(node)

        // await sleep(500) // This is the only difference between case 6 and case 7.
        console.log('true:', node.imperativeCounterpart._scene === null)
        const scene3 = new MotorHTMLScene
        document.querySelector('#app-root').appendChild(scene3)
        scene3.appendChild(node)
        // WebComponent#init is called sync in the same tick, so,
        console.log('true:', node.imperativeCounterpart._scene instanceof Scene)
    }
}

function testSceneUnmountDeps() {
    import sleep from 'awaitbox/timers/sleep'

    return {
        sleep,
    }
}
async function testSceneUnmount() {
    import startup from 'awaitbox/meteor/startup'

    import './silence-react'
    import React from 'react'
    import ReactDOM from 'react-dom'

    import Motor from 'infamous/motor/Motor'
    import 'infamous/motor-html'

    // html
    import './main.html';

    //styles
    import jss from "/client/common/jss-configured"
    import reset from './common/styles/reset'

    const {sleep} = testSceneUnmountDeps()

    // apply global reset
    jss.createStyleSheet(reset, {named: false}).attach()

    class Game extends React.Component {
        render() {
            return (
                <motor-scene ref="scene">

                    <motor-node ref="earth"
                        sizeMode="absolute, absolute, absolute"
                        absoluteSize="100,100,100"
                        style={{'border': '1px solid blue', 'borderRadius':'50px'}}
                        align="0.5,0.5,0.5"
                        mountPoint="0.5,0.5,0.5"
                        >

                    </motor-node>

                    <motor-node ref="rocket"
                        sizeMode="absolute, absolute, absolute"
                        absoluteSize="10, 10, 10"
                        style={{border: '1px solid red', borderRadius:'5px'}}
                        align="0.5,0.5,0.5"
                        mountPoint="0.5,0.5,0.5"
                        position="200, -50, 0"
                        >

                    </motor-node>

                </motor-scene>
            )
        }

        async componentDidMount() {
            const rocket = this.refs.rocket

            await rocket.ready

            const {position, absoluteSize} = rocket

            const positionTask = Motor.addRenderTask(() => {
                if (position.x !== 0) position.x -= 2
                if (position.y !== 0) position.y += 2

                if (position.x === 0 && position.y === 0) {
                    Motor.removeRenderTask(positionTask)

                    rocket.style.border = 'none'
                    rocket.style.background = 'yellow'
                    rocket.style['border-radius'] = '15px'
                    absoluteSize.x = 30
                    absoluteSize.y = 30

                    const fadeOutTask = Motor.addRenderTask(() => {
                        rocket.opacity -= 0.01
                        if (rocket.opacity <= 0) Motor.removeRenderTask(fadeOutTask)
                    })
                }
            })

            await sleep(500)
            const scene = this.refs.scene
            scene.remove()

            await sleep(100)
            console.log('false:', scene.imperativeCounterpart._mounted)

            await sleep(500)
            document.querySelector('#app-root').appendChild(scene)

            await sleep(100)
            console.log('true:', scene.imperativeCounterpart._mounted)
        }
    }

    function startGame() {
        const appRoot = document.querySelector('#app-root')
        ReactDOM.render(<Game />, appRoot)
    }

    await startup()

    startGame()
}

function testShadowDomUsageDeps() {
    import React from 'react'
    import ReactDOM from 'react-dom'
    import sleep from 'awaitbox/timers/sleep'
    import startup from 'awaitbox/meteor/startup'
    import {MotorHTMLNode, MotorHTMLScene} from 'infamous/motor-html'

    import 'document-register-element'

    return {
        React,
        ReactDOM,
        sleep,
        startup,
        MotorHTMLNode,
        MotorHTMLScene,
    }
}
async function testShadowDomUsage() {
    const {
        React,
        ReactDOM,
        sleep,
        startup,
        MotorHTMLNode,
        MotorHTMLScene,
    } = testShadowDomUsageDeps()

    document.registerElement('motor-node', MotorHTMLNode)
    document.registerElement('motor-scene', MotorHTMLScene)

    await startup()

    ReactDOM.render(
        <motor-scene id="scene">
            <motor-node id="distributedNode"
                absoluteSize="100,100,100"
                style={{border: '1px solid teal'}}
                >
            </motor-node>
        </motor-scene>,
        document.querySelector('#app-root')
    )

    await sleep(500)

    const innerNode = document.createElement('motor-node')
    innerNode.style.outline = '1px solid red'

    const scene = document.querySelector('#scene')
    const root = scene.createShadowRoot()

    // root.innerHTML = `
    //     <motor-node id="innerNode">
    //         <content></content>
    //     </motor-node>
    // `
    root.appendChild(innerNode)
    innerNode.appendChild(document.createElement('content'))

    console.log(root)

    await sleep(500)
    innerNode.setAttribute('absolutesize', '10, 10, 10')
}
