import React, { useState } from 'react'
import { PDPModal, ResourceItem } from '@insight/toolkit-react'
import { l, t } from '@insight/toolkit-utils/lib/labels'
import { fetchProductInformation } from '../../api'

export const ItemDetails = ({ currencyCode, items }) => {
  const [miniPDPMaterialId, setMiniPDPMaterialId] = useState(false)
  const openMiniPDP = (materialId) => setMiniPDPMaterialId(materialId)
  const onClose = () => setMiniPDPMaterialId(false)

  if (!items?.length) return <p>{t('No items available for this invoice.')}</p>
  const renderItems = () => {
    return items?.map((item, i) => {
      return (
        <ResourceItem
          key={i}
          isLastItem={i === items.length - 1}
          currencyCode={currencyCode}
          openMiniPDP={openMiniPDP}
          product={item}
          showAssetsAndSerialNumbers
        />
      )
    })
  }
  return (
    <React.Fragment>
      {renderItems()}
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
    </React.Fragment>
  )
}
export default ItemDetails
