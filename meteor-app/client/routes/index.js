import Channel from 'async-csp'

import Router from '../router/Router'

let Title = new Channel
Title.put('trusktr.io')

watchTitle()
async function watchTitle() {
    while (true) document.title = await Title.take()
}

let router = new Router
window.router = router

// for any route.
router.with('.*', {
})

router.with('/$', {
    enter() {
        Title.put('Joseph Orbegoso Pea, trusktr.')
    }
})

router.with('/password$', {
    enter() {
        Title.put('Password generator by Joe Pea, using jQuery.')
    }
})

router.with('/clobe$', {
    enter() {
        Title.put('Clobe by Joe Pea, using Famo.us.')
    }
})

router.with('/calendar$', {
    enter() {
        Title.put('Date picker by Joe Pea, using Bootstrap, Bootstrap-Datepicker, and Tooltipster.')
    }
})

router.with('/flipDiagonal$', {
    enter() {
        Title.put('Diagonal flip animation by Joe Pea, using Famo.us.')
    }
})

router.with('/passwordReveal$', {
    enter() {
        Title.put('Password reveal by Joe Pea, using Famo.us.')
    }
})

router.with('/scrollViewTest$', {
    enter() {
        Title.put('ScrollView test by Joe Pea and Alessandro Annini, using Famo.us.')
    }
})

router.with('/webglearth$', {
    enter() {
        Title.put('3D earth playground by Joe Pea, using Famo.us and WebGLEarth.')
    }
})

router.with('/mom2015$', {
    enter() {
        Title.put('I love you Mom.')
    }
})

router.with('/giants$', {
    enter() {
        Title.put('Giants with Marisa!')
    }
})

router.with('/johnnyCrook$', {
    enter() {
        Title.put('Crooked grind by Johnny Ray Taylor.')
    }
})

router.with('/greg5050$', {
    enter() {
        Title.put('Greg\'s first coping grind!')
    }
})
