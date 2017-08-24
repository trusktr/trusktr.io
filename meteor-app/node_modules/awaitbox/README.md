awaitbox
========

A box of useful things to await in async functions.

DOM
---

Things in `awaitbox/dom` are for the browser.

### documentReady()

Await for this in order to run code after the DOM has been parsed and loaded
(but not sub-resources like images, scripts, etc).

```js
import documentReady from 'awaitbox/dom/documentReady'

async function main() {
    await documentReady()
    console.log('Document ready!')
}

main()
```

### windowLoaded()

Await for this in order to run code after the DOM's sub-resources have been
loaded (images, scripts, etc).

```js
import windowLoaded from 'awaitbox/dom/windowLoaded'

async function main() {
    await windowLoaded()
    console.log('Window loaded!')
}

main()
```

Meteor
------

The things in `awaitbox/meteor` are for use in [Meteor](http://meteor.com).

### startup()

Await this to run code after Meteor is ready (client and server). On the
client, this is similar to [documentReady](#documentready). See the [meteor
docs](http://docs.meteor.com/#/full/meteor_startup).

```js
import meteorStartup from 'awaitbox/meteor/startup'

async function main() {
    await meteorStartup()
    console.log('Meteor (and DOM) ready!')
}

main()
```

Timers
------

### sleep()

Await for a certain amount of time.

```js
import sleep from 'awaitbox/timers/sleep'

async function main() {
    await sleep(10000)
    console.log('Logged after 10000 milliseconds!')
}

main()
```

Contributing
------------

Please open an issue or PR if you have any ideas! :]
