import React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import PropTypes from 'prop-types'

export default function DraggableListItem({
	children,
	draggableId,
	index,
  isDragDisabled,
}) {
	return (
		<Draggable {...{draggableId, index, isDragDisabled}}>
			{(droppableProvided, droppableSnapshot) => {
        const { draggableProps, dragHandleProps, innerRef } = droppableProvided
        const { isDragging } = droppableSnapshot
        return (
          <div
            className="c-draggable-list__item"
            ref={innerRef}
            {...draggableProps}
          >
            {React.cloneElement(children, {dragHandleProps, isDragging, isDragDisabled})}
          </div>
        )
      }}
		</Draggable>
	)
}

DraggableListItem.propTypes = {
	children: PropTypes.node.isRequired,
	draggableId: PropTypes.string.isRequired,
	index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  isDragDisabled: PropTypes.bool.isRequired,
}
