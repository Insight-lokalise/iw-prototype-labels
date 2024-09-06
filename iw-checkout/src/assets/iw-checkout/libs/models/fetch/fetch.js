// import promise from 'es6-promise'; promise.polyfill();
import 'whatwg-fetch'
import { currentLocale } from './../User/locale'
/**
 * FireFox has an issue with request cache, and cache is currently set to
 * no-cache on fetch, we will come back to it and see how this can be
 * addressed, this also needs some understading of our REST API,
 * since our's is not true REST ex: getcart
 * https://developer.mozilla.org/en-US/docs/Web/API/Request/cache#Browser_compatibility
 * @param  {[type]} url          [description]
 * @param  {Object} [options={}] [description]
 * @return {[type]}              [description]
 */
export function _fetch(url, options = {}) {
    if (typeof options.body === 'object') {
        try {
            if (!options.isFile) {
                options.body = JSON.stringify(options.body)
            }
        } catch (error) {
            console.error('Error stringifying fetch body:', error)
            return
        }
    }
    const defaultFetchOptions = {
        json: true,
        cache: 'no-cache', // refer to the notes above
        locale: currentLocale(),
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
    
    function ErrorWithStatusCode(message, statusCode) {
        this.name = "ErrorWithStatusCode";
        this.message = (message || "");
        this.statusCode = statusCode;
    }
    ErrorWithStatusCode.prototype = Error.prototype;

    return fetchOptions.json
        ? self.fetch(url, fetchOptions)
            .then(r => {
                if (r.status >= 400) {
                    console.log('Fetch failed with status', r.status, 'to:', r.url)
                    throw new ErrorWithStatusCode('HTTP status:' + r.status, r.status)
                } else {
                    return r
                }
            })
            .then(r => r.json())
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
        : self.fetch(url, fetchOptions)
}

export function get(url, options) {
    return _fetch(url, options)
}

// since delete is keyword, using del
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
