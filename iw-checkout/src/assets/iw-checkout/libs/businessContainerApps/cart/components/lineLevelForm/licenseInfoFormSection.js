import React from 'react';
import PropTypes from 'prop-types'

import { t } from '@insight/toolkit-utils/lib/labels'
import { IWCountryField, IWTextField, IWEmailField } from '../../../../iw-components/iw-form'

import LineLevelSection from './lineLevelSection'
import { LICENSE_INFORMATION_SECTION_NAME } from '../../constants'

const displayNameMap = {
	PCN_NO: 'PCN #',
	LICENSE: 'License #',
	INITIAL_STK_NO: 'Initial stock #',
}

export default function LicenseInfoFormSection(props) {
    const lowerCaseEmailFieldName = 'contact email'
    const helpText = t('Enter your purchase authorization number received from the Adobe console')
    return (
        <LineLevelSection
            parentFormName={props.parentFormName}
            sectionDisplayName={'License information'}
            sectionName={LICENSE_INFORMATION_SECTION_NAME}
            showCopyToAll={props.hasMultipleLicenseInfoForms}
        >
            {props.hasCountryOfUsage &&
                <div className="columns small-12 medium-6 large-4">
                    <IWCountryField required name={'countryOfUsage'} label={t('Country of usage')} />
                </div>}
            {props.licenseInfoCharacteristics.map((info, i) => {
                const { name, required, editable } = info
                const displayName = displayNameMap[name] ? displayNameMap[name] : rewrite(name)
                const sharedProps = {
                    label: displayName,
                    name,
                    required,
                    readOnly: !editable,
                }

                const usedProps =
                    props.sellRequirementId === 'A3' && displayName === 'Authorization'
                        ? Object.assign({}, sharedProps, { label: t('PA #'), tooltip: helpText, showHelpIcon: true })
                        : sharedProps

                return (
                    <div key={i} className="columns small-12 medium-6 large-4">
                        {displayName.toLowerCase() === lowerCaseEmailFieldName
                            ? <IWEmailField maxLength={60} {...usedProps} />
                            : <IWTextField {...usedProps} />}
                    </div>
                )
            })}
        </LineLevelSection>
    );
}

LicenseInfoFormSection.propTypes = {
	hasCountryOfUsage: PropTypes.bool.isRequired,
	hasMultipleLicenseInfoForms: PropTypes.bool.isRequired,
	licenseInfoCharacteristics: PropTypes.arrayOf(PropTypes.object).isRequired,
	parentFormName: PropTypes.string.isRequired,
	sellRequirementId: PropTypes.string.isRequired,
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
