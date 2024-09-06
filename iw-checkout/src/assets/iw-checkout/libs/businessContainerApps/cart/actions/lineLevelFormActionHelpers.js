import get from 'lodash-es/get'
import moment from 'moment'

/**
 * creates an object that can be submitted as part of an array for saving line levels
 * @param  {object} values                   redux-form values object
 * @param  {object} props                    props
 * @param  {string} _cartItemSelectedToSplit from redux store - string of the corresponding form to be split
 * @return {object}
 * const formData = {
     cartItemSelectedToSplit: false,
     contractID: '12334534',
     contractReportingFields: [{ name: 'rep field 1', required: false, sapmapping: 4, value: null }],
     countryOfUsage: 'France',
     countryOfUsageForBundleLineItems: [],
     lineLevels: [{ lineLevelId: 12435, name: 'QTPText', preDefinedValue: '', value: null }],
     materialID: '2',
     partnerNumber: '1234',
     sellRequirement: {
         characteristics: [{ defaultValue: false, editable: true, name: 'contact email', required: false, value: 'abcd' }],
         sellRequirementId: null,
     },
     txSellRequirementForBundleLineItems: [],
    }
 */
export function createFormDataPayloadObject(values, props, _cartItemSelectedToSplit) {
    const cartItemSelectedToSplit = props.form === _cartItemSelectedToSplit

    const contractID = props.contractID

    const contractReportingFields = props.hasContractReportingFields
        ? modifyReportingFields(values, props.contractReportingFields)
        : []

    const countryOfUsage = props.hasCountryOfUsage ? get(values, ['licenseInformation', 'countryOfUsage'], '') : ''

    const lineLevels = props.hasSmartTrackers ? modifyLineLevel(values, props.lineLevels) : []

    const materialID = props.bundleHeader ? props.bundleParentMaterialIDKey : props.materialIDKey

    const partnerNumber = props.hasDiversityPartnerList
        ? get(values, ['contractSpecificInformation', 'diversityPartner'], '')
        : ''

    const sellRequirement =
        !!props.sellRequirement && !props.bundleHeader
            ? modifySellRequirement(values, props.sellRequirement)
            : !!props.sellRequirement && props.bundleHeader ? { characteristics: [] } : {}

    const formData = {
        cartItemSelectedToSplit,
        contractID,
        contractReportingFields,
        countryOfUsage,
        countryOfUsageForBundleLineItems: [],
        lineLevels,
        materialID,
        partnerNumber,
        sellRequirement,
        txSellRequirementForBundleLineItems: [],
    }

    return {
        formName: props.form,
        formData,
    }
}

export function addToFromDataPayloadObject(values, props, formSubmissionStaging) {
    const formName = recreateBundleParentFormName(props.form)

    const hasParentInFormSubmissionStaging = !!formSubmissionStaging[formName]

    const bundleParentFormData = hasParentInFormSubmissionStaging
        ? formSubmissionStaging[formName]
        : createFormDataPayloadObject({}, createFakePropsForBundleParentWithoutLineLevels(formName), '').formData

    const copy_countryOfUsage = bundleParentFormData.countryOfUsageForBundleLineItems.slice()

    const copy_sellRequirement = bundleParentFormData.txSellRequirementForBundleLineItems.slice()

    const materialIDKey = props.materialIDKey

    const countryOfUsage = props.hasCountryOfUsage ? get(values, ['licenseInformation', 'countryOfUsage'], '') : ''

    if (countryOfUsage !== '') {
        copy_countryOfUsage.push({ materialIDKey, countryOfUsage })
    }

    if (props.sellRequirement) {
        copy_sellRequirement.push(modifySellRequirementForBundledItem(values, props.sellRequirement, materialIDKey))
    }

    const formData = Object.assign(
        {},
        bundleParentFormData,
        { countryOfUsageForBundleLineItems: copy_countryOfUsage },
        { txSellRequirementForBundleLineItems: copy_sellRequirement }
    )

    return {
        formName,
        formData,
    }
}

export function recreateBundleParentFormName(formName) {
    return formName.split('__').slice(0, -1).join('__').concat('__')
}

function modifySellRequirement(values, { characteristics, sellRequirementId }) {
    const licenseInformationValues = get(values, ['licenseInformation'], null)

    function _cleanCharacteristics(licenseInformationValues, chars) {
        return !licenseInformationValues
            ? chars
            : chars.map(char => {
                  return licenseInformationValues[char.name]
                      ? { ...char, value: licenseInformationValues[char.name] }
                      : char
              })
    }

    return {
        characteristics: _cleanCharacteristics(licenseInformationValues, characteristics),
        sellRequirementId,
    }
}

function modifySellRequirementForBundledItem(values, sellRequirement, lineItemMaterialIDKey) {
    return {
        ...modifySellRequirement(values, sellRequirement),
        lineItemMaterialIDKey,
        sellRequirementId: null,
    }
}

function modifyLineLevel(values, lineLevels) {
    const lineLevelValues = get(values, ['smartTracker'], null)

    return !lineLevelValues
        ? Object.keys(lineLevels).map(line => createSimplifiedLineLevelObject(lineLevels[line]))
        : Object.keys(lineLevels).map(line => {
              const lineLevelObject = createSimplifiedLineLevelObject(lineLevels[line])

              const hasUpdatedValue = !!lineLevelValues[line]

              return hasUpdatedValue
                  ? {
                        ...lineLevelObject,
                        value:
                            lineLevels[line].fieldType === 'Date'
                                ? formatLocalizedDateStringToEnglish(lineLevelValues[line])
                                : lineLevelValues[line],
                    }
                  : lineLevelObject
          })
}

function createSimplifiedLineLevelObject(lineLevelObject) {
    return {
        // remove prepended 'st-''
        lineLevelId: Number(lineLevelObject.lineLevelId.slice(3)),
        name: lineLevelObject.name,
        preDefinedValue: lineLevelObject.preDefinedValue,
        value: lineLevelObject.value === '' ? null : lineLevelObject.value,
    }
}

function formatLocalizedDateStringToEnglish(dateString) {
    return moment(dateString, ['DD-MMM-YYYY']).locale('en').format('DD-MMM-YYYY')
}

function modifyReportingFields(values, contractReportingFields) {
    const reportingFieldValues = get(values, ['contractSpecificInformation'], null)

    return !reportingFieldValues
        ? contractReportingFields
        : contractReportingFields.map(reportingField => {
              return reportingFieldValues[reportingField.name]
                  ? { ...reportingField, value: reportingFieldValues[reportingField.name] }
                  : reportingField
          })
}

export function createLineLevelFormSubmittalArray(formSubmissionStaging, enrollmentIDs) {
    const mergedItems = { ...formSubmissionStaging, ...enrollmentIDs}
    const filteredItems = Object.keys(mergedItems)
        .filter(key => key.startsWith('lineLevelForm__'))
        .reduce((obj, key) => {
            return {
                ...obj,
                [key]: mergedItems[key]
            };
        }, {});

    const enrolledItems = Object.keys(enrollmentIDs)
        .filter(key => key.startsWith('lineLevelForm__'))
        .reduce((obj, key) => {
            return {
                ...obj,
                [key]: enrollmentIDs[key]
            };
        }, {});

    if(Object.keys(filteredItems).length > 0 ){
        const updatedWithChildIDs = Object.keys(enrolledItems).map(childFormName => {
            const enrollmentItems = Object.keys(filteredItems).map(mergedFormName => {
                if(filteredItems[mergedFormName].materialID ===  enrolledItems[childFormName].parentMaterialId){
                    filteredItems[childFormName] = {...filteredItems[mergedFormName]}
                    filteredItems[childFormName].materialID = (enrolledItems[childFormName].childEnrollmentId).toString()
                    return {...filteredItems}
                }
                return filteredItems
            })
            return filteredItems
        })
        return Object.keys(filteredItems).map(formName => {
            const formSubmittalObject = Object.assign({}, filteredItems[formName])
            return formSubmittalObject
        })
    }

    return Object.keys(filteredItems).map(formName => {
        const formSubmittalObject = Object.assign({}, filteredItems[formName])
        return formSubmittalObject
    })
}

function createFakePropsForBundleParentWithoutLineLevels(formName) {
    const splitFormName = formName.split('__')
    return {
        form: formName,
        contractID: splitFormName[1],
        hasContractReportingFields: false,
        hasCountryOfUsage: false,
        hasSmartTrackers: false,
        bundleHeader: true,
        bundleParentMaterialIDKey: splitFormName[2],
        hasDiversityPartnerList: false,
        sellRequirement: false,
    }
}
