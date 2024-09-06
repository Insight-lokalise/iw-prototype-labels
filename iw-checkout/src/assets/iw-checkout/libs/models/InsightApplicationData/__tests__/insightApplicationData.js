import numeral from 'numeral'

import { loadInsightApplicationData } from './../'
import { insightApplicationData } from './../__mocks__/InsightApplicationDataObject'

jest.mock('numeral')

/**
 * NOTE window.document is particularly hard to mock because it is a frozen global
 * property. See approaches:
 *      https://github.com/facebook/jest/issues/2297
 *      https://github.com/facebook/jest/issues/2098
 */
describe('loadInsightApplicationData', () => {
    test('Filters only properties we use, formats URLs, and sets the default numeral config', () => {
        const expected = {
            applicationRoot: '/content/insight-web/en_US/',
            phoneText: '1-800-INSIGHT',
            emailLinkBase: 'about://',
            emailLogoURL: 'https://www.insight.com/content/dam/insight/en_US/edm-template-images/update/edm-top-logo.gif',
            emailPrivacyPolicyURL: 'about:///content/insight-web/en_US/help/privacy-policy.html',
            emailReturnPolicyURL: 'about:///content/insight-web/en_US/help/return-policy.html',
            emailContactUsURL: 'about:///content/insight-web/en_US/about/contact-us.html?refcode=footer',
            emailEMEAContactUsURL: 'about:///content/insight-web/en_GB/knowledge-base/contact-us.html',
            loginURL: '/insightweb/login',
            sendEmailURL: '/insightweb/report/sendEmail',
            CurrencyFormat: '$0,0.00',
        }

        numeral.defaultFormat = jest.fn()
        global.InsightApplicationDataObject = {
            ready: jest.fn(() => Promise.resolve(insightApplicationData))
        }

        return loadInsightApplicationData().then(d => {
            expect(d).toMatchObject(expected) // may be a good usecase for snapshot
            expect(numeral.defaultFormat).toBeCalledWith('$0,0.00')
        })
    })
})
