
import React from 'react'
import reactMixin from 'react-mixin'

import '../imports/routes'

import beFamous from './imports/home'

console.log('entry point!')

class Root extends React.Component {
    render() {
        return (
            <div className="root-scene" style={{width: '100%', height: '100%'}}></div>
        )
    }

    componentDidMount() {
        console.log('root mounted')
        beFamous($('.root-scene')[0])
    }
}

Tracker.autorun(function() {
    document.title = Session.get('title')
})

Meteor.startup(function() {
    React.render(<Root />, document.body)
})
