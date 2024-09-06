import { isQuoteExpired } from './helpers'

describe('Should identify expired date', () => {
  it('Expired date', async () => {
    expect(isQuoteExpired('01/12/2022')).toBeTruthy()
    expect(isQuoteExpired('02/12/2022')).toBeTruthy()
    expect(isQuoteExpired('02/12/2021')).toBeTruthy()
    expect(isQuoteExpired('02/12/2099')).toBeFalsy()
    expect(isQuoteExpired('01/24/2022')).toBeTruthy()
  })
})
