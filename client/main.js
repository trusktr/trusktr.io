import $ from 'jquery'

import './routes'
import beFamous from './home'

Tracker.autorun(function() {
    document.title = Session.get('title')
})

let scene = beFamous()

async function animate() {
    setTimeout(async function() {
        let rotator = $('#rotator')

        console.log('promise?', rotator.ready)
        await rotator.ready

        let r = 0
        requestAnimationFrame(function loop() {
            r += 1

            // TODO: make matching getters/setters on the element so we can
            // also do `rotator.rotation = [0, r, 0]` for performance.
            rotator.attr('rotation', `[0, ${r}, 0]`)

            requestAnimationFrame(loop)
        })
    }, 5000)
}

animate()
