import React from 'react'
import PropTypes from 'prop-types';
import { Message } from '@insight/toolkit-react'
import CatalogFieldInfo from './CatalogFieldInfo';

export default function RunCountMessage({ message }) {

  return (
      <Message type="error">{message}</Message>
  )

}

RunCountMessage.propTypes = {
  message: PropTypes.string.isRequired
}
