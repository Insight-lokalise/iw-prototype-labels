import {t} from "@insight/toolkit-utils/lib/labels";
import React from "react";

export default function StockErrors({ itemDetails, tentativeQuantity }) {
  if (itemDetails.nonShipabble) return <></>
  const { stock, quantity } = itemDetails
  if ( tentativeQuantity && tentativeQuantity > stock){
    return (
      <div className='cart-item__stock--help-text'>
        <div>{`${t('Your quantity exceeds our current stock of ')} ${stock}`}</div>
        <div>{t('Additional items may be backordered')}</div>
      </div>
    )
  }
  else if (!tentativeQuantity && quantity > stock ){
    return (
      <div className='cart-item__stock--help-text'>
        <div>{`${t('Your quantity exceeds our current stock of ')} ${stock}`}</div>
        <div>{t('Additional items may be backordered')}</div>
      </div>
    )
  } else {
    return <></>
  }
}