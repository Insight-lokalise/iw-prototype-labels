import React from 'react'
import { PDPModal } from '@insight/toolkit-react'
import { l } from '@insight/toolkit-utils'
import { getProductInformation } from '../../api/getProductInformation'

export const StoredCartsMiniPDP = ({  miniPDP, setMiniPDP }) => {
  return (
    <PDPModal
      showPDP={!!miniPDP}
      showPrice
      fetchProduct={() =>
        getProductInformation({
          locale: l(),
          materialId: miniPDP,
        })
      }
      onClose={() => setMiniPDP('')}
    />
  )
}

export default StoredCartsMiniPDP
