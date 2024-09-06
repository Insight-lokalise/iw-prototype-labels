import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addGroup } from 'state/modules/builder'

import Group from './Group'

export class Custom extends Component {
	componentDidMount() {
		if (!this.props.groupIds.length > 0) {
			this.props.addGroup()
		}
	}
	
	render() {
		const { emitter, groupIds, groupsWithErrors, restrictGroups } = this.props
		// Eventually make this groups with errors only if restricted is true
		const groupsToMap = groupIds

		if (!groupsToMap.length > 0) {
			return null
		}

		return groupsToMap.map(groupId => (
			<Group emitter={emitter} groupId={groupId} key={groupId} />
		))
	}
}

const mapStateToProps = state => ({
	groupIds: state.builder.groups.groupIds,
	groupsWithErrors: state.builder.groups.groupsWithErrors,
	restrictGroups: state.builder.groups.restrictGroups
})

const mapDispatchToProps = dispatch => ({
	addGroup: () => dispatch(addGroup())
})

export default connect(mapStateToProps, mapDispatchToProps)(Custom)
