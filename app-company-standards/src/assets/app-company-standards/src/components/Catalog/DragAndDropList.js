import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Droppable, Draggable } from 'react-beautiful-dnd'

export default function DragAndDropList(props) {
  useEffect(() => {
    const { itemOrder, type } = props
    props.registerDraggableGroup({ itemOrder, type })
  }, [props.itemOrder])

  return (
    <Droppable droppableId={props.droppableId} type={props.type}>
      {droppableProvided => (
        <div className='o-grid' ref={droppableProvided.innerRef}>
          <div className='o-grid__item u-1/1'>
            {React.Children.map(props.children, (child, index) => (
              <Draggable
                key={`${props.droppableId}-${child.props.id}`}
                draggableId={`${props.droppableId}-${child.props.id}`}
                isDragDisabled={props.isShared}
                index={index}
              >
                {draggableProvided => React.cloneElement(child, { draggableProvided })}
              </Draggable>
            ))}
            {droppableProvided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  )
}

DragAndDropList.propTypes = {
  children: PropTypes.node,
  droppableId: PropTypes.string.isRequired,
  itemOrder: PropTypes.arrayOf(PropTypes.string).isRequired,
  registerDraggableGroup: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
}

DragAndDropList.defaultProps = {
  children: null,
}
