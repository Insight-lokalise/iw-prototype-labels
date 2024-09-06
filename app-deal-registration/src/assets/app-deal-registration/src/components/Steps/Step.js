import React, { Fragment } from 'react'
import cn from 'classnames'
import StepNumber from './Number'

export default function Step({
	className,
	disabled,
	isComplete,
	isSelected,
	onClick,
	status,
	step,
	title,
	...rest
}) {
	const classes = cn('c-step', className, {
		'is-complete': isComplete,
		'is-disabled': disabled,
		'is-incomplete': !isSelected && !isComplete,
		'is-selected': isSelected,
	})

	let titleAppendix = ''
	if (disabled) {
		status = 'disabled'
		titleAppendix = ' is disabled'
	} else if (isComplete) {
		status = 'complete'
		titleAppendix = ' is complete'
	} else if (isSelected) {
		status = status
	} else if (!isComplete && !status) {
		status = 'incomplete'
	}

	const onStepClick = e => {
		if (disabled) {
			return
		}
		onClick(e)
	}

	const buttonTitle = `Step ${step}: ${title}${titleAppendix}`

	return (
		<Fragment>
			<div
				aria-disabled={!!disabled}
				aria-selected={!!isSelected}
				className={classes}
				onClick={onStepClick}
				role="tab"
				tabIndex={disabled ? '-1' : '0'}
				title={buttonTitle}
				{...rest}
			>
				<StepNumber number={step} status={status} />
				<div className="c-step__title">{title}</div>
			</div>
		</Fragment>
	)
}
