import React from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils/lib/labels'
import { IWSelectField, IWTextField } from '../../../../iw-components/iw-form'

import LineLevelSection from './lineLevelSection'
import { CONTRACT_SPECIFIC_INFORMATION_SECTION_NAME } from '../../constants'

export default function ContractSpecificInfoFormSection(props) {
	return (
		<LineLevelSection
			parentFormName={props.parentFormName}
			sectionDisplayName={'Contract specific information'}
			sectionName={CONTRACT_SPECIFIC_INFORMATION_SECTION_NAME}
			showCopyToAll={props.numberOfItemsInContract > 1}
		>
			{props.hasContractReportingFields &&
				props.filteredContractReportingFields.map(reportingField =>
					<div key={reportingField.name} className="columns small-12 medium-6 large-4">
						<IWTextField
							key={reportingField.name}
							label={reportingField.name}
							name={reportingField.name}
							required={reportingField.required}
						/>
					</div>
				)}
			{props.hasDiversityPartnerList &&
				<div className="columns small-12 medium-6 large-4">
					<PartnerSelect partnerList={props.partnerList} />
				</div>}
		</LineLevelSection>
	)
}

ContractSpecificInfoFormSection.propTypes = {
	filteredContractReportingFields: PropTypes.arrayOf(PropTypes.object).isRequired,
	hasDiversityPartnerList: PropTypes.bool.isRequired,
	hasContractReportingFields: PropTypes.bool.isRequired,
	numberOfItemsInContract: PropTypes.number.isRequired,
	parentFormName: PropTypes.string.isRequired,
	partnerList: PropTypes.arrayOf(PropTypes.object).isRequired,
}

function PartnerSelect(props) {
	const partnerPlaceholderText = t('Select a partner')
	const partnerList = props.partnerList.filter(partner => partner.partnerType === 'ZD').map(partner => {
		return { displayName: partner.partnerName, value: partner.partnerID }
	})

	return (
		<IWSelectField
			label={'Diversity partner'}
			name={'diversityPartner'}
			optionsArrayOrFunction={partnerList}
			placeholder={partnerPlaceholderText}
		/>
	)
}
