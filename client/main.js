import {Title} from './routes'
import home from './home'

//styles
import jss from "/client/common/jss-configured"
import reset from './common/styles/reset'

// apply global reset
jss.createStyleSheet(reset, {named: false}).attach()

Tracker.autorun(function() {
    document.title = Title.get()
})

home()
