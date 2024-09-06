import { makeUniqueCartItemId } from './../cart'

describe('Cart', () => {
    // Choosing not to test most cart model functionality.
    // The backend APIs may change in a couple months and these functions only make
    // simple requests.

    describe('makeUniqueCartItemId', () => {
        it('should create an ID of shape contract__materialIDKey', () => {
            expect(makeUniqueCartItemId({ materialIDKey: '1' })).toBe('__1')
            expect(makeUniqueCartItemId({ contractID: 'ABC', materialIDKey: '2' })).toBe('ABC__2')
        })
    })
})
