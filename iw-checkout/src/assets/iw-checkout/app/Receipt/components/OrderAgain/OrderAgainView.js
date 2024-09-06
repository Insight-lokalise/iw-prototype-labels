import React from 'react'
import PropTypes from 'prop-types'

import Button from '@insight/toolkit-react/lib/Button/Button'
import { t } from '@insight/toolkit-utils/lib/labels'

export function OrderAgainView(props) {

  const { duplicateOrder, isCloudCart, hasDuplicateOrderPermission } = props
  const orderAgain = t('Order again')

    return (
      (hasDuplicateOrderPermission && !isCloudCart) ?
          <div className='order-again__link u-margin-bot-small'><Button color="link" icon="sync" iconPosition="right" onClick={()=>{duplicateOrder()}}>{orderAgain}</Button></div> : null      
    )
}

export default OrderAgainView

OrderAgainView.propTypes = {
  duplicateOrder: PropTypes.func.isRequired,
  isCloudCart: PropTypes.bool.isRequired,
  hasDuplicateOrderPermission: PropTypes.bool.isRequired,
}
