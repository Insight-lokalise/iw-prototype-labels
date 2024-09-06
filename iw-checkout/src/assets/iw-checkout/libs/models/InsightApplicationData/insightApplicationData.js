import numeral from 'numeral'

export function loadInsightApplicationData() {
    return window.InsightApplicationDataObject.ready()
        .then(applicationData => {
            let origin = document.location.protocol + "//" + document.location.host + (document.location.port ? ":" + document.location.port : "");
            let applicationRoot = applicationData.ApplicationRoot;

            // This is the primary place to set the default numeral formatting.
            // We should refactor the iw-currency component and prefer only one
            // place to set this default, maybe a method in model/Products/prices.
            numeral.defaultFormat(applicationData.CurrencyFormat)

            return {
                applicationRoot: applicationRoot,
                phoneText: applicationData.PhoneText,
                emailLinkBase: origin,
                emailLogoURL: 'https://www.insight.com/content/dam/insight/en_US/edm-template-images/update/edm-top-logo.gif',
                emailPrivacyPolicyURL: origin + applicationRoot + 'help/privacy-policy.html',
                emailReturnPolicyURL: origin + applicationRoot + 'help/return-policy.html',
                emailContactUsURL: origin + applicationRoot + 'about/contact-us.html?refcode=footer',
                emailEMEAContactUsURL: origin + applicationRoot + 'knowledge-base/contact-us.html',
                loginURL: origin + '/insightweb/login',
                sendEmailURL: applicationData.sendEmail,
                NumeralConfig: applicationData.applicationdata,
                CurrencyFormat: applicationData.CurrencyFormat,
            }
        })
}
