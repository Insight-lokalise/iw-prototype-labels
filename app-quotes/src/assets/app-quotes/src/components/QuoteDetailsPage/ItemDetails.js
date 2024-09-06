import React, { Fragment, useEffect, useState } from 'react'
import { PDPModal, ResourceItem } from '@insight/toolkit-react'
import { l, t } from '@insight/toolkit-utils'
import { fetchProductInformation } from '../../api'
import { isItemInvalid } from '../../lib/helpers'

export const ItemDetails = ({ currencyCode, items, setIsInvalid }) => {
  const [miniPDPMaterialId, setMiniPDPMaterialId] = useState(false)

  const openMiniPDP = (materialId) => setMiniPDPMaterialId(materialId)
  const onClose = () => setMiniPDPMaterialId(false)

  useEffect(() => {
    if (items.every(isItemInvalid)) {
      setIsInvalid(true)
    }
  }, [items])

  return (
    <Fragment>
      {items ? (
        items.map((item, i) => (
          <ResourceItem
            key={i}
            isInvalid={isItemInvalid(item)}
            isLastItem={i === items.length - 1}
            currencyCode={currencyCode}
            openMiniPDP={openMiniPDP}
            product={item}
          />
        ))
      ) : (
        <p>{t('No items available for this quote.')}</p>
      )}
      <PDPModal
        showPDP={miniPDPMaterialId ? true : false}
        showBackOrder={true}
        fetchProduct={() =>
          fetchProductInformation({
            locale: l(),
            materialId: miniPDPMaterialId,
          })
        }
        onClose={onClose}
      />
    </Fragment>
  )
}

export default ItemDetails
