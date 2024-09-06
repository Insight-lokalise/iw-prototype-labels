import React from 'react'
import PropTypes from 'prop-types'

import { t } from '@insight/toolkit-utils/lib/labels'

export default function LineLevelLink(props) {
	const lineLevelInfoText = 'Item information'
	const editLineLevelInfoText = 'Edit item information'
	return props.hideLineLevelLink ? null : (
		<div className="hide-for-print">
			{props.disableLineLevelLink
				? <div className="row expanded is-collapse-child hide-for-print">
						<div className="columns flex-child-auto cart__table-col text-left">
							<span className="cart-item__info">
								{t(lineLevelInfoText)}
							</span>
						</div>
					</div>
				: <a onClick={props.navigateToLineLevelSection} data-gtm-event="line-level-link" className="line-level__edit-link">
						<span className="cart-item__info">
							{t(editLineLevelInfoText)}
						</span>
					</a>}
			<br />
		</div>
	)
}

LineLevelLink.propTypes = {
	disableLineLevelLink: PropTypes.bool.isRequired,
    hideLineLevelLink: PropTypes.bool.isRequired,
    navigateToLineLevelSection: PropTypes.func.isRequired,
}
