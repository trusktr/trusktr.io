
// home()
// earthDefense()
// motorPushMenuDev()
// motorParentToChildAPI()
// testElementRemoval()
// testSceneUnmount()
testShadowDomUsage()

function home() {
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
                        'border-left': '10px solid '+menuColor,
                        'border-bottom': '10px solid transparent',
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

        }
    }

    function startGame() {
        const appRoot = document.querySelector('#app-root')
        ReactDOM.render(<Game />, appRoot)
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
    import 'infamous/motor-html'

    return {
        React,
        ReactDOM,
        sleep,
        startup,
    }
}
async function testShadowDomUsage() {
    const {
        React,
        ReactDOM,
        sleep,
        startup,
    } = testShadowDomUsageDeps()

    await startup()

    ReactDOM.render(
        <motor-scene id="scene">
            <motor-node id="distributedNode">
            </motor-node>
        </motor-scene>,
        document.querySelector('#app-root')
    )

    await sleep(500)

    let scene = document.querySelector('#scene')

    let root = scene.createShadowRoot()

    root.innerHTML = `
        <motor-node id="innerNode">
            <content></content>
        </motor-node>
    `

    console.log(root)
}
