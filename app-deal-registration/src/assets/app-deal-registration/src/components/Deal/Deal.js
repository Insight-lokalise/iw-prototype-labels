import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import {
	getInitialPopulatedFields,
	populateClientlinkEntry,
	populateEdit,
} from '@services/deal'

import Content from './Content'
import { getFieldsForDeal } from './helpers'

export default function Deal({
	entryContext,
	isEdit,
	onInvalid,
	onSuccess,
	passedFields,
	passedValues,
	preventSubmission,
	showSubmit,
}) {
	const isClientlinkEntry =
		entryContext && entryContext.entrypoint === 'clientlink'
	const [isFetchingEntry, setIsFetchingEntry] = useState(
		isClientlinkEntry || isEdit
	)
	const fields = getFieldsForDeal(passedFields)

	const [populatedDropdowns, setPopulatedDropdowns] = useState([])
	const [populatedFields, setPopulatedFields] = useState(
		getInitialPopulatedFields(passedFields)
	)

	const setFieldsPopulated = ({ newValues, populated }) => {
		setPopulatedDropdowns(populated)
		setPopulatedFields(prev => ({ ...prev, ...newValues }))
		setIsFetchingEntry(false)
	}

	useEffect(() => {
		const fetcher = async () => {
			if (isEdit) {
				const { universal } = passedValues.formFields
				const response = await populateEdit(
					passedFields,
					universal.accountInfo.accountNumber,
					universal.dealInfo.salesOrg
				)
				return setFieldsPopulated(response)
			}

			if (entryContext) {
				const { entrypoint, pathArgs, currentUser } = entryContext
				if (isClientlinkEntry) {
					const response = await populateClientlinkEntry(pathArgs, currentUser)
					if (response) {
						return setFieldsPopulated(response)
					}
				}
			}
		}
		fetcher()
	}, [])

	const handleSubmit = async (values, isValid) => {
		if (!isValid) {
			return onInvalid()
		}
		await onSuccess(values)
	}

	if (isFetchingEntry) {
		return <p>Loading</p>
	}

	return (
		<div className='c-deal'>
			<Content
				handleSubmit={handleSubmit}
				isEdit={isEdit}
				passedFields={fields}
				populatedDropdowns={populatedDropdowns}
				populatedFields={populatedFields}
				passedValues={passedValues && passedValues.formFields}
				preventSubmission={preventSubmission}
				showSubmit={showSubmit}
			/>
		</div>
	)
}

Deal.propTypes = {
	disableSubmit: PropTypes.bool,
	onInvalid: PropTypes.func,
	onSuccess: PropTypes.func,
	passedFields: PropTypes.shape({}),
	passedValues: PropTypes.shape({}),
}
