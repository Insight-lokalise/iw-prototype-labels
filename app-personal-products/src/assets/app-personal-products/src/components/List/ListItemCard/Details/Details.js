import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils'
import { makeProductDetailURL } from '@insight/toolkit-react/lib/PDPModal/PDPHelpers'

import DragIcon from './DragIcon'
import ProductImage from './ProductImage'
import ProductDescription from './ProductDescription'

export default function Details({
  addToCompareProps,
  approvedItem,
  bullet1,
  bullet2,
  bullet3,
  bullet4,
  callForAvailability,
  callForPrice,
  description,
  detailsClass,
  dragHandleProps,
  isDragDisabled,
  isValid,
  imageURL,
  manufacturerName,
  manufacturerPartNumber,
  materialId,
  proratable,
  softwareLicenseType,
  standardProduct,
  getProductCompareHref,
}) {
  const itemURL = description
    ? makeProductDetailURL({
        description,
        mfrName: manufacturerName,
        manufacturerId: manufacturerPartNumber,
        materialId,
      })
    : ''
  const noDescriptionText = (
    <p>
      {t('Insight Part #')}: {materialId}
    </p>
  )
  return (
    <div className={detailsClass}>
      <div className="o-grid c-item-card__details-grid">
        <DragIcon {...{ dragHandleProps, isDragDisabled }} />
        {description ? (
          <Fragment>
            <ProductImage description={description} imageURL={imageURL} />
            <ProductDescription
              addToCompareProps={addToCompareProps}
              approvedItem={approvedItem}
              bullet1={bullet1}
              bullet2={bullet2}
              bullet3={bullet3}
              bullet4={bullet4}
              callForAvailability={callForAvailability}
              callForPrice={callForPrice}
              description={description}
              isValid={isValid}
              itemURL={itemURL}
              manufacturerPartNumber={manufacturerPartNumber}
              materialId={materialId}
              proratable={proratable}
              softwareLicenseType={softwareLicenseType}
              standardProduct={standardProduct}
              getProductCompareHref={getProductCompareHref}
            />
          </Fragment>
        ) : (
          noDescriptionText
        )}
      </div>
    </div>
  )
}

Details.propTypes = {
  addToCompareProps: PropTypes.shape({
    isSelectedToCompare: PropTypes.bool,
    needsCompareTo: PropTypes.bool,
    toggleSelectToCompare: PropTypes.func,
  }).isRequired,
  approvedItem: PropTypes.bool.isRequired,
  bullet1: PropTypes.string,
  bullet2: PropTypes.string,
  bullet3: PropTypes.string,
  bullet4: PropTypes.string,
  description: PropTypes.string,
  detailsClass: PropTypes.string.isRequired,
  dragHandleProps: PropTypes.shape({}),
  imageURL: PropTypes.string,
  isValid: PropTypes.bool,
  isDragDisabled: PropTypes.bool.isRequired,
  manufacturerName: PropTypes.string,
  manufacturerPartNumber: PropTypes.string,
  materialId: PropTypes.string.isRequired,
  softwareLicenseType: PropTypes.string,
  standardProduct: PropTypes.bool,
}

Details.defaultProps = {
  bullet1: '',
  bullet2: '',
  bullet3: '',
  bullet4: '',
  description: '',
  dragHandleProps: {},
  imageURL: '',
  isValid: false,
  manufacturerName: '',
  manufacturerPartNumber: '',
  softwareLicenseType: '',
  standardProduct: false,
}
