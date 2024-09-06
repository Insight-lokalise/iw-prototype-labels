import { isValidMaterials, hasManufaturerProducts, hasInvalidMaterials } from './../quickshop'

describe('QuickShop model', () => {
    describe('hasInvalidMaterials', () => {
        it('should detect an invalidMaterialIds array with items in it', () => {
            const hasInvalid = hasInvalidMaterials({
                invalidMaterialIds: [1, 2, 3],
            })
            const notHasInvalid = hasInvalidMaterials({
                invalidMaterialIds: [],
            })
            expect(hasInvalidMaterials({})).toBe(false)
            expect(hasInvalid).toBe(true)
            expect(notHasInvalid).toBe(false)
        })

        it('should handle invalid input', () => {
            expect(hasInvalidMaterials({
                invalidMaterialIds: null,
            })).toBe(false)

            expect(hasInvalidMaterials({
                invalidMaterialIds: 'stringy',
            })).toBe(false)
        })
    })
    describe('hasManufaturerProducts', () => {
        it('should detect a duplicateManufaturerProductsMap with keys in it', () => {
            const hasDuplicates = hasManufaturerProducts({
                duplicateManufaturerProductsMap: { key: 'value' },
            })
            const notHasDuplicates = hasManufaturerProducts({
                duplicateManufaturerProductsMap: {},
            })
            expect(hasManufaturerProducts({})).toBe(false)
            expect(hasDuplicates).toBe(true)
            expect(notHasDuplicates).toBe(false)
        })

        it('should handle invalid input', () => {
            // TODO Yaswanth, I'm not sure if the top two test are actually invalid
            // input. What does the response look like now? Array or Object?
            const invalidString = hasManufaturerProducts({
                duplicateManufaturerProductsMap: 'stringy',
            })
            const invalidArray = hasManufaturerProducts({
                duplicateManufaturerProductsMap: [42],
            })
            const invalidNum = hasManufaturerProducts({
                duplicateManufaturerProductsMap: 2,
            })
            expect(invalidString).toBe(true)
            expect(invalidArray).toBe(true)
            expect(invalidNum).toBe(false)
        })
    })
})
