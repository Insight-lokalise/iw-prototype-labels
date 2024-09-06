import React from 'react'
import { PDPModal } from '@insight/toolkit-react'
import { l } from '@insight/toolkit-utils'
import { getProductInformation } from '../../api/getProductInformation'

export const ShoppingCartMiniPDP = ({ miniPDP, setMiniPDP, isLoggedIn }) => (
  <PDPModal
    showPDP={!!miniPDP}
    showBackOrder
    fetchProduct={() =>
      getProductInformation({
        locale: l(),
        materialId: miniPDP,
      })
    }
    onClose={() => setMiniPDP('')}
    isLoggedIn={isLoggedIn}
  />
)

export default ShoppingCartMiniPDP
