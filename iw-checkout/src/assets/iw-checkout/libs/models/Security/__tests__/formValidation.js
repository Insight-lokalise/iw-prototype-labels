import {validateEmail, validatePhoneNumber, validateZipcode} from './../validation'

describe('Validators', () => {
    describe('Email validation', () => {
        it('should recognize valid email addresses', () => {
            expect(validateEmail('name@site.com')).toBe(true)
            expect(validateEmail('first.last@site.com')).toBe(true)
            expect(validateEmail('name+insight@site.com')).toBe(true)

            // just so we know this is current behavior
            expect(validateEmail('&@+.2')).toBe(true)
            expect(validateEmail('123213@12321.1231')).toBe(true)
        })

        it('should catch invalid input', () => {
            expect(validateEmail('')).toBe(false)
            expect(validateEmail('name')).toBe(false)
            expect(validateEmail('name@site')).toBe(false)
            expect(validateEmail('@site')).toBe(false)
            expect(validateEmail('@site.com')).toBe(false)
        })
    })

    describe('ZipCode validation', () => {
        it('defaults to the US zipcode pattern', () => {
            expect(validateZipcode({ zipcode: '12345', countryCode: 'CA' })).toBe(false)

            // given the above tests, this would be invalid if not validated as a US zipcode
            expect(validateZipcode({ zipcode: '12345' })).toBe(true)
        })

        it('recognizes valid US zipcodes', () => {
            expect(validateZipcode({ zipcode: '12345' })).toBe(true)
            expect(validateZipcode({ zipcode: '12345-6789' })).toBe(true)
        })

        it('recognizes invalid US zipcodes', () => {
            expect(validateZipcode({ zipcode: '' })).toBe(false)
            expect(validateZipcode({ zipcode: 'abcde' })).toBe(false)
            expect(validateZipcode({ zipcode: '1234' })).toBe(false)
            expect(validateZipcode({ zipcode: '123456' })).toBe(false)
            expect(validateZipcode({ zipcode: '12+34' })).toBe(false)
        })

        it('ignores validating APAC zipcodes', () => {
            expect(validateZipcode({ isApac: true })).toBe(true)
        })
    })
    describe('Phone validation', () => {
        const validUSPhone = (isAPAC, expected) => {
          expect(validatePhoneNumber({phoneNumber:'555-555-5555', isAPAC: isAPAC})).toBe(expected)
          expect(validatePhoneNumber({phoneNumber:'(555)-555-5555', isAPAC: isAPAC})).toBe(expected)
          expect(validatePhoneNumber({phoneNumber:'(555).555.5555', isAPAC: isAPAC})).toBe(expected)
          expect(validatePhoneNumber({phoneNumber:'5555555555', isAPAC: isAPAC})).toBe(expected)
        }
        const validApacPhone = (isAPAC, expected) => {
          expect(validatePhoneNumber({phoneNumber:'+61 2 8978 2000', isAPAC: isAPAC})).toBe(expected)
          expect(validatePhoneNumber({phoneNumber:'+61 02 8978 2000', isAPAC: isAPAC})).toBe(expected)
          expect(validatePhoneNumber({phoneNumber:'+(61) 2 8978 2000', isAPAC: isAPAC})).toBe(expected)
          expect(validatePhoneNumber({phoneNumber:'61 2 8978 2000', isAPAC: isAPAC})).toBe(expected)
          expect(validatePhoneNumber({phoneNumber:'63 908 589 1216', isAPAC: isAPAC})).toBe(expected)
          expect(validatePhoneNumber({phoneNumber:'639085891216', isAPAC: isAPAC})).toBe(expected)
          expect(validatePhoneNumber({phoneNumber:'+639085891216', isAPAC: isAPAC})).toBe(expected)
          expect(validatePhoneNumber({phoneNumber:'+(63)9085891216', isAPAC: isAPAC})).toBe(expected)
          expect(validatePhoneNumber({phoneNumber:'+63.2.88910000', isAPAC: isAPAC})).toBe(expected)
          expect(validatePhoneNumber({phoneNumber:'63.2.8888-1888', isAPAC: isAPAC})).toBe(expected)
        }
        it('recognize valid us phone', () => {
          validUSPhone(false, true)
        })
        it('recognize invalid us phone', () => {
          expect(validatePhoneNumber({phoneNumber:'555-555555', isAPAC: false})).toBe(false)
          expect(validatePhoneNumber({phoneNumber:'+5555555555', isAPAC: false})).toBe(false)
          validApacPhone(false, false)
        })
        it('recognize valid apac phone', () => {
          validApacPhone(true, true)
        })
        it('recognize invalid apac phone', () => {
          expect(validatePhoneNumber({phoneNumber:'5555 555-555555', isAPAC: true})).toBe(false)
          expect(validatePhoneNumber({phoneNumber:'+55555555555555', isAPAC: true})).toBe(false)
          validUSPhone(true, false)
        })
    })
})
