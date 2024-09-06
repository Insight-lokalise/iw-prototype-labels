import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import PanelBody from './PanelBody'
import PanelTitle from './PanelTitle'

export default function Panel({
	children,
	className,
	isEmphasized,
	panelRef,
	...rest
}) {
	const classes = cn('c-panel', {
		'c-panel--emphasized': isEmphasized
	}, className)

	return (
		<div className={classes} ref={panelRef} {...rest}>
			{children}
		</div>
	)
}

Panel.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string
};

Panel.defaultProps = {
	children: null,
	className: ''
};

/**
 * Attach the sub-components to the parent component.
 */
Panel.Body = PanelBody;
Panel.Title = PanelTitle;
