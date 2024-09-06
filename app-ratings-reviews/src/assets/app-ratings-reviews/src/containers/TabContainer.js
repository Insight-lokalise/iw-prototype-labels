import React, { cloneElement } from 'react'
import PropTypes from 'prop-types'

export default function TabContainer(props) {
  return cloneElement(props.children)
}

TabContainer.propTypes = {
  label: PropTypes.string.isRequired,
}
