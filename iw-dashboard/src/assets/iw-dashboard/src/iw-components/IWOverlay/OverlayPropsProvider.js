import React from 'react'
import PropTypes from 'prop-types'

// this component passes in the context from IWOverlayAdvanced to it's render prop
export default function OverlayPropsProvider(props, context) {
  const { render, ...passedProps } = props
  const wrappedComponentProps = { ...passedProps, iwOverlay: { ...context.iwOverlay } }
  return render(wrappedComponentProps)
}

OverlayPropsProvider.contextTypes = {
  iwOverlay: PropTypes.shape({
    showOverlayBody: PropTypes.bool.isRequired,
    unmountOverlay: PropTypes.func.isRequired,
  }).isRequired,
}

OverlayPropsProvider.propTypes = {
  render: PropTypes.func.isRequired,
}
