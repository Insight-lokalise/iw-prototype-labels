import React from 'react'
import PropTypes from 'prop-types'
import { formatDate } from 'lib'
import { ITEM_FORMATTER } from '../../constants'

const formatListText = (text, modified) => (
	<div className="c-list-item__text">
		<p>{modified ? 'Last Modified' : 'Created'}</p>
		<p className="c-list-item__date">{formatDate(text, ITEM_FORMATTER)}</p>
	</div>
)


export default function Info({ createDate, modifiedDate }) {
	return (
		<div className="c-list-item__info">
			{formatListText(createDate, false)}
			{modifiedDate && formatListText(modifiedDate, true)}
		</div>
	)
}
