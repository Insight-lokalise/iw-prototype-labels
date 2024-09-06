import React from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils'

import { ImageUpload } from '../../Shared'

export default function UploadTab(props) {
  const { selectedImage, setSelectedImage } = props

  return (
    <div className="o-grid o-grid--gutters">
      <div className="o-grid__item u-2/5">
        <div className="o-grid">
          <div className="o-grid__item u-1/1 u-margin-bot">
            <ImageUpload imageUrl={selectedImage} setImageUrl={setSelectedImage}>
              <div className="c-button c-button--secondary u-padding-side-large">{t('Choose a file...')}</div>
            </ImageUpload>
          </div>
          <div className="o-grid__item u-1/1">
            <div className="o-grid">
              <div className="o-grid__item u-1/1 u-margin-bot-small">
                <strong>
                  {t('File requirements')}
                </strong>
              </div>
              <div className="o-grid__item u-1/1 u-font-size-tiny u-margin-bot-small">
                {t('File must be a .jpg or .png format and less than 2MB in size')}
              </div>
              <hr className="u-margin-bot-small" />
              <div className="o-grid__item u-1/1 u-font-size-tiny">
                {
                  t('By uploading an image, you certify that you have the right to distribute the file and that it does not violate copyright agreements.')
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="o-grid__item u-3/5">
        <img src={selectedImage}/>
      </div>
    </div>
  )
}

UploadTab.propTypes = {
  selectedImage: PropTypes.string.isRequired,
  setSelectedImage: PropTypes.func.isRequired,
}
