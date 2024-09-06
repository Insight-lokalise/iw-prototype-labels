import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addInput } from 'state/modules/builder'

import FieldGroup from './FieldGroup'
import GroupOptions from './GroupOptions'

export class GroupFields extends Component {
	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.inputIds.length === 0 && prevState.removeEnabled) {
			return { removeEnabled: false }
		}
		return null
	}

	state = {
		removeEnabled: false
	}

	addInput = () => {
		this.props.addInput(this.props.groupId)
		this.props.emitter.emit('heightChange')
	}

	toggleRemove = () => {
		this.setState(prevState => ({
			removeEnabled: !prevState.removeEnabled
		}))
	}



	render() {
		const { groupId, inputIds } = this.props
		const { removeEnabled } = this.state

		return (
			<Fragment>
				<div>
					{inputIds.map(input => (
						<FieldGroup
							groupId={groupId}
							inputId={input}
							key={input}
							removeEnabled={removeEnabled}
						/>
					))}
				</div>
				<GroupOptions
					addInput={this.addInput}
					removeEnabled={removeEnabled}
					toggleRemove={this.toggleRemove}
				/>
			</Fragment>
		)
	}
}

const mapStateToProps = (initialState, { groupId }) => state => ({
	inputIds: state.builder.inputs.inputIds.filter(
		id => id.split('-')[0] === groupId
	)
})

const mapDispatchToProps = dispatch => ({
	addInput: groupId => dispatch(addInput(groupId))
})

export default connect(mapStateToProps, mapDispatchToProps)(GroupFields)
