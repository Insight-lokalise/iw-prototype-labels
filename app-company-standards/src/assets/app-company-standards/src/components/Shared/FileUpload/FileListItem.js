import React from 'react'
import PropTypes from 'prop-types'

import { Icon } from '@insight/toolkit-react'

export default function FileListItem({ disabled, file, fileUrl, onRemove }) {
  function fileDisplayName() {
    const fileName = fileUrl.split('/')
    return fileName[fileName.length - 1]
  }

  return (
    <span className="u-font-size-tiny u-word-break">
      {file.name || fileDisplayName(fileUrl)}
      {disabled ? null : (
        <Icon
          icon="close"
          size="small"
          onClick={() => {
            onRemove(file)
          }}
          className="c-cs-admin__discontinued-product-icon"
        />
      )}
    </span>
  )
}

FileListItem.propTypes = {
  disabled: PropTypes.bool,
  file: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
  fileUrl: PropTypes.string,
  onRemove: PropTypes.func.isRequired,
}

FileListItem.defaultProps = {
  disabled: false,
  file: { name: '' },
  fileUrl: '',
}
