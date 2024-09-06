import React from 'react'
import cn from 'classnames'
import PropTypes from 'prop-types'

export default function Number({
	className,
	...rest
}) {
	const classes = cn('c-input c-number', className)
	return (
		<input
			className={classes}
			type="number"
			{...rest}
		/>
	)
}
