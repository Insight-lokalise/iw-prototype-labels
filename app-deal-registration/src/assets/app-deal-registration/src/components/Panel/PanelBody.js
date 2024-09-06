import React from 'react';
import PropTypes from 'prop-types';

/**
 * The main body section of a panel, where the main content lives.
 */
export default function PanelBody({ children }) {
	return <div className="o-box  c-panel__body">{children}</div>;
}

PanelBody.propTypes = {
	children: PropTypes.node.isRequired
};
