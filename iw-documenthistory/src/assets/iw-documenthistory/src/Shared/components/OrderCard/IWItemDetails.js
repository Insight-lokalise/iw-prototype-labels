/**
 * This file will be moved into iw-components when we get a clearer picture of
 * the shape of items. It'll be much easier to iterate quickly here to get to 90%
 * completenss than to create it in iw-components and keep having to publish new
 * versions
 */
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { t, l } from '@insight/toolkit-utils/lib/labels'
import { PDPModal } from '@insight/toolkit-react'

import InvoiceNumbers from '../../../Orders/Details/components/ItemCard/InvoiceNumbers'
import PrintInvoiceNumbers from '../../../Orders/Details/components/Print/PrintInvoiceNumbers'
import AssetSerialNumbers from '../../../Orders/Details/components/ItemCard/ItemTracking/AssetSerialNumbers'
import { getProductInformation } from '../../../api/getProductDetails'
import { IWImage } from '../../../libs/iw-components'

export default function IWItemDetails({ item, isLoggedIn, isCES }) {
  const [miniPDP, setMiniPDP] = useState(null)
  const {
    description,
    hasInvoicingEnabled,
    imageURL,
    lineItemInvoiceInfo,
    materialId,
    mfrPartNumber,
    orderNumber,
    serialNumberAssetTagList,
    taaCompliant,
    customerId,
  } = item
  const assetAndSerialNumbers = Array.isArray(serialNumberAssetTagList)
    ? serialNumberAssetTagList
    : []
  const hasSerialOrAssetNumbers =
    !!assetAndSerialNumbers.length &&
    assetAndSerialNumbers.some(
      (assetSerialItem) =>
        !!(assetSerialItem.serialNumber || assetSerialItem.assetTag)
    )
  const isCustomerIDAvailable = isLoggedIn && customerId
  return (
    <div>
      <div className="item-details row expanded align-top is-collapse-child">
        <div className="item-details__img-wrapper columns shrink hide-for-print">
          <IWImage
            className="item-details__img"
            src={imageURL}
            alt={description}
          />
        </div>
        <div className="item-details__text columns expand">
          <div className="row expanded">
            <div className="columns text-left">
              <h3
                className="item-details__desc "
                onClick={() => setMiniPDP(materialId)}
              >
                {description}
              </h3>
              <span className="item-details__part">
                {t('Insight #:')}
                <span className="nowrap item-details__part-number">
                  {materialId}
                </span>{' '}
                {t('Mfr #:')}
                <span className="nowrap item-details__part-number">
                  {mfrPartNumber}
                </span>
                {isCustomerIDAvailable && (
                  <div className="item-details__part-number">
                    {t('DEP Organization ID #')}:{' '}
                    <span className="nowrap item-details__part-number">
                      {customerId}
                    </span>
                  </div>
                )}
              </span>
              {taaCompliant && t('TAA Compliant: Yes')}
            </div>
          </div>
          {lineItemInvoiceInfo && isLoggedIn && (
            <InvoiceNumbers
              hasInvoicingEnabled={hasInvoicingEnabled}
              numbers={lineItemInvoiceInfo}
              orderNumber={orderNumber}
            />
          )}
          {isLoggedIn && hasSerialOrAssetNumbers && (
            <div>
              <AssetSerialNumbers
                assetAndSerialNumbers={assetAndSerialNumbers}
              />
            </div>
          )}
        </div>
      </div>
      {/* InvoiceNumbers component needs to be repeated because the non print version is an IWModalLink */}
      {lineItemInvoiceInfo && isLoggedIn && (
        <PrintInvoiceNumbers numbers={lineItemInvoiceInfo} />
      )}

      <PDPModal
        showPDP={miniPDP}
        showBackOrder={true}
        fetchProduct={() =>
          getProductInformation({
            locale: l(),
            materialId: miniPDP,
          })
        }
        onClose={() => setMiniPDP(false)}
        isLoggedIn={isLoggedIn}
      />
    </div>
  )
}

IWItemDetails.propTypes = {
  item: PropTypes.shape({
    description: PropTypes.string.isRequired,
    hasInvoicingEnabled: PropTypes.bool,
    imageURL: PropTypes.string,
    invoiceNumbers: PropTypes.arrayOf(PropTypes.string),
    manufacturerName: PropTypes.string,
    materialId: PropTypes.string.isRequired,
    mfrPartNumber: PropTypes.string,
    orderNumber: PropTypes.number.isRequired,
    serialNumberAssetTagList: PropTypes.array,
    taaCompliant: PropTypes.bool,
    customerId: PropTypes.string,
  }).isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isCES: PropTypes.bool.isRequired,
}
