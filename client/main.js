import './routes'
import beFamous from './home'

Tracker.autorun(function() {
    document.title = Session.get('title')
})

beFamous()
