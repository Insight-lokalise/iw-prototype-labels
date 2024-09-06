export function listen(type, fn) {
    // the listener function, which will invoke the `fn` parameter if the message
    // type matches, and it came from the same origin.
    const listener = event => {
        if (event.origin === window.location.origin && event.data.type && event.data.type.indexOf(type) === 0) {
            fn(event.data.data)
        }
    }

    window.addEventListener('message', listener)

    // return a function that the callee can use to cancel the event listener.
    return function cancelListener() {
        window.removeEventListener('message', listener)
    }
}

export function postMessage(type, data) {
    window.postMessage({ type, data }, window.location.origin)
}
