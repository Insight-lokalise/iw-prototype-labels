import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, ButtonGroup, Modal, TabManager } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

import GalleryTab from './GalleryTab'
import UploadTab from './UploadTab'
export default function ImageModal(props) {

  const [selectedImage, setSelectedImage] = useState(props.selectedImage)

  const UPLOAD_IMAGE = {
    content: <UploadTab selectedImage={selectedImage} setSelectedImage={setSelectedImage} />,
    id: 'upload-image',
    name: t('Upload an image')
  }

  const IMAGE_GALLERY = {
    content: <GalleryTab setSelectedImage={setSelectedImage} webGroupId={props.webGroupId} currentSelected={selectedImage} />,
    id: 'image-gallery',
    name: t('Image gallery')
  }
  
  const tabs = [UPLOAD_IMAGE, !props.hideGallery && IMAGE_GALLERY];

  return (
    <Modal isOpen onClose={props.onClose} size="medium">
      <div className="u-padding">
        <div className="u-margin-bot">
          <TabManager className=" c-tab-manager" initialSelectedTab={tabs[0]} tabs={tabs} />
        </div>
        <div>
          <ButtonGroup align="right">
            <Button
              color="secondary"
              onClick={() => {
                props.onClose()
              }}
            >
              {t('Cancel')}
            </Button>
            <Button
              color="primary"
              isDisabled={!selectedImage}
              onClick={() => {
                props.onConfirm(selectedImage)
                props.onClose()
              }}
            >
              {t('Use image')}
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </Modal>
  )
}

ImageModal.propTypes = {
  hideGallery: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  selectedImage: PropTypes.string.isRequired,
  webGroupId: PropTypes.number.isRequired,
}

ImageModal.defaultProps = {
  hideGallery: false
}
