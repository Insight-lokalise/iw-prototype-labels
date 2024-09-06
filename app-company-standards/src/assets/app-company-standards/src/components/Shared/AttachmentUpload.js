import React from 'react'
import PropTypes from 'prop-types'

import { postToAttachmentAlbum } from '../../api'
import { FileUpload } from './'

export default function AttachmentUpload({ children, disabled, fileUrl, psID, setFileUrl, webGroupId }) {
  function handleFileUpload(fileUpload) {
    return postToAttachmentAlbum({ data: fileUpload, psID, wId: webGroupId })
      .then(res => {
        setFileUrl(res)
      })
      .catch(() => {
        setFileUrl('')
      })
  }

  return (
    <FileUpload
      disabled={disabled}
      id={`attachment-upload`}
      fileUrl={fileUrl}
      onRemoveUpload={() => {
        setFileUrl('')
      }}
      onUpload={handleFileUpload}
    >
      {children}
    </FileUpload>
  )
}

AttachmentUpload.propTypes = {
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  fileUrl: PropTypes.string.isRequired,
  psID: PropTypes.string.isRequired,
  setFileUrl: PropTypes.func.isRequired,
  webGroupId: PropTypes.number.isRequired,
}

AttachmentUpload.defaultProps = { disabled: false }