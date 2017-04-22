import Channel from 'async-csp'

import Router from './Router'

let Title = new Channel
Title.put('trusktr.io')

//watchTitle()
~async function watchTitle() {
    while (true) document.title = await Title.take()
}()

let router = new Router
window.router = router

// for any route.
router.with('.*', {
    enter() {
        console.log('Changing route.')
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

export default router
