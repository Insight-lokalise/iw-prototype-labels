import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { removeUniversalField } from 'state/modules/builder'

import GroupAccordion from '../GroupAccordion'
import UniversalGroups from './UniversalGroups'

export function Universal({ groups }) {
	return (
		<div className="c-builder-fields__universal">
			<GroupAccordion
				buttonContent={(<h3>Universal fields</h3>)}
				id="universal-fields"
				key="universal-fields"
			>
				<UniversalGroups groups={groups}/>
			</GroupAccordion>
		</div>
	)
}

const mapStateToProps = state => ({
	groups: state.builder.universal.groups
})

export default connect(mapStateToProps)(Universal)
