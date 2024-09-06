import 'whatwg-fetch'

/**
 * FireFox has an issue with request cache, and cache is currently set to
 * no-cache on fetch, we will come back to it and see how this can be
 * addressed, this also needs some understanding of our REST API,
 * since our's is not true REST ex: getcart
 * https://developer.mozilla.org/en-US/docs/Web/API/Request/cache#Browser_compatibility
 * @param  {[type]} url          [description]
 * @param  {Object} [options={}] [description]
 * @return {[type]}              [description]
 */
export function _fetch(url, options = {}) {
  if (typeof options.body === 'object' && !options.isFile) {
    try {
      options.body = JSON.stringify(options.body)
    } catch (error) {
      console.error('Error stringifying fetch body:', error)
      return
    }
  }

  const defaultFetchOptions = {
    json: true,
    cache: 'no-cache', // refer to the notes above
    credentials: 'include', // include cookies
    headers: {
      Accept: 'application/json; charset=UTF-8',
    },
  }

  if (!options.isFile) {
    defaultFetchOptions.headers['Content-Type'] = 'application/json; charset=UTF-8'
  }

  const fetchOptions = {
    ...defaultFetchOptions,
    ...options,
    headers: {
      ...defaultFetchOptions.headers,
      ...options.headers,
    },
  }

  return fetchOptions.json
    ? window
        .fetch(url, fetchOptions)
        .then(r => {
          if (r.status >= 200 && r.status < 300) {
            return r.json()
          } else {
            console.log('Fetch failed with status', r.status, 'to:', r.url)
            throw Error('HTTP status:' + r.status)
          }
        })
        .then(r => {
          if (r && r.InsightError) {
            // This would be the place for generic error sniffing and routing
            // back to us. This type of functionality is super powerful for
            // monitoring production errors.
            const error = Error(JSON.stringify(r.InsightError))
            error.name = 'Insight Error'
            throw error
          }
          return r
        })
    : window.fetch(url, fetchOptions)
}

export function get(url, options) {
  return _fetch(url, options)
}

// since delete is a keyword, using del
export function del(url, options) {
  return _fetch(url, {
    method: 'DELETE',
    ...options,
  })
}

export function post(url, _body, options = {}) {
  if (_body === undefined) throw Error(`No body in POST to ${url}`)
  return _fetch(url, {
    method: 'POST',
    body: _body,
    ...options,
  })
}
