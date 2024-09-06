import { exportAsXLS, updateMiniCart } from './../orderUtilities'

describe('Order Utilities', () => {
    describe('exportAsXLS', () => {
        it('should open a new page via window.assign', () => {
            window.location.assign = jest.fn()
            exportAsXLS()
            expect(window.location.assign).toBeCalledWith('null/insightweb/transaction/exportCart')
        })
    })

    describe('updateMiniCart', () => {
        it('should update the miniCart and set the innerHTML of the .cart-total', () => {
            const newCart = { totalCost: 1337 }
            let innerHTML = 'html'
            let container = { innerHTML }
            window.InsightNav = {
                ShowMiniCart: jest.fn(),
            }
            document.querySelector = jest.fn(() => container)
            // TODO mock numeral so that the test isn't dependent on its implementation
            // jest.mock('numeral', () => (value) => ({
            //     format: jest.fn(() => 'radians')
            // }))

            updateMiniCart(newCart)
            expect(window.InsightNav.ShowMiniCart).toBeCalledWith(newCart)
            expect(container.innerHTML).toBe('1,337')
        })
    })
})
