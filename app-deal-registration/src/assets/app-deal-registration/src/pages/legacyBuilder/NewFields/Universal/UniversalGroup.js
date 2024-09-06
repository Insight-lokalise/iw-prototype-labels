import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import UniversalInput from './UniversalInput'

export function UniversalGroup({
	groupId,
	inputIds,
	name,
}) {
	return (
		<Fragment>
			<div className="c-builder-fields__universal-group__name">
				<p>{name}</p>
			</div>
			<div className="c-builder-fields__universal-inputs o-grid o-grid--gutters-small">
				{inputIds.map(id => (
					<UniversalInput
						inputId={id}
						key={id}
					/>
				))}
			</div>
		</Fragment>
	)
}

const mapStateToProps = (initialState, { groupId }) => state => ({
	inputIds: state.builder.universal.inputIds.filter(
		id => id.split('-')[0] === groupId
	)
})

export default connect(mapStateToProps)(UniversalGroup)
