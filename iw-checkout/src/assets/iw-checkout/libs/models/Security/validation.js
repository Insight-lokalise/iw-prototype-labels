import { validateEmail as validateEmailToolkit, validateZipcode as validateZipcodeToolkit, validatePhoneNumber as validatePhoneNumberToolkit } from '@insight/toolkit-utils'

export function validateEmail(email) {
    return validateEmailToolkit(email)
}

/**
 * Validates each email in a comma-separated string of emails
 * @param  {String} emails comma-separated or semi-colon separated list of emails
 * @return {Boolean}        Whether every email in the string is valid.
 */
export function validateEmails(emails) {
    const separator = emails.includes(';') ? ';' : ','
    if (emails) {
        return emails.split(separator).every(email => validateEmail(email));
    }
    return false;
}

/**
 * validates zipcode with provided countryCode
 * APAC will be short circuit scenario (Asia Pacific)
 * @param  {String} zipcode          Zipcode to validate
 * @param  {String} [countryCode='US'] User's set countryCode
 * @param  {Boolean} [isApac=false]    whether user is in APAC
 * @return {Boolean}                 Whether zipcode is valid
 */
export function validateZipcode({ zipcode, countryCode = 'US', isApac = false, isEMEA = false, zipCodeLength = 5 }) {
    //note: zipCodeLength is currently not used from existing logic. I think because US can be 5 to 10 digits, not just one.
    //note: addressCountryCode is combined into countryCode, no point having two country code params
    return validateZipcodeToolkit({ zipcode, countryCode, isApac, isEMEA })
}


export function validatePhoneNumber({ phoneNumber, isAPAC, isEMEA}) {        
    return validatePhoneNumberToolkit({ phoneNumber, isAPAC, isEMEA})
}
