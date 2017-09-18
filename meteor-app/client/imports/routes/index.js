import Channel from 'async-csp'
import Router from './Router'
import Preact from 'preact-compat'
import React from 'react'
import ReactDOM from 'react-dom'
import Vue from 'vue'

const routes = {
    randomBits: {
        title: 'Random Bits by Joe Pea.',
    },
    '3dDomCar': {
        title: '3D DOM Car by Joe Pea.',
    },
}

let Title = new Channel
Title.put('trusktr.io')

~async function watchTitle() {
    while (true) document.title = await Title.take()
}()

let router = new Router
window.router = router

let App = null
let vueInstance = null

function mountApp(App, container) {
    console.log(' ------------- App to mount:', App, Vue)
    if (App.__proto__ === React.Component)
        ReactDOM.render(<App />, container)
    else if (App.__proto__ === Preact.Component)
        Preact.render(Preact.createElement(App), container)
    else if (App._Ctor && App._Ctor[0].super === Vue)
        mountVueComponent(App, container)
}

function unmountApp(App, container) {
    if (App.__proto__ === React.Component)
        ReactDOM.unmountComponentAtNode(container)
    else if (App.__proto__ === Preact.Component)
        Preact.unmountComponentAtNode(container)
    else if (App._Ctor && App._Ctor[0].super === Vue)
        unmountVueComponent()
}

function mountVueComponent(App, container) {
    const vueContainer = document.createElement('div')
    container.appendChild(vueContainer)
    vueInstance = ( new ( Vue.extend(App) ) ).$mount(vueContainer)
}

function unmountVueComponent() {
    vueInstance.$destroy()
    vueInstance.$el.remove()
    vueInstance = null
}

// for any route.
router.with('.*', {
    async enter(routeDependencies) {
        const {closeMenu, contentNode} = routeDependencies
        console.log('Changing route.')

        // TODO decode in the Router class.
        const URI = decodeURI(document.location.pathname.substring(1))

        console.log('App to load:', URI)

        const previousApp = App

        App = (await Promise.all([
            closeMenu(),
            importApp(URI)
        ]))[1]

        if (previousApp) unmountApp(previousApp, contentNode)
        mountApp(App, contentNode)
    }
})

router.with('/$', {
    enter() {
        Title.put('Joseph Orbegoso Pea, trusktr.')
    }
})

router.with('/randomBits$', {
    enter() {
        Title.put('Random Bits by Joe Pea.')
    }
})

router.with('/3dDomCar$', {
    enter() {
        Title.put('3D DOM Car by Joe Pea.')
    }
})

router.with('/rippleFlip$', {
    enter() {
        Title.put('Ripple Flip by Joe Pea.')
    }
})

router.with('/rainbowTriangles', {
    enter() {
        Title.put('Rainbow Triangles by Joe Pea.')
    }
})

//router.with('/webglearth$', {
    //enter() {
        //Title.put('3D earth playground by Joe Pea, using Famo.us and WebGLEarth.')
    //}
//})

router.with('/clobe$', {
    enter() {
        Title.put('Clobe by Joe Pea.')
    }
})

router.with('/infamous$', {
    enter() {
        Title.put('Infamous by Joe Pea.')
    }
})

router.with('/mom2015$', {
    enter() {
        Title.put(`Mother's day by Joe Pea.`)
    }
})

router.with('/flipDiagonal$', {
    enter() {
        Title.put('Diagonal flip animation by Joe Pea.')
    }
})

router.with('/passwordReveal$', {
    enter() {
        Title.put('Password reveal by Joe Pea.')
    }
})

//router.with('/calendar$', {
    //enter() {
        //Title.put('Date picker by Joe Pea, using Bootstrap, Bootstrap-Datepicker, and Tooltipster.')
    //}
//})

router.with('/password$', {
    enter() {
        Title.put('Password generator by Joe Pea.')
    }
})

router.with('/giants$', {
    enter() {
        Title.put('Giants with Marisa!')
    }
})

router.with('/greg5050$', {
    enter() {
        Title.put('Greg\'s first coping grind! 3D by Joe Pea.')
    }
})

router.with('/johnnyCrook$', {
    enter() {
        Title.put('Crooked grind by Johnny Ray Taylor, 3D by Joe Pea.')
    }
})

router.with('/scrollViewTest$', {
    enter() {
        Title.put('ScrollView test by Joe Pea and Alessandro Annini.')
    }
})

router.with('/jumpyGlitch$', {
    enter() {
        Title.put('Jumpy glitch motion.')
    }
})

async function importApp(app) {
    //const app = require(`./${link.dataset.route}`) // works
    //const app = require('./appOpen').default // doesn't work
    //import app from './appOpen' // works
    //const {app} = await import('./appOpen') // works
    //const {app} = await import(`./${link.dataset.route}`) // doesn't work

    let imported =
        app == '3dDomCar'?                  import('../apps/3dDomCar'):
        app == 'rippleFlip'?                import('../apps/rippleFlip'):
        //app == 'rainbowTriangles'?          import('../apps/trianglesWebComponent'):
        app == 'rainbowTriangles'?          import('../apps/trianglesReact'):
        app == 'appOpen'?                   import('../apps/appOpen'):
        app == 'clobe'?                     import('../apps/clobe'):
        app == 'infamous'?                  import('../apps/infamous'):
        app == 'mom2015'?                   import('../apps/mom2015'):
        app == 'flipDiagonal'?              import('../apps/flipDiagonal'):
        app == 'passwordReveal'?            import('../apps/passwordReveal'):
        app == 'password'?                  import('../apps/password'):
        app == 'resume'?                    import('../apps/resume'):
        app == 'deviceOrientationTest'?     import('../apps/deviceOrientationTest'):
        app == 'broadcastOrientation1'?     import('../apps/broadcastOrientation1'):
        app == 'broadcastOrientation2'?     import('../apps/broadcastOrientation2'):
        app == 'broadcastOrientation3'?     import('../apps/broadcastOrientation3'):
        app == 'polydanceSplash'?           import('../apps/polydanceSplash'):
        app == 'polydance'?                 import('../apps/polydance-react'):
        //app == 'polydance'?                 import('../apps/polydance-preact'):
        app == 'polydance-vue'?             import('../apps/polydance.vue'):
        app == 'polydance-echolocation'?    import('../apps/polydance-echolocation'):
        app == 'polydance-evryday-by-PIVΛ'? import('../apps/polydance-evryday-by-PIVΛ'):
        app == 'webglFundamentals'?         import('../apps/webglFundamentals'):
        app == 'infamousWebGLScratch'?      import('../apps/infamousWebGLScratch'):
        app == 'geometricRotation'?         import('../apps/geometricRotation'):
        app == 'worms'?                     import('../apps/worms'):
        app == 'pyramids'?                  import('../apps/pyramids'):
        app == 'randomBits'?                import('../apps/randomBits'):
                                            import('../apps/rippleFlip')

    imported = (await imported).default
    return imported
}

export default router
