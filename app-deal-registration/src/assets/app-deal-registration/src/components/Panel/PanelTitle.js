import React from 'react'
import PropTypes from 'prop-types'

export default function PanelTitle({ children }) {
	return <div className="c-panel__title">{children}</div>
}

PanelTitle.propTypes = {
	children: PropTypes.node.isRequired
}
