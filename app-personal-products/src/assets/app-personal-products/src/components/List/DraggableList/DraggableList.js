import React, { Component } from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import PropTypes from 'prop-types'
import DraggableListItem from './DraggableListItem'

export default class DraggableList extends Component {
	static Item = DraggableListItem

	render() {
		const { children, droppableId, onDragEnd } = this.props
		return (
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId={droppableId}>
					{({ innerRef }) => (
						<div className="c-draggable-list" ref={innerRef}>
							{children}
						</div>
					)}
				</Droppable>
			</DragDropContext>
		)
	}
}

DraggableList.propTypes = {
	children: PropTypes.node.isRequired,
	droppableId: PropTypes.string.isRequired,
	onDragEnd: PropTypes.func.isRequired
}
