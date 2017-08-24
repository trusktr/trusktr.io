rAF-timeout
===========

The setTimeout and setInterval functions re-made with requestAnimationFrame.

Why?
----

For performance.

Some libraries or code in an app might use window.setTimeout or
window.setInterval to run code that could run during the browser's paints,
possibly causing stutter. We can replace setTimeout and setInterval with
versions made using requestAnimationFrame to guarantee that logic in the app
runs at the most opportune time, giving the browser a chance to render things
smoothly.

If we make sure to apply this modification first before any other code runs,
then we can also lock the modified window.setTimeout and window.setInterval
properties so that other code doesn't redefine setTimeout or setInterval. 

For example, import raf-timeout in your entry point,

```js
import 'raf-timeout' // ES6
// or
require('raf-timeout') // CommonJS
```

or use the global,

```html
<script src="/path/to/node_modules/raf-timeout/global.js"></script>
```

then lock the properties.

```js
Object.defineProperty(window, 'setTimeout', {
    value: window.setTimeout,
    configurable: false,
    writable: false
})
Object.defineProperty(window, 'setInterval', {
    value: window.setInterval,
    configurable: false,
    writable: false
})
```

Caveats
-------

Since animation frames begin approximately every 16 milliseconds, using
setTimeout or setInterval with times of less than 16 milliseconds could result
in bunching of logic into the animation frames. In most cases this is probably
fine. Keep this in mind when using this modification.

Contributing
------------

Open an issue or PR if you have any ideas! :]
