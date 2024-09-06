import React, { Fragment } from 'react'

const legacyMapper = item => ([
	<span key={item}>{item}</span>,
	<br key={`${item}-break`} />
])

const baseMapper = item => ([
	<a href={item} key={item} target="_blank">{item}</a>,
	<br key={`${item}-break`} />
])

export default function FileAttachments({ fileAttachment, isLegacy }) {
	if (!fileAttachment) {
		return null
	}
	const mapper = isLegacy ? legacyMapper : baseMapper
	return fileAttachment.map(...mapper)
}
