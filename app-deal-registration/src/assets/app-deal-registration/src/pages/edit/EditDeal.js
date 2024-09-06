import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { Loading } from '@insight/toolkit-react'

import { getSalesOrgMap, getFormByIdAndVersion, updateDeal } from '@api'
import { Deal } from '@components'
import generateSubmissionArgs from './generateSubmissionArgs'

export default function EditDeal({ display, history, location, purpose }) {
	const purposeState = purpose.getPurpose()
	const [status, setStatus] = useState('loading')
	const [passedFields, setPassedFields] = useState(null)

	useEffect(() => {
		const fetcher = async () => {
			const { form_id, form_version } = purposeState.selectedDeal
			const response = await getFormByIdAndVersion(form_id, form_version)
			if (response && !response.error) {
				setPassedFields(response)
				setStatus('')
			} else {
				setStatus('error')
			}
		}
		fetcher()
	}, [])

	const onInvalid = () => {
		display.addToast({
			color: 'warning',
			id: 'edit-deal-failure',
			text: <p>Could not edit this deal</p>
		})
	}

	const onSuccess = async values => {
    const salesOrgMap = await getSalesOrgMap()
    const salesOrgId = salesOrgMap[values.universal.dealInfo.salesOrg]
		const args = generateSubmissionArgs({ purpose: purposeState, values }, salesOrgId)
		const response = await updateDeal(args)
		if (response && !response.error) {
			display.addToast({
				color: 'success',
				id: 'edit-deal-success',
				text: <p>Deal Updated</p>
			})
			history.push('/admin')
		}
	}

	const getContent = () => {
		if (status === 'loading') return <Loading size="large" />
		if (status === 'error') return <p>We could not find that Deal</p>
		return (
			<Deal
				isEdit
				onInvalid={onInvalid}
				onSuccess={onSuccess}
				passedFields={passedFields}
				passedValues={purposeState.selectedDeal}
				showSubmit
			/>
		)
	}

	const classes = cn('c-edit', {
		'is-error': status === 'error',
		'is-loading': status === 'loading'
	})

	console.log(purposeState)
	return <div className={classes}>{getContent()}</div>
}

EditDeal.propTypes = {
	display: PropTypes.shape({}),
	history: PropTypes.shape({}),
	location: PropTypes.shape({}),
	purpose: PropTypes.shape({})
}
