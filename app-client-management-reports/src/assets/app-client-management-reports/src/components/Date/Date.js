import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import DatePicker from '@insight/toolkit-react/lib/DatePicker/DatePicker'

export default function Date({
	className,
	disabled,
	id,
	name,
	onChange,
	value,
	...rest
}) {
	const classes = cn('c-date-picker', className)

	return (
		<div className={classes}>
			<DatePicker
				className="c-date-picker__input"
				format="LL"				
				readOnly={disabled}
				onChange={onChange}				
				dateFormat="MM/dd/yyyy"
				placeholderText="MM/DD/YYYY"
				selected={value ? value : null}				
				{...rest}
			/>
		</div>
	)		 
}
