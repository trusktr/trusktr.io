// Import this if you want to polyfill things like Promise, Object.values(),
// etc. Includes Facebook Regenerator if you're using generators or async
// functions.
import 'babel-polyfill'

// DOM
import * as dom from './dom'

// Timers
import * as timers from './timers'

export {
    dom,
    timers,
}
