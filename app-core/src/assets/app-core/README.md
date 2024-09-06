  # App-Core

App Core is used to be the core for all of the web-apps on Insight.com. It handles providing the same version of our libraries to our apps as well as exports some common functionality between them. 


## Shared Libs 

`React`
`ReactDOM`
`ToolkitReact`
`ToolkitCSS`

## Exposed Methods

### registerModule(name<String>,module?<Object|Promise>)

This method lets you register other modules to be globally available from app-core. There are a couple ways to use it. The default way is with an object

```js
const myExposedModule = {
    fn1: () => {},
    fn2: () => {}
}
registerModule('name', myExposedModule)
```

You can also provide a resourceURL to name: (This is not supported yet)

```js
registerModule('https://myscripturl.com')
```

Or finally provide a promise as mod
```js
const scriptPromise = () => {
    return fetch('my-url').then(resource => resource.text())
}
registerModule('my-mod'. scriptPromise)
```

## triggerExternalAction(methodName<String>, ...payload)

This is the second part to registerModule. It calls a provided named function with the arguments that follow.

So say we register a function..

```js
const myModule = {
    fn1: (arg) => console.log(arg)
}
registerModule('test', myModule)
```

In another project we can call it like so
```js
import { triggerExternalAction } from '@insight/app-core'

function() {
    triggerExternalAction('fn1',{ key: '', value: '' })
}
```

`Note: There is no deep namespacing for now. This system will eventually be replaced and will support namespacing better in the future. Right now all method names should be unique.
