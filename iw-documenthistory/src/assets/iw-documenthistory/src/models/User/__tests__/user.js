import { loadUser, getRequestorGroups, getDefaultCarrier, getDefaultShippingAddress } from './../user'
import { InsightUserObjectData } from './../__mocks__/InsightUserObject.js'
import { get, post } from './../../fetch'

// jest.enableAutomock()
jest.mock('./../../fetch/fetch', () => ({
    get: jest.fn(() => Promise.resolve()),
    post: jest.fn(() => Promise.resolve()),
}))

describe('User', () => {
    describe('loadUser', () => {
        it('Filters only properties we use, formats URLs, and sets the default numeral config', () => {
            window.InsightUserObject = {
                ready: jest.fn(() => Promise.resolve(InsightUserObjectData))
            }

            return loadUser().then(d => {
                // Using a snapshot here because it would otherwise be a manual
                // task of copying output then pasting it here as expected.
                expect(d).toMatchSnapshot()
            })
        })
    })

    describe('getRequestorGroups', () => {
        it('should make a GET request', () => {
            getRequestorGroups()
            expect(get).toBeCalledWith('/insightweb/ar/getRequestorGroup')
        })
    })

    describe('getDefaultCarrier', () => {
        it('should make a POST request', () => {
            getDefaultCarrier()
            expect(post).toBeCalledWith('transaction/getFreightCostByCarrier', '')
        })
    })

    describe('getDefaultShippingAddress', () => {
        it('should make a GET request', () => {
            getDefaultShippingAddress()
            expect(get).toBeCalledWith('transaction/getDefaultShippingAddress')
        })
    })
})
