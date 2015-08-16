
import React from 'react'

class Root extends React.Component {
    render() {
        return (
            <div>
                hello.
            </div>
        )
    }
}

Meteor.startup(function() {
    React.render(<Root />, document.body)
})
