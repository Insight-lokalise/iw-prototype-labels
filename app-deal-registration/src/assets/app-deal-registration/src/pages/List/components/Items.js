import React from 'react'
import PropTypes from 'prop-types'
import Item from './Item/Item'

const Items = ({ items, ...rest }) => (
	<div className="c-list__items">
		{items.map(item => (
			<Item item={item} key={item.versionId} {...rest} />
		))}
	</div>
)

export default Items
