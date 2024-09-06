import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Loading } from "@insight/toolkit-react";
import { postToImageAlbum } from '../../api'
import { FileUpload } from '../Shared'
import { selector_wId } from '../../duck'

function mapStateToProps(state) {
  return { webGroupId: selector_wId(state) }
}

function ImageUpload(props) {
  const { imageUrl, setImageUrl, webGroupId } = props
  const [isUploading, setIsUploading] = useState(false)

  function handleUpload(fileUpload) {
    setIsUploading(true)
    return postToImageAlbum({ data: fileUpload, wId: webGroupId })
      .then(res => {
        setImageUrl(res)
        setIsUploading(false)
      })
      .catch(() => {
        setImageUrl('')
      })
  }

  return (
    <FileUpload
      id="imageUpload"
      fileUrl={imageUrl}
      onRemoveUpload={() => {
        setImageUrl('')
      }}
      onUpload={handleUpload}
      accept={['image/jpeg', 'image/png']}
      acceptError='File must be a JPG, JPEG, or PNG format'
      isUploading={isUploading}
    >
      {props.children}
    </FileUpload>
  )
}

ImageUpload.propTypes = {
  children: PropTypes.node.isRequired,
  imageUrl: PropTypes.string.isRequired,
  setImageUrl: PropTypes.func.isRequired,
  webGroupId: PropTypes.number.isRequired,
}

export default connect(mapStateToProps)(ImageUpload)
