// Provide all of the polyfills that will not be handled by babel regardless of
// whether it is legacy or modern mode

const polyfills = []

if (!window.fetch) {
    polyfills.push(import(
        /* webpackChunkName: 'polyfill-fetch' */
        'whatwg-fetch'
    ))
}

if (!window.requestIdleCallback) {
    polyfills.push(import(
        /* webpackChunkName: 'polyfill-idlecallback' */
        'requestidlecallback-polyfill'
    ))
}

if (!window.requestAnimationFrame) {
    polyfills.push(import(
        /* webpackChunkName: 'polyfill-animationframe' */
        'raf'
    ))
}

if (!window.shadowDOM || !window.customElements) {
    polyfills.push(import(
        /* webpackChunkName: 'polyfill-webcomponens' */
        '@webcomponents/webcomponentsjs/webcomponents-bundle.js'
    ))
}

export default function loadPolyfills() {
    return Promise.all(polyfills)
}

