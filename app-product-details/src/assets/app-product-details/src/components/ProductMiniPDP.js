import React, { useContext } from 'react'
import { connectToLocale, PDPModal } from '@insight/toolkit-react'
import {getDefaultLoggedOutSalesOrg, l} from '@insight/toolkit-utils'
import { getProductInformation } from '../api/getProductDetails'
import { PDPContext } from '../context'
import { getWebPricingFeatureFlag } from '../shared'

function ProductMiniPDP({ context }) {
  const { contractId, miniPDP, setMiniPDP, isLoggedIn } = useContext(PDPContext)
  const { contract, isIPSUser, userInformation } = context
  const isStockAndPriceDisabled = isLoggedIn ? Insight?.webGroupPermissions?.includes('disable_stock_and_price_display') : false
  const isViewPricingEnabled = isLoggedIn ? userInformation?.permissions?.enableViewPricing : true
  const newWebPriceFeature = getWebPricingFeatureFlag();
  const salesOrg =  userInformation?.salesOrg || getDefaultLoggedOutSalesOrg(l(), isIPSUser)
  const isIPSUserWithContract = isIPSUser && !!contract
  const isSingleContract = !(contract?.contractName == 'All' && isIPSUser);
  const isMultipleContract = isLoggedIn && contract?.contractName === "All" && isIPSUserWithContract

  return (
    <PDPModal
      isIPSUser={isIPSUser}
      hasContractSection={isIPSUserWithContract && (isSingleContract || isMultipleContract)}
      showPDP={miniPDP}
      showPrice={!isStockAndPriceDisabled && isViewPricingEnabled}
      showSaving={newWebPriceFeature}
      showStock={!isStockAndPriceDisabled}
      showBackOrder
      isLoggedIn={isLoggedIn}
      fetchProduct={() =>
        getProductInformation({
          locale: l(),
          materialId: miniPDP,
          contractId,
          salesOrg
        })
      }
      onClose={() => setMiniPDP(false)}
    />
  )
}

export default connectToLocale(ProductMiniPDP)
