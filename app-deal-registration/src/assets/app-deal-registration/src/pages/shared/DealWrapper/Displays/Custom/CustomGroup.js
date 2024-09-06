import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import RGL, { WidthProvider } from 'react-grid-layout'

import CustomInput from './CustomInput'

const ReactGridLayout = WidthProvider(RGL)

export default class CustomGroup extends Component {
	shouldComponentUpdate({ lastGroupUpdated }, prevState) {
		if (lastGroupUpdated === '' || lastGroupUpdated === this.props.group.name) {
			return true
		}
		return false
	}

	render() {
		const { childLayouts, group, inputs, ...rest } = this.props
		const inputsForGroup = inputs[group.id]

		return (
			<Fragment>
				<div className="c-deal-display__header">
					<h5>{group.name}</h5>
				</div>
				<div className="c-deal-display__inputs">
					<ReactGridLayout
						className="c-deal-display__grid"
						cols={12}
						isDraggable={false}
						isResizable={false}
						margin={[10, 40]}
						rowHeight={65}
						useCSSTransforms={false}
					>
						{inputsForGroup.map((input, idx) => (
							<div className="c-deal-display__input" data-grid={childLayouts[idx]} key={childLayouts[idx].i}>
								<CustomInput groupDisplay={group.name} input={input} {...rest } />
							</div>
						))}
					</ReactGridLayout>
				</div>
			</Fragment>
		)
	}
}
