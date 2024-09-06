import 'whatwg-fetch'

import { get, post, _fetch } from './../fetch'
import { currentLocale } from './../../User/locale'

jest.mock('./../../User/locale') // mock currentLocale()

describe('Fetch', () => {
    beforeEach(() => {
        window.fetch.mockClear()
    })

    describe('_fetch', () => {
        it('should use default fetch options, ammended by provided options', () => {
            _fetch('/test')

            expect(window.fetch).toBeCalledWith('/test', {
                json: true,
                cache: 'no-cache',
                locale: 'en_US',
                credentials: 'include', // includes cookies in all requests
                headers: {
                    Accept: 'application/json; charset=UTF-8',
                    'Content-Type': 'application/json; charset=UTF-8',
                },
            })
        })

        it('should amend default fetch options with provided options', () => {
            _fetch('/test', {
                method: 'POST',
                cache: 'reload',
                headers: {
                    'Content-Type': 'application/xml',
                    newHeader: 'test value',
                },
            })

            expect(window.fetch).toBeCalledWith('/test', {
                method: 'POST',
                json: true,
                cache: 'reload',
                locale: 'en_US',
                credentials: 'include', // includes cookies in all requests
                headers: {
                    Accept: 'application/json; charset=UTF-8',
                    'Content-Type': 'application/xml',
                    newHeader: 'test value',
                },
            })
        })

        it('should stringify options.body Objects', () => {
            const body = { key: 'value' }
            const bodyAsJSON = '{ "key": "value" }'
            window.JSON.stringify = jest.fn(() => bodyAsJSON)

            _fetch('/test', { body, method: 'POST' })

            expect(window.JSON.stringify).toBeCalledWith(body)
            window.JSON.stringify.mockReset()
        })

        it('should warn if options.body can\'t be stringified', () => {
            const body = { key: 'value' }
            const error = Error('Invalid JSON')
            window.JSON.stringify = jest.fn(() => { throw error })
            window.console.error = jest.fn()

            _fetch('/test', { body, method: 'POST' })

            expect(window.console.error).toBeCalledWith('Error stringifying fetch body:', error)
            window.JSON.stringify.mockReset()
        })

        it('should get the current locale', () => {
            _fetch('/test')
            expect(currentLocale).toBeCalled()
        })

        // TODO mock the r.json() call of _fetch.
        it('should deserialize a respose as JSON if !!options.json', () => {
            const resolveWith = {
                json: jest.fn(() => ({}))
            }
            window.fetchResolveOnceWith(resolveWith)
            return _fetch('/test')
                .then(() => expect(resolveWith.json).toBeCalled())
        })

        it('should throw if a response has an InsightError property', () => {
            window.fetchResolveOnceWith({
                json: jest.fn(() => ({
                    InsightError: { error: 'Invalid body' }
                }))
            })
            return _fetch('/test')
                .catch(error => {
                    return expect(error.name).toContain('Insight Error')
                })
        })

        it('should not deserialize a respose as JSON if !options.json', () => {
            const resolveWith = {
                json: jest.fn(() => ({}))
            }
            window.fetchResolveOnceWith(resolveWith)

            return _fetch('/test', { json: false })
                .then(() => expect(resolveWith.json).not.toBeCalled())
        })
    })
    describe('get', () => {
        it('should passthrough its call to _fetch', () => {
            const options = {
                headers: {
                    'Content-Type': 'application/xml',
                    newHeader: 'test value',
                },
            }
            const expectedOptions = {
                json: true,
                cache: 'no-cache',
                locale: 'en_US',
                credentials: 'include', // includes cookies in all requests
                headers: {
                    Accept: 'application/json; charset=UTF-8',
                    'Content-Type': 'application/xml',
                    newHeader: 'test value',
                },
            }
            return get('/test', options)
                .then(() => expect(window.fetch).toBeCalledWith('/test', expectedOptions))
        })
    })
    describe('post', () => {
        it('should passthrough call to _fetch', () => {
            const options = {
                headers: {
                    'Content-Type': 'application/xml',
                    newHeader: 'test value',
                },
            }
            const expectedOptions = {
                method: 'POST',
                body: JSON.stringify({ key: 'value' }),
                json: true,
                cache: 'no-cache',
                locale: 'en_US',
                credentials: 'include', // includes cookies in all requests
                headers: {
                    Accept: 'application/json; charset=UTF-8',
                    'Content-Type': 'application/xml',
                    newHeader: 'test value',
                },
            }
            return post('/test', { key: 'value' }, options)
                .then(() => expect(window.fetch).toBeCalledWith('/test', expectedOptions))
        })

        it('should throw if no body is passed', () => {
            expect(() => post('/test')).toThrow(/No body in POST/)
        })
    })
})
