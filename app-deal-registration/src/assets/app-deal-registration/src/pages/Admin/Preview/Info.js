import React from 'react'
import PropTypes from 'prop-types'
import { StructuredList } from '@components'

const getAddressFromInfo = ({ soldToAddress, soldToCity, soldToState, soldToZip }) => {
	return `${soldToAddress} ${soldToCity} ${soldToState} ${soldToZip}`
}

export default function Info(props) {
	const firstListItems = [
		{ name: 'Quote # ', value: props.quoteNumber },
    { name: 'Sales rep name', value: props.repName },
		{ name: 'Sales rep email', value: props.repEmail },
    { name: 'Sales rep ID', value: props.repID },
    { name: 'Created by log in', value: props.createdBy }
	]

	const secondListItems = [
    { name: 'Sold to #', value: props.soldToNumber},
    { name: 'Sold to name', value: props.soldToName},
		{ name: 'Sold to address', value: getAddressFromInfo(props)},
		{ name: 'Notification emails', value: props.notificationEmails && props.notificationEmails.notificationEmails.join(';')},
		{ name: 'File attachments', value: props.fileAttachment && props.fileAttachment.map(attachment => (
			<a href={attachment} target="_blank" key={attachment}>{attachment}</a>
		)) || ''}
	]

	return (
		<div className="c-admin-preview__info">
			<StructuredList className="c-admin-preview__list" items={firstListItems} />
			<StructuredList className="c-admin-preview__list" items={secondListItems} />
		</div>
	)
}
