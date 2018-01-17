
@awaitbox/document-ready
========================

Await for the `document` to be ready.

#### `npm i @awaitbox/document-ready --save`

The `documentReady` async function returns a promise that will resolve when the
`DOMContentLoaded` event fires in the future (i.e. when the `document` becomes
"ready", a term that jQuery made popular), or resolves immediately if
`DOMContentLoaded` already happened. Sub-resources (img tags, scripts, audio
tags, etc) might not be done loading yet, and in this case you'll want to use
[window-loaded](https://github.com/awaitbox/window-loaded).

Learn more about the `DOMContentLoaded` event [on
MDN](https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded).

You can use it in async functions:

```js
import documentReady from '@awaitbox/document-ready'

async function main() {
  await documentReady()
  console.log( 'Ready to begin awesome!' )
}

main()
```

You can of course use it as a Promise:

```js
import documentReady from '@awaitbox/document-ready'

documentReady()
  .then( data => console.log( 'begin awesome!' ) )
```

Chain values will pass through if you use it in a Promise chain:

```js
import documentReady from '@awaitbox/document-ready'

fetch( ... )
  .then( ... )
  .then( documentReady ) // passes data through
  .then( data => console.log( 'use data for the awesome!', data ) )
```

Note
----

This is written in ES2016 JavaScript. To use this in pre-ES2016 environments,
you'll need to run this through a transpiler like [Babel](http://babeljs.io)
(and I recommend using the
[fast-async](https://github.com/MatAtBread/fast-async) plugin to get the best
results). See some tips here on wiring it up with
[Webpack](https://webpack.js.org): http://2ality.com/2017/06/pkg-esnext.html.
