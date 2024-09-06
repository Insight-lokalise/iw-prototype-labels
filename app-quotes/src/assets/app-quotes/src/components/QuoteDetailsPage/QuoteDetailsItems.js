import React, { useMemo } from 'react'
import { Panel, TabManager } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils/lib/labels'
import { ItemDetails } from './ItemDetails'
import { AdditionalDetails } from './AdditionalDetails'

// eslint-disable-next-line import/prefer-default-export
export const QuoteDetailsItems = ({ setIsInvalid, shoppingRequest }) => {
  const { billing, cart, shipping, soldTo } = shoppingRequest
  const tabs = useMemo(() => [
    {
      content: (
        <ItemDetails
          items={cart.cartItems}
          currencyCode={soldTo.currency}
          setIsInvalid={setIsInvalid}
        />
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
    <React.Fragment>
      <Panel className="c-app-quote-details__bottom  hide-for-print">
        <Panel.Body>
          <TabManager
            className="c-tab-manager"
            initialSelectedTab={tabs[0]}
            tabs={tabs}
          />
        </Panel.Body>
      </Panel>
      <Panel className="c-app-quote-details__bottom show-for-print">
        <Panel.Body>
          <AdditionalDetails billing={billing} shipping={shipping} />
        </Panel.Body>
      </Panel>
      <Panel className="c-app-quote-details__bottom show-for-print">
        <Panel.Body>
          <ItemDetails
            items={cart.cartItems}
            currencyCode={soldTo.currency}
            setIsInvalid={setIsInvalid}
          />
        </Panel.Body>
      </Panel>
    </React.Fragment>
  )
}
