import React, { useMemo } from 'react'
import { TabManager } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils/lib/labels'
import { ItemDetails } from './ItemDetails'
import { AdditionalDetails } from './AdditionalDetails'

export const InvoiceDetailsItems = ({ shoppingRequest }) => {
  const { billing, cart, shipping, soldTo } = shoppingRequest
  const tabs = useMemo(() => [
    {
      content: (
        <ItemDetails items={cart.cartItems} currencyCode={soldTo.currency} />
      ),
      disabled: false,
      id: 'itemDetails',
      name: t('Item details'),
    },
    {
      content: <AdditionalDetails billing={billing} shipping={shipping} />,
      disabled: false,
      id: 'additionalDetails',
      name: t('Additional details'),
    },
  ])

  return (
    <TabManager
      className="c-tab-manager"
      initialSelectedTab={tabs[0]}
      tabs={tabs}
    />
  )
}

export default InvoiceDetailsItems
