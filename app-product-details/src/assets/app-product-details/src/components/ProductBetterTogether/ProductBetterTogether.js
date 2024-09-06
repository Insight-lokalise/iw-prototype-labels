import React, { useContext } from 'react'
import { PDPContext, PlacementsContext } from '../../context'
import { connectToLocale, ProductBetterTogether as PDPBetterTogether } from '@insight/toolkit-react'
export const ProductBetterTogether = ({context}) => {
  const { product = {}, addToCart, isLoggedIn, showVAT, setMiniPDP } = useContext(PDPContext)
  const { better_together } = useContext(PlacementsContext)
  const { permissions, isIPSUser, userInformation, webGroupPermissions} = context
  return <PDPBetterTogether
      product={product}
      addToCart={addToCart}
      better_together={better_together}
      permissions={permissions}
      isIPSUser={isIPSUser}
      isLoggedIn={isLoggedIn}
      showVAT={showVAT}
      webGroupPermissions={webGroupPermissions}
      setMiniPDP={setMiniPDP}
      webGroupId={userInformation?.webGroup?.webGroupId}
    />;
}

export default connectToLocale(ProductBetterTogether)
