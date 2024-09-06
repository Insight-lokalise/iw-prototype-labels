import React, { useState, Fragment } from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils'
import { Icon, Loading } from '@insight/toolkit-react'

import FileListItem from './FileListItem'

export default function FileUpload({ id, children, disabled, text, fileList, fileUrl, accept, acceptError, onRemoveUpload, onUpload, isUploading }) {
  const [error, setError] = useState(null)
  // TODO: add support for passing in an array of file types
  function handleChange(e) {
    const file = e.target.files[0]
    if (!file) return
    const { type } = file
    if (type && accept) {
      if (!type || !accept.includes(type.toLowerCase())) {
        setError(t(acceptError))
        return
      }
    }
    if ((file.size / 1000000) > 2) {
      setError(t('File size must be less than 2 MB'))
      return
    }
    if (file.name.length > 100) {
      setError(t('File name must be 100 characters or less'))
      return
    }
    setError(null)
    const formData = new FormData()
    formData.append('fileUpload', file)

    onUpload(formData, file)
  }

  const acceptString = accept.toString()

  return (
    <Fragment>
      <div>
        <label className="c-button c-button--inline-link" htmlFor={`fileUpload-${id}`}>
          {disabled ? null : (children || text)}
          <input
            className="u-hide"
            id={`fileUpload-${id}`}
            name={text}
            type="file"
            files={fileList}
            onChange={handleChange}
            accept={acceptString}
          />
        </label>
      </div>
      {isUploading && (
        <div className="o-grid__item o-grid__item--shrink">
          <Loading />
        </div>
      )}
      {error && (
        <div>
          <small className="c-form__error">
            <Icon type="error" icon="alert" className="c-form__error-icon" />
            {error}
          </small>
        </div>
      )}
      <div>
        {fileList.length > 0
          ? fileList.map(file => (
            <FileListItem disabled={disabled} file={file} onRemove={onRemoveUpload} />
          )) : fileUrl ? (
            <FileListItem disabled={disabled} fileUrl={fileUrl} onRemove={onRemoveUpload} />
          ) : (
            <div className="o-grid o-grid--center" />
          )}
      </div>
    </Fragment>
  )
}

FileUpload.propTypes = {
  children: PropTypes.node,
  disabled: PropTypes.bool,
  fileList: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired })),
  fileUrl: PropTypes.string,
  id: PropTypes.string.isRequired,
  onRemoveUpload: PropTypes.func.isRequired,
  onUpload: PropTypes.func.isRequired,
  text: PropTypes.string,
  accept: PropTypes.arrayOf(PropTypes.string),
  acceptError: PropTypes.string,
  isUploading: PropTypes.bool.isRequired
}

FileUpload.defaultProps = {
  disabled: false,
  fileList: [],
  fileUrl: '',
  children: null,
  text: 'Choose file',
  acceptError: 'File must be a XLS, XLSX, PDF, PPT, PPTX, DOC, or DOCX format',
  accept: [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
}
