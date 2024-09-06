import React from 'react'
import { useSelector } from 'react-redux'
import { t } from '@insight/toolkit-utils/lib/labels'
import { Panel, ShoppingTable } from '@insight/toolkit-react'
import { selector_hasWarrantyItem } from '../../state/slices/selectors/ShoppingReqeustSelector'
import { selector_hasSellRequirements } from '../../state/slices/selectors/lineLevelSessionInfosSelector'

const CartView = ({ shoppingRequest, lineLevelSessionInfos }) => {
  const hasWarrantyItem = useSelector(selector_hasWarrantyItem)
  const hasSellRequirements = useSelector(selector_hasSellRequirements)
  const showItemInfoLink = hasWarrantyItem || hasSellRequirements

  return (
    <div>
      <Panel className="c-review-section">
        <Panel.Title className="c-review-section-title">
          <Panel.Title.Left>
            <h2 className="u-h5 u-text-bold u-margin-bot-none">{t('Cart')}</h2>
          </Panel.Title.Left>
        </Panel.Title>
        <ShoppingTable
          shoppingRequest={shoppingRequest}
          lineLevelSessionInfos={lineLevelSessionInfos}
          currencyCode={shoppingRequest.soldTo.currency}
          emptyCart={() => {}}
          openMiniPDP={() => {}}
          readOnly={true}
          enrollmentParentIds={[]}
          showItemInfoLink={showItemInfoLink}
          showEWRFee={shoppingRequest?.cart?.summary?.ewrFee !== 0}
        />
      </Panel>
    </div>
  )
}

export default CartView
