import React from 'react'
import Step from './Step'

export default function defaultRenderer(steps) {
	return steps.map((step, index) => {
		const {
			children,
			className,
			disabled,
			isSelected,
			onClick,
			...rest
		} = step

		return (
			<Step
				className={className}
				disabled={disabled}
				isSelected={isSelected}
				key={index}
				onClick={onClick}
				step={index + 1}
				{...rest}
			>
				{children}
			</Step>
		)
	})
}
