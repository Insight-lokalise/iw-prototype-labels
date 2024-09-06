import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import Box from './Box'

export default function ListBox({
	className,
	onChange,
	value,
	...rest
}) {
	const classes = cn('c-listbox', className)
	const handleChange = selected => {
		const e = {
			target: {
				name: rest.name,
				value: selected
			}
		}

		onChange(e)
	}
	
	return (
		<div className={classes}>
			<Box
				className="c-listbox__input"
				onChange={handleChange}
				selected={value || []}
				simpleValue
				{...rest}
			/>
		</div>
	)
}
