import React from 'react'
import cn from 'classnames'

export default function CustomSelectInput (props) {
	// We have to hardcode this id here because of the way React-Select handles rendering custom components
	const menuId = 'react-select-continue-shopping__select-dropdown-list'
	const {
		'aria-owns': ariaOwns,
		...rest
	} = props

	return (
		<div
			className="Select-input"
			key="input-wrap"
			style={{ display: 'inline-block' }}
		>
			<input {...rest} />
		</div>
	);
}
