import { loadInsightApplicationData } from './model'
import { insightApplicationData } from './__mocks__/InsightApplicationDataObject'

/**
 * NOTE window.document is particularly hard to mock because it is a frozen global
 * property. See approaches:
 *      https://github.com/facebook/jest/issues/2297
 *      https://github.com/facebook/jest/issues/2098
 */
describe('loadInsightApplicationData', () => {
  test('Filters only properties we use and formats URLs', () => {
    const expected = {
      applicationRoot: '/content/insight-web/en_US/',
      phoneText: '1-800-INSIGHT',
      emailLinkBase: 'http://localhost',
      emailLogoURL: 'https://www.insight.com/content/dam/insight/en_US/edm-template-images/update/edm-top-logo.gif',
      emailPrivacyPolicyURL: 'http://localhost/content/insight-web/en_US/help/privacy-policy.html',
      emailReturnPolicyURL: 'http://localhost/content/insight-web/en_US/help/return-policy.html',
      emailContactUsURL: 'http://localhost/content/insight-web/en_US/about/contact-us.html?refcode=footer',
      emailEMEAContactUsURL: 'http://localhost/content/insight-web/en_US/knowledge-base/contact-us.html',
      scoURL: 'http://localhost/what-we-do/supply-chain-optimisation/manage',
      sendEmailURL: '/insightweb/report/sendEmail',
      CurrencyFormat: '$0,0.00',
    }

    global.InsightApplicationDataObject = {
      ready: jest.fn(() => {
        const promise = Promise.resolve(insightApplicationData)
        // mock jQuery's deferred Object's 'fail' functionality.
        promise.fail = promise.catch
        return promise
      }),
    }

    return loadInsightApplicationData().then(d => {
      expect(d).toMatchObject(expected) // may be a good usecase for snapshot
    })
  })
})
