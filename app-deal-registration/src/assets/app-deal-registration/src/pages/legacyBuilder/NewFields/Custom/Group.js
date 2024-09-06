import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, Icon } from '@insight/toolkit-react'
import { clearGroupError, removeGroup, setGroupError, updateGroup } from 'state/modules/builder'
import { setModalClosed, setModalOpen } from 'state/newModules/shared'

import GroupAccordion from '../GroupAccordion'
import GroupDisplay from './GroupDisplay'

export class Group extends Component {
	handleGroupError = error => {
		const { clearGroupError, groupError, groupId, setGroupError } = this.props
		if (error && !groupError) {
			setGroupError(groupId)
		} else if (!error && groupError) {
			clearGroupError(groupId)
		}
	}

	removeGroup = () => {
		const { groupId, removeGroup, removePrompt, setModalClosed, setModalOpen } = this.props
		if (!removePrompt) {
			removeGroup(groupId)
		} else {
			setModalOpen({
				modalType: 'CONFIRM_GROUP_DELETE_MODAL',
				modalProps: {
					confirmDelete: () => removeGroup(groupId),
					onClose: setModalClosed
				}
			})
		}
	}

	updateGroup = ({ target: { name, value }}, error) => {
		const { groupId, updateGroup } = this.props
		updateGroup({ groupId, name, value })
		this.handleGroupError(error)
	}

	validateGroup = value => {
		if (!value) {
			return 'Sorry, this field is required'
		}
	}

	render() {
		const { emitter, group, groupError, groupId } = this.props
		return (
			<div className="c-builder-fields__group">
				<GroupAccordion
					buttonContent={(<h3>{group.name || 'New group'}</h3>)}
					extraAction={(
						<Button className="c-builder-fields__accordion-remove" onClick={this.removeGroup}>
							<Icon type="error" icon="trashcan" />
						</Button>
					)}
					id={groupId}
					key={groupId}
				>
					<GroupDisplay
						emitter={emitter}
						group={group}
						groupError={groupError}
						groupId={groupId}
						updateGroup={this.updateGroup}
						validateGroup={this.validateGroup}
					/>
				</GroupAccordion>
			</div>
		)
	}
}

const mapStateToProps = (initialState, { groupId }) => state => ({
	removePrompt: state.shared.preferences.removeGroupPrompt,
	group: state.builder.groups.groups[groupId],
	groupError: state.builder.groups.groupErrors[groupId]
})

const mapDispatchToProps = dispatch => ({
	clearGroupError: groupId => dispatch(clearGroupError(groupId)),
	setGroupError: groupId => dispatch(setGroupError(groupId)),
	setModalClosed: () => dispatch(setModalClosed()),
	setModalOpen: payload => dispatch(setModalOpen(payload)),
	removeGroup: groupId => dispatch(removeGroup(groupId)),
	updateGroup: payload => dispatch(updateGroup(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(Group)
