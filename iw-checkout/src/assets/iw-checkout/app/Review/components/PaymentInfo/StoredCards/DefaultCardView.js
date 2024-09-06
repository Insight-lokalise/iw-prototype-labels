import React from 'react'
import Lozenge from '@insight/toolkit-react/lib/Lozenge/Lozenge'
import {t} from "@insight/toolkit-utils/lib/labels";

export function DefaultCardView({type, lastFourDigits}) {
  return (
    <div className="c-default-card">
      <Lozenge className='c-default-card--tag u-margin-left' color='info'>{t('Default')}</Lozenge>
      <div>
        <span className={`icon-cards icon-cards--${type}`}></span>
        {` ${t('ending in')}`} {lastFourDigits}
      </div>
    </div>
  )
}
