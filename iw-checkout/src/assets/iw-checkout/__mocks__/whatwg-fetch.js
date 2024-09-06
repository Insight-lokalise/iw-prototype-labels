let rejectWith
let resolveWith

// NOTE See models/fetch/__tests__/fetch.js for example usage.
window.fetch = jest.fn(() => {
    if (resolveWith != null) {
        // console.log('resolving to:', resolveWith)
        const resolution = Promise.resolve(resolveWith)
        resolveWith = null
        return resolution
    }

    if (rejectWith != null) {
        const rejection = Promise.reject(rejectWith)
        rejectWith = null
        return rejection
    }
    return Promise.resolve({
        json: jest.fn(() => ({}))
    })
})

window.fetchResolveOnceWith = (_resolveWith) => {
    resolveWith = _resolveWith
}

window.fetchRejectOnceWith = (_rejectWith) => {
    rejectWith = _rejectWith
}
