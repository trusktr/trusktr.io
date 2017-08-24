![JSS logo](https://avatars1.githubusercontent.com/u/9503099?v=3&s=60)

## JSS plugin that enables inheritance

This plugin implements a custom `extend` style property.

[Demo](http://jsstyles.github.io/examples/index.html#plugin-jss-extend) -
[JSS](https://github.com/jsstyles/jss)

[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/jsstyles/jss?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Value of `extend` property can be a string, object and array. If string is used, it will look for a rule with such a name. If object - plain rule object is expected, if array - an array of plain rule obejcts is expected.


## Usage examples

```javascript
import jss from 'jss'
import extend from 'jss-extend'

// Setup jss plugins.
jss.use(extend())

const sheet = jss.createStyleSheet({
  redContainer: {
    background: 'red'
  },
  container: {
    extend: 'redContainer',
    'font-size': '20px'
  }
})

const redContainer = {
  background: 'red'
}
const sheet = jss.createStyleSheet({
  container: {
    extend: redContainer, // Can be an array of styles
    'font-size': '20px'
  }
})

// Without `extend`, using ES7.
const sheet = jss.createStyleSheet({
  container: {
    ...redContainer,
    'font-size': '20px'
  }
})

console.log(sheet.toString())
```

```css
.jss-0-0 {
  background: red;
  font-size: 20px;
}
```

```javascript
console.log(sheet.classes)
```
```javascript
{container: 'jss-0-0'}
```

## Issues

File a bug against [jsstyles/jss prefixed with \[jss-extend\]](https://github.com/jsstyles/jss/issues/new?title=[jss-extend]%20).

## Run tests

```bash
npm i
npm run test
```

## License

MIT
