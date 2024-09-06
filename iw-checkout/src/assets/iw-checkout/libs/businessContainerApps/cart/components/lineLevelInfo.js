import React from 'react'
import PropTypes from 'prop-types'

import Date from '@insight/toolkit-react/lib/Date/Date'

import { orderSmartTrackers } from '../helpers'
import LineLevelLink from './LineLevelLink'
import { IWExpandCollapse } from '../../../iw-components'
import {
	hasCartItemHasLineLevels,
	filterLicenseInfoValues,
	filterContractInfo,
	filterSmartTrackersWithValues,
} from './../../../Cart/selectors'
import { t } from '@insight/toolkit-utils/lib/labels'

export default function LineLevelInfo(props) {
	const shouldShowLineLevels = hasCartItemHasLineLevels(props)
	return (
		shouldShowLineLevels &&
		<IWExpandCollapse
			defaultOpen={!props.enableExpandCollapse}
            enableExpandCollapse={props.enableExpandCollapse}
			className='line-level__expand-collapse hide-for-print'
			label={t('Item information')}
			messageType={'cart:linelevel:expandAll'}>

			<div className="row expanded is-collapse-child">
				<div className="column">
					<div className="line-level" data-private="true">
						<LineLevelLink
							navigateToLineLevelSection={props.navigateToLineLevelSection}
							disableLineLevelLink={props.disableLineLevelLink}
                            hideLineLevelLink={props.hideLineLevelLink}
						/>
						{renderContractSpecificInformation(props)}
						{renderLicenseInformation(props)}
						{renderSmartTracker(props)}
					</div>
				</div>
			</div>
		</IWExpandCollapse>
	)
}


LineLevelInfo.propTypes = {
	bundleHeader: PropTypes.bool.isRequired,
	bundledItem: PropTypes.bool.isRequired,
	savedContractReportingFields: PropTypes.object,
	contractReportingFields: PropTypes.array,
	countryOfUsage: PropTypes.string,
	defaultLineLevels: PropTypes.object,
	disableLineLevelLink: PropTypes.bool.isRequired,
    enableExpandCollapse: PropTypes.bool.isRequired,
	doesPartnerDiversityExistForContract: PropTypes.bool.isRequired,
    hideLineLevelLink: PropTypes.bool.isRequired,
	licenseInfo: PropTypes.object,
	partnerID: PropTypes.string,
	partners: PropTypes.array.isRequired,
	showCountryOfUsage: PropTypes.bool,
	smartTracker: PropTypes.object,
    navigateToLineLevelSection: PropTypes.func,
}


function renderLicenseInformation(props) {
	const countryOfUsageText = 'Country of usage:'

	const hasCountryOfUsage = props.countryOfUsage !== null && props.showCountryOfUsage

	const hideSellRequirements = (props.licenseInfo && props.licenseInfo.suppressSellReq) || false

	const hasLicenseInfo = (
			!props.bundleHeader
			&& props.licenseInfo
			&& !hideSellRequirements
			&& props.licenseInfo.characteristics
			&& filterLicenseInfoValues(props.licenseInfo).length > 0
		)
		|| hasCountryOfUsage

	return hasLicenseInfo && (
		<section className="line-level__section">
			<h4 className="line-level__subheading">{t('License information')}</h4>
			<div data-private="true" className="row expanded">
				{ hasCountryOfUsage ?
					<div className="columns small-12 medium-4">
						<label className="form__label--readonly">{t(countryOfUsageText)}
							<p>{t(props.countryOfUsage)}</p>
						</label>
					</div>
					: null
				}
				{ !hideSellRequirements &&
					filterLicenseInfoValues(props.licenseInfo)
					.map((info, i) => {
						const displayNameMap = {
							PCN_NO: 'PCN #',
							LICENSE: 'License #',
							INITIAL_STK_NO: 'Initial stock #',
						}
						const name = info.name
						const displayName = displayNameMap[name] ? t(displayNameMap[name]) : t(rewrite(name))
						const altDisplayName = props.licenseInfo && props.licenseInfo.sellRequirementId === 'A3' && displayName === 'Authorization' ? 'PA #' : displayName
						return (
							<div className="columns small-12 medium-4" key={i}>
								<label className="form__label--readonly">{`${altDisplayName}:`}
									<p>{info.value}</p>
								</label>
							</div>
						)
					})
				}
			</div>
		</section>
	)
}


function rewrite(str) {
	let properCase = str[0].toUpperCase() + str.substr(1).toLowerCase()
	let output = properCase.split('_')

	if (str.endsWith('_NO')) {
		output[output.length - 1] = '#'
	} else if (str.endsWith('_ID')) {
		output[output.length - 1] = 'ID'
	}

	return output.join(' ')
}

/**
 * iterate through partners array and render the name of the partner with the matching partnerID
 * @param  {object} props 	see propTypes
 * @return {jsx}       			partner name
 */
function findAndRenderPartnerMatch(props) {
	for (let i = 0; i < props.partners.length; i++) {
		if (props.partners[i].partnerID === props.partnerID) {
			return (
				<div className="columns small-12 medium-4">
					<label className="form__label--readonly">
						<p>{props.partners[i].partnerName}</p>
					</label>
				</div>
			)
		}
	}
	return null
}


function renderContractSpecificInformation(props) {
	const hasContractReportingFields = props.savedContractReportingFields && filterContractInfo(props.savedContractReportingFields).length > 0
	const hasValidPartnerID = props.partnerID !== null && props.partnerID !== undefined && props.partnerID !== ''

	return hasContractReportingFields || hasValidPartnerID ? (
		<section className="line-level__section">
			<h4 className="line-level__subheading">{t('Contract specific information')}</h4>
			<div className="row expanded">
				{
					filterContractInfo(props.savedContractReportingFields).map((info, i) => {
						return (
							<div className="columns small-12 medium-4" key={i}>
								<label className="form__label--readonly">{`${t(info.name)}`}:
									<p>{info.value}</p>
								</label>
							</div>
						)
					})
				}
				{findAndRenderPartnerMatch(props)}
			</div>
		</section>
	) :
	null
}


function renderSmartTracker(props) {
	// if .lineLevels is populated then iterate through and show all smart trackers with value
	return props.smartTracker && Object.keys(filterSmartTrackersWithValues(props.smartTracker)).length > 0 ? (
		<section className="line-level__section">
			<h4 className="line-level__subheading">{t('SmartTracker')}</h4>
			<div className="row expanded">
			{
				orderSmartTrackers(filterSmartTrackersWithValues(props.smartTracker)).map((smartTracker) => {
					const { fieldType, name, value, lineLevelId } = smartTracker
					const isDate = fieldType === 'Date'
					const displayValue = isDate ?
            <Date date={value}/>
						:
							value
					return (
						<div className="columns small-12 medium-4" key={lineLevelId}>
							<label className="form__label--readonly">{`${name}:`}
								<p>{displayValue}</p>
							</label>
						</div>
					)
				})
			}
			</div>
		</section>
	) :
	null
}

