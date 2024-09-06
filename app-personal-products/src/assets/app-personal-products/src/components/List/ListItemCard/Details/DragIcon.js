import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from '@insight/toolkit-react'

export default function DragIcon({ dragHandleProps, isDragDisabled }) {
	return (
		<div className="c-item-card__drag o-grid__item o-grid__item--shrink" {...dragHandleProps}>
      {!isDragDisabled && <Icon icon="move" className="c-item-card__drag-icon" title="Drag" /> }
		</div>
	)
}

DragIcon.propTypes = {
	dragHandleProps: PropTypes.shape({}),
  isDragDisabled: PropTypes.bool.isRequired,
}

DragIcon.defaultProps = {
	dragHandleProps: {}
}
