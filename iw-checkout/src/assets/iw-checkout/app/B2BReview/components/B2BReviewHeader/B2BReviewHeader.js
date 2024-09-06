import React from 'react'
import { t } from '@insight/toolkit-utils/lib/labels'

export default function CartTransferHeader() {
    return (
        <div className="row expanded is-collapse-child shopping-cart__messages">
            <div className="columns">
                <p className="no-margin-bot hide-for-print">
                    <b>{t('Thank you for using Insight as your e-procurement solution. Please review the contents of the shopping cart below to confirm your order.')}</b>
                </p>
                <p className="no-margin-bot hide-for-print">
                    <b>{t('To place your order, submit your cart to your host application')}.</b>
                </p>
            </div>
        </div>
    )
}
