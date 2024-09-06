import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import ImageModalButtonContainer from "../../../containers/ImageModalButtonContainer";
import { FileListItem } from "../../Shared";

export default function ChooseImage({ product, isShared, updateProduct, className, hideGallery }) {
  const { customImage } = product
  const classes = cn('', className)
  return (
    <div className={classes}>
      <div className="o-grid__item u-1/1 u-padding-right-small">
        <ImageModalButtonContainer
          onConfirm={nextUrl =>
            updateProduct({ ...product, customImage: nextUrl })
          }
          disabled={isShared}
          selectedImage={customImage}
          hideGallery={hideGallery}
        />
      </div>
      {customImage && (
        <div
          className={cn("o-grid__item u-1/1", { "u-invisible": !customImage })}
        >
          <FileListItem
            fileUrl={customImage || ""}
            onRemove={() => updateProduct({ ...product, customImage: null })}
          />
        </div>
      )}
    </div>
  );
}

ChooseImage.propTypes = {
  product: PropTypes.shape({
    customImage: PropTypes.string
  }),
  updateProduct: PropTypes.func,
  className: PropTypes.string,
  hideGallery: PropTypes.bool,
}

ChooseImage.defaultProps = {
  product: {},
  updateProduct: ()=>{},
  className: '',
  hideGallery: false
}
