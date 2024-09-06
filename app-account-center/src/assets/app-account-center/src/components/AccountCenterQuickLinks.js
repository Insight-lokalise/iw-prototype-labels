import React from 'react'
import Button from '@insight/toolkit-react/lib/Button/Button';
import { t } from '@insight/toolkit-utils/lib/labels'
import { connectToLocale } from "@insight/toolkit-react";

const AccountCenterQuickLinks = (props) => {
  const { context } = props
  const { displayDashboard } = context;

  return (
    <div className='c-quick-links o-grid o-grid--center o-grid--justify-between'>
      {displayDashboard &&
        <div className='o-grid__item u-1/2@mobile o-grid__item--shrink'>
          <Button color="link" href="/insightweb/dashboard" size='small'>{t('Dashboard')}</Button>
        </div>
      }
        <div className='o-grid__item u-1/2@mobile o-grid__item--shrink'>
        <Button color="link" href="/insightweb/orderHistory" size='small'>{t('Orders')}</Button>
      </div>
      <div className='o-grid__item u-1/2@mobile o-grid__item--shrink'>
        <Button color="link" href="/insightweb/quotes" size='small'>{t('Quotes')}</Button>
      </div>
      <div className='o-grid__item u-1/2@mobile o-grid__item--shrink'>
        <Button color="link" href="/insightweb/invoices" size='small'>{t('Invoices')}</Button>
      </div>
    </div>
  )
}

export default connectToLocale(AccountCenterQuickLinks)
