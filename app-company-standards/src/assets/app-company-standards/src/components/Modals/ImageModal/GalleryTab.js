import React, { useEffect, useState, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Button, Field } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

import { fetchImageAlbum, deleteImage as deleteImageApi } from '../../../api'

export default function GalleryTab(props) {
  const [images, setImages] = useState([])

  useEffect(() => {
    fetchImageAlbum({ wId: props.webGroupId }).then(nextImages => {
      setImages(nextImages)
    })
  }, [props.webGroupId])
  const {currentSelected} = props

  function deleteImage(image) {
    deleteImageApi({wId: props.webGroupId, fileUrl: image}).then(()=>{
      setImages(images.filter(img => img!=image))
    })
  }
  return (
    <div className="o-grid c-gallery-images">
      <div className="o-grid__item u-1/1">
        <div className="o-grid">
          {images.map(image => {
            const name = image.split(/\d+\/cs\//)[1]
            const nameArray = name.split(".")
            const displayName = (nameArray[0].length > 15) ? nameArray[0].substr(0, 14) + '....' + nameArray[1] : name
            const checkboxLabel = image === currentSelected ? t("Currently selected") : t("Select this image")
            return (
              <div key={image} className="o-grid__item u-1/3 u-margin-bot-small">
                <Button
                  className="c-gallery-image__button"
                  color="link"
                  onClick={() => {
                    props.setSelectedImage(image)
                  }}
                >
                  <img className="c-gallery-image__item" src={image} alt={name} />
                </Button>
                <div className="u-margin-bot-small u-word-break">{displayName}</div>
                <div className="o-grid o-grid--center o-grid--justify-between">
                  <div className="o-grid__item">
                    <Field
                      checkboxLabel={checkboxLabel}
                      checked={image === currentSelected}
                      fieldComponent={'Checkbox'}
                      handleChange={() => props.setSelectedImage(image)}
                      name={'selectThisImage'}
                    />
                  </div>
                  {image !== currentSelected &&
                    <div className="o-grid__item">
                      <Button className="c-gallery-image__delete"
                              color="link"
                              onClick={() => deleteImage(image)}
                      >
                        {t('Delete')}
                      </Button>
                    </div>
                  }
                </div>

            </div>
          )
          })}
        </div>
      </div>
    </div>
  )
}

GalleryTab.propTypes = {
  setSelectedImage: PropTypes.func.isRequired,
  webGroupId: PropTypes.number.isRequired,
}
