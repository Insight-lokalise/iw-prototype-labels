import React from 'react'
import PropTypes from 'prop-types'

import OverlayBodyParts from './OverlayBodyParts'
import OverlayPropsProvider from './OverlayPropsProvider'

// passes IWOverlayAdvanced's context into OverlayBodyParts and renders children or null based on state
export default function IWOverlayBody(props) {
  return (
    <OverlayPropsProvider
      render={providedProps =>
        providedProps.iwOverlay.showOverlayBody ? (
          <OverlayBodyParts {...providedProps} {...props}>
            {props.children}
          </OverlayBodyParts>
        ) : null
      }
    />
  )
}

IWOverlayBody.propTypes = {
  // defaultProps
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  className: PropTypes.string,
  hideArrow: PropTypes.bool,
  hideHeader: PropTypes.bool,
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right', 'none']),
  title: PropTypes.string,
  useDefaultStyles: PropTypes.bool,
}

IWOverlayBody.defaultProps = {
  children: null,
  className: '',
  hideArrow: false,
  hideHeader: false,
  position: 'right',
  title: '',
  useDefaultStyles: true,
}
