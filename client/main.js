import React from 'react'
import startup from 'awaitbox/meteor/startup'

//styles
import jss from "/client/common/jss-configured"
import reset from './common/styles/reset'

import './routes'

import home from './home'

// apply global reset
jss.createStyleSheet(reset, {named: false}).attach()

home()

// TODO: replace root with React-based root using Motor.
class App extends React.Component {
    render() {
        return (
            <div id="blah" className="app" anything="asdf">
                <div>1 2 3 4 5 6 </div>
            </div>
        )
    }
}

async function main() {
    await startup()
    React.render(<App />, document.querySelector('#rootContainer'))
}
