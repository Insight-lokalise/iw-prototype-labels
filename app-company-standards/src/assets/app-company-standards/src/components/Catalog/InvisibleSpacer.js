import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

const InvisibleSpacer = ({ hasRightBorder, isSmall }) => (
  <div
    className={cn(
      hasRightBorder
        ? "c-invisible-spacer--border-right"
        : "c-invisible-spacer",
      isSmall
        ? "c-invisible-spacer-width--small"
        : "c-invisible-spacer-width",
      "o-box"
    )}
  />
);

InvisibleSpacer.propTypes = {
  hasRightBorder: PropTypes.bool,
  isSmall: PropTypes.bool, 
}

InvisibleSpacer.defaultProps = {
  hasRightBorder: false,
  isSmall: false,
}

export default InvisibleSpacer
