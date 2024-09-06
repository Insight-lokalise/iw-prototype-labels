import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { updateAdminFields, getDeniedReasons } from '@api'
import { Panel } from '@components'
import { useDisplay, usePurpose } from '@context'
import { isValidResponse } from '@lib'


import { createToast } from '../toasts'
import Fields from './Fields'
import Info from './Info'

export default function Preview({
	deal,
	previewNode,
	selectedIsLegacy,
	updateDeal,
	visible
}) {
	const [isSubmitting, setSubmitting] = useState(false)
	const [deniedReasonsOptions, setDeniedReasonsOptions] = useState([]);
	const display = useDisplay()
	const { currentUser } = usePurpose().getPurpose()

	useEffect(() => {
		const fetchDeniedReasons = async () => {
			const reasons = await getDeniedReasons();
			const deniedReasonsOptions =  reasons.map(reason => ({
				optionValue: reason.code.toString(),
				text: reason.text,
			}));
			setDeniedReasonsOptions(deniedReasonsOptions);
		};
		fetchDeniedReasons();
	}, []);

	const updateFields = async values => {
		setSubmitting(true)
		const payload = { ...values, id: deal.id }
		const response = await updateAdminFields(payload)
		if (response && isValidResponse(response)) {
			updateDeal({ ...deal, ...payload })
			display.addToast(createToast('update-preview-success'))
		} else {
			display.addToast(createToast('update-preview-failure'))
		}
		setSubmitting(false)
	}

	if (!visible) {
		return null
	}

	return (
		<Panel className="c-admin-preview" isEmphasized panelRef={previewNode}>
			<Panel.Title>
				<h5>Preview fields</h5>
				<p>DealID: {deal.id}</p>
			</Panel.Title>
			<Panel.Body>
				<Info {...deal} isLegacy={selectedIsLegacy} />
				<Fields {...deal} currentUser={currentUser} id={deal.id} isSubmitting={isSubmitting}
						updateFields={updateFields} deniedReasonsOptions={deniedReasonsOptions} />
			</Panel.Body>
		</Panel>
	)
}
