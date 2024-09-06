import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { validateBuilderState } from './helpers'

import {
	setRestrictedGroups,
	updateGroupLayouts,
	unsetRestrictedGroups
} from 'state/modules/builder'

export class Manager extends Component {
	componentDidMount() {
		const { emitter } = this.props
		emitter.on('validate', this.handleValidate)
		emitter.on('saveLayouts', this.saveLayouts)
		emitter.on('transitionStep', this.transitionStep)
	}

	componentWillUnmount() {
		const { emitter } = this.props
		emitter.removeListener('validate', this.handleValidate)
		emitter.removeListener('saveLayouts', this.saveLayouts)
		emitter.removeListener('transitionStep', this.transitionStep)
	}

	handleValidate = index => {
		const { 
			groupIds, 
			groups,
			handleStepClick, 
			inputs,
			restrictGroups,
			setRestrictedGroups,
			unsetRestrictedGroups
		} = this.props
		
		if (!groupIds.length > 0) {
			setToast('no-custom-inputs')
			return
		}

		const {
			groupErrors,
			inputErrors,
			nonUniqueIds = [],
			uniqueIds
		} = validateBuilderState(groups, inputs)

		const inputErrorKeys = Object.keys(inputErrors)
		const keysByGroup = inputErrorKeys.map(id => id.split('-')[0])
		const combinedErrors = Array.from(new Set([...groupErrors, ...keysByGroup]))

		if (combinedErrors.length > 0 || ((inputErrors[inputErrorKeys[0]] && inputErrors[inputErrorKeys[0]].length > 0) || nonUniqueIds.length > 0)) {
			setRestrictedGroups({
				groupIds: groupErrors,
				groupsWithErrors: combinedErrors,
				inputErrors,
				inputIds: inputErrorKeys,
				nonUniqueIds,
				uniqueIds
			})
			this.props.emitter.emit('add-toast', {
				color: 'error',
				id: 'restricted-groups-toast',
				text: <p>Some of your inputs have the same ID!</p>
			})
			return
		}

		if (!groupErrors.length > 0 && combinedErrors.length <= inputErrorKeys.length) {
			if (restrictGroups) {
				unsetRestrictedGroups()
			}
			handleStepClick(index)
		}
	}

	saveLayouts = index => {
		const { handleStepClick, updateGroupLayouts } = this.props
		const groupLayouts = JSON.parse(window.localStorage.getItem('groupLayouts'))
		const childLayouts = JSON.parse(window.localStorage.getItem('childLayouts'))
		updateGroupLayouts({ childLayouts, groupLayouts })
		handleStepClick(index)
	}

	transitionStep = index => {
		this.props.handleStepClick(index)
	}

	render() {
		return null
	}
}

const mapStateToProps = state => ({
	groupIds: state.builder.groups.groupIds,
	groups: state.builder.groups.groups,
	inputs: state.builder.inputs.inputs,
	restrictGroups: state.builder.groups.restrictGroups
})

const mapDispatchToProps = dispatch => ({
	setRestrictedGroups: payload => dispatch(setRestrictedGroups(payload)),
	setToast: payload => dispatch(setToast(payload)),
	updateGroupLayouts: ({ childLayouts, groupLayouts }) => dispatch(updateGroupLayouts({ childLayouts, groupLayouts })),
	unsetRestrictedGroups: () => dispatch(unsetRestrictedGroups())
})

export default connect(mapStateToProps, mapDispatchToProps)(Manager)
