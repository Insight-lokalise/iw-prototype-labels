import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { Icon } from '@insight/toolkit-react'

const getIconType = direction => direction === 'right' ? 'arrow-right' : 'arrow-left'
const getLabel = (direction, isMoveAll) => `Move${isMoveAll ? ' all' : ''} ${direction}`
const renderIcons = (type, isMoveAll) => isMoveAll
	? <Fragment><Icon icon={type} /><Icon icon={type} /></Fragment>
	: <Icon icon={type} />

export default function Action({
	direction,
	disabled,
	isMoveAll,
	onClick
}) {
	const handleClick = () => {
		onClick({ direction, isMoveAll })
	}

	const iconType = getIconType(direction)
	const label = getLabel(direction, isMoveAll)
	const icons = renderIcons(iconType, isMoveAll)
	const classes = cn('c-listbox__move', {
		'c-listbox__move-all': isMoveAll,
		'c-listbox__move-right': direction === 'right',
		'c-listbox__move-left': direction === 'left'
	})

	return (
		<button
			aria-label={label}
			className={classes}
			disabled={disabled}
			onClick={handleClick}
			type="button"
		>
			{icons}
		</button>
	)
}
