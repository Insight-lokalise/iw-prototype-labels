import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { debounce } from '@insight/toolkit-utils'
import RGL, { WidthProvider } from 'react-grid-layout'
import { generateDefaultLayout } from '../helpers'
import LayoutGroup from './LayoutGroup'

const ReactGridLayout = WidthProvider(RGL)

export class Layout extends Component {
	static propTypes = {
		groups: PropTypes.shape({}),
		inputs: PropTypes.shape({}),
		isEdit: PropTypes.bool.isRequired
	}
	
	// Generate the defaultLayout no matter what to account for new groups
	defaultLayout = generateDefaultLayout(this.props.groups, this.props.inputs)

	groups = Object.keys(this.props.groups).map(key => {
		return this.props.groups[key]
	})

	onLayoutChange = layout => {
		window.localStorage.setItem('groupLayouts', JSON.stringify(layout))
	}

	getLayoutForGroup = (group, idx) => {
		const { isEdit } = this.props

		let childLayouts, layoutProps
		if (isEdit && group.layout.x) {
			childLayouts = this.props.childLayouts[group.id]
			layoutProps = { ...group.layout, i: group.id.toString() }
		} else {
			childLayouts = this.defaultLayout[group.id].childLayouts
			layoutProps = { ...this.defaultLayout[group.id].layout }
		}

		const possibleSavedLayout = window.localStorage.getItem('groupLayouts')
		const possibleChildLayout = window.localStorage.getItem('childLayouts')
		if (possibleSavedLayout) {
			const layouts = JSON.parse(possibleSavedLayout)
			layoutProps = { ...layouts[idx] }
		}
		if (possibleChildLayout) {
			const layouts = JSON.parse(possibleChildLayout)
			childLayouts = layouts[group.id]
		}

		//console.log(childLayouts)
		//console.log(layoutProps)
		return { childLayouts, layoutProps }
	}

	renderGroups = () => {
		const { groups, inputs, isEdit } = this.props
		return Object.keys(groups).map((key, idx) => {
			const group = groups[key]
			const { childLayouts, layoutProps } = this.getLayoutForGroup(group, idx)
			return (
				<div data-grid={layoutProps} key={key}>
					<LayoutGroup childLayouts={childLayouts} group={group} inputs={inputs} isEdit={isEdit} />
				</div>
			)
		})
	}

	render() {
		return (
			<div className="c-builder-layout">
				<ReactGridLayout
					cols={12}
					draggableCancel=".no-drag"
					isDraggable
					isResizable
					margin={[10, 25]}
					onLayoutChange={this.onLayoutChange}
					rowHeight={65}
				>
					{this.renderGroups()}
				</ReactGridLayout>
			</div>
		)
	}
}

const mapStateToProps = state => ({
	childLayouts: state.builder.groups.childLayouts,
	groups: state.builder.groups.groups,
	inputs: state.builder.inputs.inputs
})

export default connect(mapStateToProps)(Layout)
