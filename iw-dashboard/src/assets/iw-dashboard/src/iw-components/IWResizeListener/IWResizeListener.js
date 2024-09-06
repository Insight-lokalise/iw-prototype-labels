import React from 'react'
import PropTypes from 'prop-types'
import Measure from 'react-measure'

/**
 * finds the size of it's containing div
 * @param {object} props see propTypes below
 */
export function IWResizeListener(props) {
  return (
    <Measure bounds onResize={props.onResize}>
      {({ measureRef }) => <div ref={measureRef} />}
    </Measure>
  )
}

IWResizeListener.propTypes = {
  onResize: PropTypes.func.isRequired,
}
