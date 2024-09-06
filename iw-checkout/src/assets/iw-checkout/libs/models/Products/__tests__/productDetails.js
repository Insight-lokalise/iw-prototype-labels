import { makeProductDetailURL } from './../productDetails'

let product

describe('Product Detail Page URL creation', () => {
    beforeEach(() => {
        // reset product after every test because tests will mutate it
        product = {
            description: 'Lenovo N22 Chromebook 80SF - 11.6" - Celeron N3050 - 4 GB RAM - 16 GB SSD',
            locale: 'en_US',
            materialId: '80SF0001US',
            mfrId: '80SF0001US',
            mfrName: 'LENOVO',
        }
    })

    it('Creates a correct URL', () => {
        const URL = makeProductDetailURL(product)
        const expectedURL= '/en_US/buy/product/80SF0001US/LENOVO/80SF0001US/Lenovo-N22-Chromebook-80SF-116-Celeron-N3050-4-GB-RAM-16-GB-SSD/'
        expect(URL).toBe(expectedURL)
    })

    it('Throws if a required field is not passed', () => {
        delete product.description
        expect(() => makeProductDetailURL(product)).toThrow(/missing/)
    })

    it('Creates URLs for different locales', () => {
        product.locale = 'en_CA'
        const URL = makeProductDetailURL(product)
        const expectedURL= '/en_CA/buy/product/80SF0001US/LENOVO/80SF0001US/Lenovo-N22-Chromebook-80SF-116-Celeron-N3050-4-GB-RAM-16-GB-SSD/'
        expect(URL).toBe(expectedURL)
    })

    it("Ignores \.,-\/#!$%\"\'\^&\*;:{}=\-_`~() and whitespaces from a product description", () => {
        product.description += "\.,-\/#!$%\"\'\^&\*;:{}=\-_`~()     \t\n \u0020"
        const URL = makeProductDetailURL(product)
        const expectedURL= '/en_US/buy/product/80SF0001US/LENOVO/80SF0001US/Lenovo-N22-Chromebook-80SF-116-Celeron-N3050-4-GB-RAM-16-GB-SSD/'
        expect(URL).toBe(expectedURL)
    })
})
