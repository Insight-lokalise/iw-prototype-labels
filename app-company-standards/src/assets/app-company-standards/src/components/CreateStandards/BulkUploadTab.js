import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Icon } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

import { FileUpload } from '../Shared'
import { postBulkUpload } from '../../api'

export default function BulkUploadTab({ locale, productSetId }) {
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState('')
  const [isUploading, setIsUploading] = useState(null)

  const uploadIsDisabled = !file || isUploading

  function handleFileSelect(fileUpload, fileInfo) {
    setFileName(fileInfo.name)
    setFile({ data: fileUpload })
  }

  function handleBulkUpload() {
    setIsUploading(true)
    return postBulkUpload({ data: file, locale, productSetId })
      .then(reset)
      .catch(reset)
  }

  function reset() {
    setFile(null)
    setFileName('')
    setIsUploading(false)
  }

  return (
    <div className="o-grid">
      <div className="o-grid__item u-1/1">
        <div className="o-grid o-grid--gutters u-font-size-tiny">
          <div className="o-grid__item u-1/1">
            <span>{t('Bulk upload allows you to upload multiple parts to a product set via a provided template.')}</span>
            <ol>
              <li>{t('Download the template file if needed.')}</li>
              <li>
                {
                  t('Enter desired data into the template. Document file names must be less than 50 characters in length and may only contain letters, numbers, dashes, and underscores. Must be saved in .xls format only.')
                }
              </li>
              <li>{t('Import your list of parts by clicking Choose File.')}</li>
              <li>{t('Click Add to set to add the parts to this product set.')}</li>
            </ol>
          </div>
        </div>
      </div>
      <div className="o-grid__item u-1/1">
        <Button
          className="u-padding-tiny u-padding-bot-none"
          color="link"
          download="Bulk_upload_template"
          href={
            'https://insightonline-my.sharepoint.com/personal/arseniy_andriushchenko_insight_com/_layouts/15/Doc.aspx?OR=teams&action=edit&sourcedoc={e001b2f2-137b-49f1-9ad4-9eea9403cdf1}'
          }
        >
          <span className="u-margin-right-tiny"> {t('Download template file')}</span>
          <Icon icon="download" />
        </Button>
      </div>
      <div className="o-grid__item u-1/1 u-margin-bot">
        <FileUpload id={`bulk-upload`} fileUrl={fileName} onRemoveUpload={reset} onUpload={handleFileSelect}>
          <div className="c-button c-button--secondary u-padding-side-large">
            <span className="u-margin-right-tiny">{t('Choose a file')}</span>
            <Icon icon="keypad" />
          </div>
        </FileUpload>
      </div>
      <div className="o-grid__item u-1/1">
        <Button color="primary" isDisabled={uploadIsDisabled} onClick={handleBulkUpload}>
          {t('Add to set')}
        </Button>
      </div>
    </div>
  )
}

BulkUploadTab.propTypes = {
  locale: PropTypes.string.isRequired,
  productSetId: PropTypes.string.isRequired,
}
