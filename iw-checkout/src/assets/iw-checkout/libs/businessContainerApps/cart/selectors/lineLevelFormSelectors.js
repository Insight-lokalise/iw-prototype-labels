import { createSelector } from 'reselect'
import get from 'lodash-es/get'

import { selector_userInformation } from '../../../User/selectors'
import { selector_softwareVarientConfigFields, selector_isSharedUser } from '../../../Cart/selectors'

export const selector_form = state => get(state, 'form', {})

const formNamesString = state => JSON.stringify(Object.keys(state.form))

function parseAndFilterOutLineLevelFormNames(formNamesString) {
    return JSON.parse(formNamesString).filter(name => name.startsWith('lineLevelForm__') || name.startsWith('AdditionalInfoForm') )
}

export const selector_lineLevelFormNames = createSelector(formNamesString, parseAndFilterOutLineLevelFormNames)

export const selector_lineLevelFormNamesInBundle = (state, item) => {
    return selector_lineLevelFormNames(state).filter(name =>
        name.startsWith(`lineLevelForm__${item.contractID}__${item.materialID}`)
    )
}

const selector_registeredFieldsArray = (state, formName) =>
    Object.keys(get(selector_form(state), [formName, 'registeredFields'], []))

function hasRegisterdLicenseInfoField(registeredFieldsArray) {
    return registeredFieldsArray.filter(field => field.startsWith('licenseInformation.')).length > 0
}

export const selector_hasMultipleLicenseInfoForms = state => {
    return (
        selector_lineLevelFormNames(state).reduce((acc, curr) => {
            if (hasRegisterdLicenseInfoField(selector_registeredFieldsArray(state, curr))) {
                acc++
            }
            return acc
        }, 0) > 1
    )
}

export function selector_defaultCountryOfUsage(state) {
    const primaryDefaultCountryOfUsage = get(state, ['user', 'defaultShippingAddress', 'shippingCountry'], '').trim()
    const secondaryDefaultCountryOfUsage = get(state, ['user', 'userInformation', 'CountryCode'], '').trim()
    return primaryDefaultCountryOfUsage || secondaryDefaultCountryOfUsage
}

function createUserContactInformationObject(userInformation) {
    const contactEmail = userInformation.Email || ''
    const contactPhoneNumber = userInformation.PhoneNumber || ''
    const contactFirstName = userInformation.FirstName || ''
    const contactLastName = userInformation.LastName || ''

    const contactName =
        contactFirstName && contactLastName
            ? `${contactFirstName} ${contactLastName}`
            : `${contactFirstName}${contactLastName}`
    return {
        contactEmail,
        contactName,
        contactPhoneNumber,
    }
}

export const selector_userContactInformation = createSelector(
    selector_userInformation,
    createUserContactInformationObject
)

function createSoftwareContactInformationObject(softwareVarientConfigFields) {
    // softwareVCFields in cart is populated with webLoginProfile when softwareVCFields
    // not populated in CMT
    const contactEmail = softwareVarientConfigFields.vcInfoUserEmail || ''
    const contactPhoneNumber = softwareVarientConfigFields.vcInfoUserPhoneNumber || ''
    const contactName = softwareVarientConfigFields.vcInfoUserName || ''

    return {
        contactEmail,
        contactName,
        contactPhoneNumber,
    }
}

export const selector_softwareContactInformation = createSelector(
    selector_softwareVarientConfigFields,
    createSoftwareContactInformationObject
)

function createDefaultContactInformationObject(isSharedUser, userContactInformation, softwareContactInformation) {
    return isSharedUser ? {} : Object.assign({}, userContactInformation, softwareContactInformation)
}

export const selector_defaultContactInformation = createSelector(
    selector_isSharedUser,
    selector_userContactInformation,
    selector_softwareContactInformation,
    createDefaultContactInformationObject
)
