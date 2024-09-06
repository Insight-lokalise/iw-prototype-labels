import React, { Component } from 'react'
import cn from 'classnames'
import PropTypes from 'prop-types'
import RGL, { WidthProvider } from 'react-grid-layout'
import { debounce } from '@insight/toolkit-utils'
import { Panel } from 'components'
import { generateLayoutFieldComponent } from '../helpers'

const ReactGridLayout = WidthProvider(RGL)

export default class LayoutGroup extends Component {
	inputs = Object.keys(this.props.inputs).reduce((acc, key) => {
		if (key.split('-')[0] === this.props.group.id) {
			acc.push(this.props.inputs[key])
		}
		return acc
	}, [])

	onDragStart = (layout, oldItem, newItem, placholder, e, element) => {
		e.stopPropagation()
	}

	onLayoutChange = debounce(layout => {
		const { id } = this.props.group
		const item = window.localStorage.getItem('childLayouts')
		if (item) {
			const newLayout = JSON.stringify({
				...(JSON.parse(item)),
				[id]: layout
			})
			window.localStorage.setItem('childLayouts', newLayout)
		} else {
			window.localStorage.setItem('childLayouts', JSON.stringify({
				[id]: layout
			}))
		}
	})

	renderInputs() {
		const { childLayouts } = this.props
		return this.inputs.map((input, index) => (
			<div key={input.id.toString()} data-grid={childLayouts[index]} className="c-builder-layout__input">
				{generateLayoutFieldComponent(input)}
			</div>
		))
	}

	render() {
		const { group, inputs, isEdit } = this.props
		const classes = cn('c-builder-layout__group', {
			'is-default': !isEdit
		})

		return (
			<Panel className={classes}>
				<div className="c-builder-layout__title">
					<h5>{group.name}</h5>
				</div>
				<ReactGridLayout
					cols={12}
					margin={[10, 40]}
					onDragStart={this.onDragStart}
					onLayoutChange={this.onLayoutChange}
					rowHeight={65}
				>
					{this.renderInputs()}
				</ReactGridLayout>
			</Panel>
		)
	}
}
