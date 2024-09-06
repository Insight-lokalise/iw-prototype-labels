import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

import { ModalContext, MODALS } from '../Modals'

export default function ImageModalButton({ disabled, onClick, onConfirm, selectedImage, webGroupId, hideGallery }) {
  const { setActiveModal } = useContext(ModalContext)

  return (
    <div className="o-grid o-grid--justify-center">
      <div className="o-grid__item o-grid__item--shrink">
        <Button
          isDisabled={disabled}
          color="inline-link"
          onClick={() => {
            onClick()
            setActiveModal(MODALS.IMAGE_UPLOAD, { selectedImage, onConfirm, webGroupId, hideGallery })
          }}
        >
          <span className="u-font-size-tiny u-margin-right-small u-text-bold">{t('Choose image')}</span>
        </Button>
      </div>
    </div>
  )
}

ImageModalButton.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  onConfirm: PropTypes.func.isRequired,
  selectedImage: PropTypes.string,
  webGroupId: PropTypes.number.isRequired,
  hideGallery: PropTypes.bool,
}

ImageModalButton.defaultProps = {
  disabled: false,
  onClick: () => { },
  hideGallery: false,
  selectedImage: null,
}
