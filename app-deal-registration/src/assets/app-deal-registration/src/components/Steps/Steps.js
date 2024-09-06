import React, { memo } from 'react'
import cn from 'classnames'
import defaultRenderer from './defaultRenderer'

const Steps = memo(({ className, render, steps, ...rest }) => {
	const classes = cn('c-steps', className)
	return (
		<div className={classes} role="tablist" {...rest}>
			{typeof render === 'function' ? render(steps) : defaultRenderer(steps)}
		</div>
	)
})

export default Steps
