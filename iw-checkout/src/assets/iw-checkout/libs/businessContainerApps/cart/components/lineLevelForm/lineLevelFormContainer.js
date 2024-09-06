import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import { IWShowHide } from '../../../../iw-components'

import { nameThatForm } from '../../helpers'
import LineLevelFormHeader from './lineLevelFormHeader'
import LineLevelForm from './lineLevelForm'
import ContractSpecificInfoFormSection from './contractSpecificInfoFormSection'
import LicenseInfoFormSection from './licenseInfoFormSection'
import SmartTrackerFormSection from './smartTrackerFormSection'
import { LICENSE_INFORMATION_SECTION_NAME, SMARTTRACKER_SECTION_NAME } from '../../constants'


export default class LineLevelFormContainer extends Component {
    constructor(props) {
        super(props)

        const formName = nameThatForm(props.contractID, props.bundleParentMaterialIDKey, props.materialIDKey)

        /* Contract Specific info */
        const hasDiversityPartnerList = props.doesPartnerDiversityExistForContract && props.partners.length > 0

        const hasSavedDiversityPartner = props.partnerID !== null && props.partnerID !== ''

        const savedDiversityPartnerInitialValue = hasDiversityPartnerList && hasSavedDiversityPartner ?
			{ diversityPartner: props.partnerID }
			:
			{}

        const filteredContractReportingFields = filterContractReportingFields(
			props.contractReportingFields,
			props.usCommunity
		)

        const hasContractReportingFields = filteredContractReportingFields.length > 0

        const filteredSavedContractReportingFields = filterSavedContractReportingFields(
			props.savedContractReportingFields,
			props.usCommunity
		)

        const hasSavedContractReportingFields = filteredSavedContractReportingFields.length > 0

        const savedContractReportingFieldsInitialValues = hasSavedContractReportingFields ?
			Object.keys(filteredSavedContractReportingFields).reduce((prev, curr) => {
				prev[filteredSavedContractReportingFields[curr].name] = filteredSavedContractReportingFields[curr].value
				return prev
			}, {})
			: {}

        const hasSavedContractReportingFieldsInitialValues = Object.keys(savedContractReportingFieldsInitialValues).length > 1

        const hasInitialContractSpecificInformationValues = (
			hasSavedDiversityPartner
			|| hasSavedContractReportingFieldsInitialValues
		)

        const savedContractSpecificInformationInitialValues = hasInitialContractSpecificInformationValues ?
				{
					contractSpecificInformation: {
						...savedDiversityPartnerInitialValue,
						...savedContractReportingFieldsInitialValues,
					},
				}
			:
				{}

        const hasContractSpecificInfo = (
			!props.bundledItem
			&& (hasContractReportingFields || hasDiversityPartnerList)
			)

        /* License info */
        const hasCountryOfUsage = props.showCountryOfUsage || false

        const countryOfUsageInitialValue = hasCountryOfUsage && (props.countryOfUsage || props.defaultCountryOfUsage) ?
			{ countryOfUsage: props.countryOfUsage || props.defaultCountryOfUsage }
			:
			{}

        const defaultLicenseInfoCharacteristicsValues = {
			CONTACT_EMAIL: props.defaultContactInformation.contactEmail,
			CONTACT_NAME: props.defaultContactInformation.contactName,
			CONTACT_PHONE: props.defaultContactInformation.contactPhoneNumber,
		}

        const licenseInfoCharacteristics = (
			!props.bundleHeader
			&& props.licenseInfo
			&& !props.licenseInfo.suppressSellReq
			&& props.licenseInfo.characteristics
			&& props.licenseInfo.characteristics.filter(char => !char.name.startsWith('CONTACT_EMAIL_'))
			) || []

        const hasLicenseInfoCharacteristics = licenseInfoCharacteristics.length > 0

        const savedLicenseInfoCharacteristicsValues = hasLicenseInfoCharacteristics ?
			licenseInfoCharacteristics
				.filter(char => char.value !== null)
				.reduce((prev, curr) => {
					prev[curr.name] = curr.value
					return prev
				}, {})
				: {}

        const hasLicenseInfoInitialValues = (
			hasCountryOfUsage
        	|| (hasLicenseInfoCharacteristics && Object.keys(defaultLicenseInfoCharacteristicsValues).length > 0)
			|| Object.keys(savedLicenseInfoCharacteristicsValues).length > 0
		)

        const savedLicenseInfoInitialValues = hasLicenseInfoInitialValues ?
				{
					licenseInformation: {
						...countryOfUsageInitialValue,
						...defaultLicenseInfoCharacteristicsValues,
						...savedLicenseInfoCharacteristicsValues,
					},
				}
			:
				{}

        const hasLicenseInfo = hasLicenseInfoCharacteristics || hasCountryOfUsage

        /* SmartTracker info */
        const hasDefaultSmartTrackers = Object.keys(props.defaultLineLevels).length > 0

        const defaultSmartTrackerInitialValues = hasDefaultSmartTrackers ?
			Object.keys(props.defaultLineLevels).reduce((prev, curr) => {
				if (props.defaultLineLevels[curr].value) {
					prev[curr] = props.defaultLineLevels[curr].value
				}
				return prev
			}, {})
			: {}

        const hasDefaultSmartTrackerInitialValues = Object.keys(defaultSmartTrackerInitialValues).length > 0

        const hasSavedSmartTrackers = Object.keys(props.savedSmartTrackers).length > 0

        const savedSmartTrackersInitialValues = hasSavedSmartTrackers ?
			Object.keys(props.savedSmartTrackers).reduce((prev, curr) => {
				prev[curr] = props.savedSmartTrackers[curr].fieldType === 'Date' ?
						convertStringDateToMomentObject(props.savedSmartTrackers[curr].value)
					:
						props.savedSmartTrackers[curr].value
				return prev
			}, {})
			: {}

        const hasSavedSmartTrackersInitialValues = Object.keys(savedSmartTrackersInitialValues).length > 0

        const smartTrackerInitialValues = (hasDefaultSmartTrackerInitialValues || hasSavedSmartTrackersInitialValues)
			&& { smartTracker: Object.assign({}, defaultSmartTrackerInitialValues, savedSmartTrackersInitialValues) }

        const hasSmartTrackers = (
			!props.bundledItem
			&& (
				(props.defaultLineLevels && Object.keys(props.defaultLineLevels).length > 0)
				|| hasSavedSmartTrackers)
			)
        /* meta info */
        const shouldRenderLineLevelFormContainer = (
			hasLicenseInfo
			|| hasContractSpecificInfo
			|| hasSmartTrackers
			)

        const hasRequiredLineLevels = (
			shouldRenderLineLevelFormContainer
			&& (
				hasCountryOfUsage
				|| (hasLicenseInfoCharacteristics && licenseInfoCharacteristics.filter(info => info.required).length > 0)
				|| (hasContractReportingFields
					&& (
						validateAndCheckIfHasRequired(props.contractReportingFields)
						|| validateAndCheckIfHasRequired(props.savedContractReportingFields))
					)
				|| (hasSmartTrackers
					&& (
						validateAndCheckIfHasRequired(props.defaultLineLevels)
						|| validateAndCheckIfHasRequired(props.savedSmartTrackers))
					)
			)
		)

        const initialValues = Object.assign(
			{},
			smartTrackerInitialValues,
			savedContractSpecificInformationInitialValues,
			savedLicenseInfoInitialValues
		)

        this.state = {
			formName,
			licenseInfoCharacteristics,
			hasCountryOfUsage,
			filteredContractReportingFields,
			hasContractReportingFields,
			hasDiversityPartnerList,
			hasLicenseInfoCharacteristics,
			hasContractSpecificInfo,
			hasLicenseInfo,
			hasSmartTrackers,
			hasSavedSmartTrackers,
			shouldRenderLineLevelFormContainer,
			hasRequiredLineLevels,
			initialValues,
			shouldShowLineLevelForm: hasRequiredLineLevels,
		}
    }

	  componentDidMount() {
		if (this.state.hasLicenseInfoCharacteristics) {
			const licenseInfoReadOnlyFields = this.state.licenseInfoCharacteristics
				.reduce((prev, curr) => {
					if (curr.editable) {
						return prev
					} else {
						prev[curr.name] = true
						return prev
					}
				}, {})

			const smartTrackerReadOnlyFields = Object.keys(this.props.defaultLineLevels)
				.reduce((prev, curr) => {
					if (this.props.defaultLineLevels[curr].readOnly) {
						prev[this.props.defaultLineLevels[curr].name] = true
						return prev
					} else {
						return prev
					}
				}, {})

			const payload = {
				[this.state.formName]: {
					[LICENSE_INFORMATION_SECTION_NAME]: licenseInfoReadOnlyFields,
					[SMARTTRACKER_SECTION_NAME]: smartTrackerReadOnlyFields,
				},
			}

			const hasReadOnlyFields = (
				Object.keys(licenseInfoReadOnlyFields).length > 0
				|| Object.keys(smartTrackerReadOnlyFields).length > 0
			)

			if (hasReadOnlyFields) {
				this.props.addToReadOnlyFieldsMap(payload)
			}
		}
	}

    shouldComponentUpdate(nextProps, nextState) {
		return (
			this.state.shouldShowLineLevelForm !== nextState.shouldShowLineLevelForm
			|| this.props.hasMultipleLicenseInfoForms !== nextProps.hasMultipleLicenseInfoForms
		)
	}

    toggleFormRendering = () => {
		this.setState({ shouldShowLineLevelForm: !this.state.shouldShowLineLevelForm })
	};

    render() {
      return (
        this.state.shouldRenderLineLevelFormContainer &&
          <div id={this.state.formName} className="line-level" data-private="true">
            <LineLevelFormHeader
              associatedForm={this.state.formName}
              hasRequiredLineLevels={this.state.hasRequiredLineLevels}
              isBundled={this.props.bundledItem || this.props.bundleHeader}
              showSplitLink={this.props.showSplitLink}
              toggleFormRendering={this.toggleFormRendering}
            />
            <IWShowHide showIf={this.state.shouldShowLineLevelForm} >
              <LineLevelForm
                // meta
                form={this.state.formName}
                bundledItem={this.props.bundledItem}
                bundleHeader={this.props.bundleHeader}
                bundleParentMaterialIDKey={this.props.bundleParentMaterialIDKey}
                childItems={this.props.childItems}
                childEnrollmentId={this.props.childEnrollmentId}
                contractID={this.props.contractID}
                history={this.props.history}
                setActiveIndex={this.props.setActiveIndex}
                enableReinitialize={true}
                initialValues={this.state.initialValues}
                materialIDKey={this.props.materialIDKey}
                // contract specific information
                contractReportingFields={this.props.contractReportingFields}
                hasContractReportingFields={this.state.hasContractReportingFields}
                hasDiversityPartnerList={this.state.hasDiversityPartnerList}
                // license info
                hasCountryOfUsage={this.state.hasCountryOfUsage}
                hasLicenseInfoCharacteristics={this.state.hasLicenseInfoCharacteristics}
                sellRequirement={this.props.licenseInfo}
                // smartTrackers
                hasSavedSmartTrackers={this.state.hasSavedSmartTrackers}
                hasSmartTrackers={this.state.hasSmartTrackers}
                lineLevels={this.props.defaultLineLevels}
                outOfBundleChildItems={this.props.outOfBundleChildItems}
                savedSmartTrackers={this.props.savedSmartTrackers}
                updateChildItems={this.props.updateChildItems}
              >
                {
                  this.state.hasContractSpecificInfo &&
                    <ContractSpecificInfoFormSection
                      filteredContractReportingFields={this.state.filteredContractReportingFields}
                      hasDiversityPartnerList={this.state.hasDiversityPartnerList}
                      hasContractReportingFields={this.state.hasContractReportingFields}
                      numberOfItemsInContract={this.props.numberOfItemsInContract}
                      partnerList={this.props.partners}
                      parentFormName={this.state.formName}
                    />
                }
                {
                  this.state.hasLicenseInfo &&
                    <LicenseInfoFormSection
                      hasCountryOfUsage={this.state.hasCountryOfUsage}
                      hasMultipleLicenseInfoForms={this.props.hasMultipleLicenseInfoForms}
                      licenseInfoCharacteristics={this.state.licenseInfoCharacteristics}
                      parentFormName={this.state.formName}
                      sellRequirementId={(this.props.licenseInfo && this.props.licenseInfo.sellRequirementId) || ''}
                    />
                }
                {
                  this.state.hasSmartTrackers &&
                    <SmartTrackerFormSection
                      defaultLineLevels={this.props.defaultLineLevels}
                      numberOfItemsInCart={this.props.numberOfItemsInCart}
                      parentFormName={this.state.formName}
                    />
                }
              </LineLevelForm>
            </IWShowHide>
          </div>
      )
	}
}


LineLevelFormContainer.propTypes = {
	bundledItem: PropTypes.bool.isRequired,
	bundleHeader: PropTypes.bool.isRequired,
	bundleParentMaterialIDKey: PropTypes.string.isRequired,
	savedContractReportingFields: PropTypes.object,
	childItems: PropTypes.array,
	contractID: PropTypes.string.isRequired,
	contractReportingFields: PropTypes.array.isRequired,
	countryOfUsage: PropTypes.string,
	defaultContactInformation: PropTypes.object.isRequired,
	defaultCountryOfUsage: PropTypes.string.isRequired,
	defaultLineLevels: PropTypes.object,
	doesPartnerDiversityExistForContract: PropTypes.bool.isRequired,
	hasMultipleLicenseInfoForms: PropTypes.bool.isRequired,
	history: PropTypes.object,
	licenseInfo: PropTypes.object,
	materialIDKey: PropTypes.string.isRequired,
	outOfBundleChildItems: PropTypes.array,
	partnerID: PropTypes.string,
	partners: PropTypes.array.isRequired,
	savedSmartTrackers: PropTypes.object,
	showCountryOfUsage: PropTypes.bool,
	showSplitLink: PropTypes.bool.isRequired,
	usCommunity: PropTypes.bool.isRequired,
	// actions
	addToReadOnlyFieldsMap: PropTypes.func.isRequired,
    setActiveIndex: PropTypes.func.isRequired,
	updateChildItems: PropTypes.func,
}


LineLevelFormContainer.defaultProps = {
	childItems: [],
	contractReportingFields: [],
	outOfBundleChildItems: [],
	savedSmartTrackers: {},
	savedContractReportingFields: {},
}


function validateAndCheckIfHasRequired(objToIterate) {
	return (
		objToIterate &&
		Object.keys(objToIterate).filter(key => objToIterate[key].required).length > 0
	)
}


function filterSavedContractReportingFields(savedContractReportingFields, usCommunity) {
	// iterate through and show all smart trackers with sapmapping > 3 and !(6 && usCommunity)
	return Object.keys(savedContractReportingFields)
		.filter((name) => {
			const sapMapping = savedContractReportingFields[name].sapmapping
            // const repName = savedContractReportingFields[name].name
            // const showReportingField = !(sapMapping === 6 && usCommunity) && !(repName == "" && repName.length == 0)
            const showReportingField = sapMapping > 3 && !(sapMapping === 6 && usCommunity)
            return showReportingField
		}).map(fieldName => savedContractReportingFields[fieldName])
}


function filterContractReportingFields(contractReportingFields, usCommunity) {
	return contractReportingFields
		.filter((reportingField) => {
			const sapMapping = reportingField.sapmapping
			// filter out 1-3, 6 per requirements
			const showReportingField = sapMapping > 3 && !(sapMapping === 6 && usCommunity)
			return showReportingField
		})
}


function convertStringDateToMomentObject(dateString) {
	const momentObject = moment(dateString, ['DD-MMM-YYYY', 'YYYY-MM-DD']).format('DD-MMM-YYYY')
	return momentObject === 'Invalid date' ? '' : momentObject
}
