import React from 'react'
import PropTypes from 'prop-types'
import Message from '@insight/toolkit-react/lib/Message/Message'

export default function ErrorMessage({ type, resultType }) {
  const ERROR_TYPES = {
    server: {
      type: "error",
      message: `Something went wrong. We're looking into it.`
    },
    noResult: {
      type: "warning",
      message: `Your search returned no results. Refine your search and try again`
    },
    resultSizeExceeded: {
      type: "warning",
      message: `Your search returned a large number of results. Please refine your search if you are unable to find the intended ${resultType}.`
    },
  }
  return (
    <div className="o-grid">
      <Message className="o-grid__item u-1/2" type={ERROR_TYPES[type].type}>{ERROR_TYPES[type].message}</Message>
    </div>
  )
}

ErrorMessage.propTypes = {
  type: PropTypes.string.isRequired,
  resultType: PropTypes.string.isRequired
}