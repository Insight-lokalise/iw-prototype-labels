import React  from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

export default function StructuredList({ className, items }) {
	const classes = cn('c-structured-list', className)
	return (
		<table className={classes}>
			<tbody className="c-structured-list__items">
				{items.map(({name, value}, idx) => (
					<tr className="c-structured-list__item" key={idx}>
						<th className="c-structured-list__term" scope="row">{name}:</th>
						<td className="c-structured-list__description">{value}</td>
					</tr>
				))}
			</tbody>
		</table>
	)
}

StructuredList.propTypes = {
	className: PropTypes.string,
	items: PropTypes.arrayOf(PropTypes.shape({
		name: PropTypes.string.isRequired,
		value: PropTypes.string
	})).isRequired
}
