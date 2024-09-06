import React from 'react'
import cn from 'classnames'
import { Icon } from '@insight/toolkit-react'
import { generateClassesFromMap } from '@insight/toolkit-utils'

import { STEP_NUMBER_CLASS_MAP } from './classes'

const statusToIconMap = {
	complete: 'checkmark',
	danger: 'close',
	warning: 'alert'
}

export default function StepNumber({
	className,
	number,
	status,
	...rest
}) {
	const derivedClasses = generateClassesFromMap({ status }, STEP_NUMBER_CLASS_MAP)
	const classes = cn('c-step-number', derivedClasses, className)

	const content = statusToIconMap[status]
		? <Icon className="c-step-number__icon" icon={statusToIconMap[status]} />
		: number

	return (
		<div className={classes} {...rest}>
			{content}
		</div>
	)
}
