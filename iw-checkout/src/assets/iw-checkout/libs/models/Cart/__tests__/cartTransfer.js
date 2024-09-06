import 'whatwg-fetch'
import { fetchTransferCart } from './../cartTransfer'

jest.mock('./../../User/locale')
// jest.mock('whatwg-fetch')

describe('B2B Cart Transfer', () => {
    beforeEach(() => {
        window.fetch.mockClear()
    })

    describe('fetchTransferCart', () => {
        it('should post the payload omitting eProcType', () => {
            fetchTransferCart({ eProcType: 'CX', payload: 'data' })
            expect(window.fetch.mock.calls[0][1].body).toMatch(JSON.stringify({ payload: 'data' }))
            expect(window.fetch.mock.calls[0][1].body).not.toMatch(JSON.stringify({ eProcType: 'CX' }))
        })

        it('should change url depending on eProcType', () => {
            fetchTransferCart({ eProcType: 'CX' })
            expect(window.fetch.mock.calls[0][0]).toBe('/insightweb/b2b/cxml/transferCart')
            window.fetch.mockClear()

            fetchTransferCart({ eProcType: 'EB' })
            expect(window.fetch.mock.calls[0][0]).toBe('/insightweb/b2b/oci/transferOCICart')
            window.fetch.mockClear()

            fetchTransferCart({ eProcType: 'OA' })
            expect(window.fetch.mock.calls[0][0]).toBe('/insightweb/b2b/oag/transferOagCart')
            window.fetch.mockClear()

            expect(() => fetchTransferCart({ eProcType: 'ERROR' })).toThrow()
        })
    })
})
