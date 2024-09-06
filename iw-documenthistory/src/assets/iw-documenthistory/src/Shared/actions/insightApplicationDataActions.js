/* eslint-disable import/prefer-default-export */
import { LOAD_INSIGHT_APPLICATION_DATA } from '../types'

export function loadInsightApplicationData() {
  return dispatch =>
    getInsightApplicationData().then(appData => {
      dispatch({
        type: LOAD_INSIGHT_APPLICATION_DATA,
        payload: appData,
      })
    })
}

export function getInsightApplicationData() {
  // window.InsightApplicationDataObject is a jQuery deferred Object and does
  // not have the same API as native Promises. We convert it here to maintain
  // consistency in our apps.
  const promise = new Promise((res, rej) => {
    window.InsightApplicationDataObject
      .ready()
      .fail(rej)
      .then(res)
  })

  return promise.then(applicationData => {
    const {
      ApplicationRoot: applicationRoot,
      PhoneText: phoneText,
      HomePath,
      sendEmail,
      applicationdata,
      CurrencyFormat,
    } = applicationData
    const { location: { protocol, host, port } } = document

    const origin = `${protocol}//${host}${port ? `:${port}` : ''}`

    return {
      applicationRoot,
      phoneText,
      emailLinkBase: origin,
      emailLogoURL: 'https://www.insight.com/content/dam/insight/en_US/edm-template-images/update/edm-top-logo.gif',
      emailPrivacyPolicyURL: origin + applicationRoot + 'help/privacy-policy.html',
      emailReturnPolicyURL: origin + applicationRoot + 'help/return-policy.html',
      emailContactUsURL: origin + applicationRoot + 'about/contact-us.html?refcode=footer',
      emailEMEAContactUsURL: origin + applicationRoot + 'knowledge-base/contact-us.html',
      loginURL: origin + '/insightweb/login',
      scoURL:  origin + '/what-we-do/supply-chain-optimisation/manage',
      sendEmailURL: sendEmail,
      NumeralConfig: applicationdata,
      CurrencyFormat,
    }
  })
}
