import React  from 'react'
import {t} from "@insight/toolkit-utils/lib/labels";

const CartHeader = (props) => (
  <div className="c-cart-header">
    <h1 className="u-h3 u-ext-bold c-cart-header__heading">{t('Cart')}</h1>
  </div>
)

export default CartHeader
