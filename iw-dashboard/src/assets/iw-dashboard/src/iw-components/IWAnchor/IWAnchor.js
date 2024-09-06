import React from 'react'
import PropTypes from 'prop-types'

/**
 * A wrapper for an <a> tag.
 *
 * Do we want to enforce any properties on an Anchor?
 * Do we want to apply any global styles?
 *
 * Will later integrate with / be replaced by react-router's Link
 *
 * @param {Object} props Any normal property you would apply to an <a>.
 */
export function IWAnchor(props) {
  return <a {...props}>{props.children}</a>
}

IWAnchor.propTypes = {
  href: PropTypes.string,
}

IWAnchor.defaultProps = {
  href: 'javascript:void(0)',
}
