import React from 'react'
import { useSelector } from 'react-redux'
import { t } from '@insight/toolkit-utils'
import { Button, Date } from '@insight/toolkit-react'
import ReceiptHeaderItems from './ReceiptHeaderItems'
import { connectToLocale } from '@insight/toolkit-react/lib/Locale/Locale'
import { selector_receiptHeader } from '../../state/slices/selectors/receiptHeaderSelector'

const ReceiptHeader = () => {
  const isCurrency = 'true'
  const receiptHeader = useSelector(selector_receiptHeader)

  return (
    <div className="c-panel c-guest-checkout--header c-guest-checkout-panel">
      <div className="o-box  c-panel__body">
        <div className="o-grid">
          <div className="o-grid_item u-1/1 u-margin-bot-small">
            <div className="o-grid o-grid--justify-between">
              <h1 className="u-h3 u-ext-bold">{'Thank you for your order'}</h1>
              <div className="hide-for-print">
                <Button
                  className="c-app-quote-details__actions__action"
                  color="link"
                  aria-label={t('print')}
                  icon="print"
                  iconPosition="right"
                  onClick={window.print}
                >
                  {t('Print')}
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="o-grid">
          <div className="o-grid_item u-1/1">
            <div className="o-grid ">
              <div className="o-grid__item u-margin-bot o-grid__item--shrink c-reciept-items">
                <span tabIndex={0} className="u-text-bold ">
                  {t('Reference number')}
                </span>
                <div className="c-reciept-page__id u-h5">
                  {receiptHeader?.webReferenceNumber}
                </div>
              </div>
              <ReceiptHeaderItems
                value={<Date date={receiptHeader?.orderDate} type="date" />}
                title={t('Order date')}
              />
              <ReceiptHeaderItems
                isCurrency={isCurrency}
                currencyCode={receiptHeader?.currencyCode}
                value={receiptHeader?.totalCost}
                title={t('Order total')}
              />
              {(!!receiptHeader?.poNumber ||
                !!receiptHeader?.poReleaseNumber) && (
                <ReceiptHeaderItems
                  value={
                    receiptHeader?.poNumber
                      ? receiptHeader?.poNumber
                      : receiptHeader?.poReleaseNumber
                  }
                  title={t('PO / PO release')}
                />
              )}
            </div>
          </div>
        </div>
        <div>
          {t(
            'As soon as your order is processed, you will receive an email confirmation containing your order details'
          )}
        </div>
        <div className="o-grid">
          <div className="o-grid_item u-1/1 ">
            <div className="o-grid">
              <div className="c-reciept-page-button__link hide-for-print">
                <Button
                  className="c-button--block"
                  type="submit"
                  color="primary"
                  href={`/${receiptHeader?.locale}/shop.html`}
                >
                  {t('Continue shopping')}
                </Button>
              </div>
              <div className="c-reciept-page-button__link hide-for-print">
                <Button
                  className="c-button--block"
                  type="submit"
                  color="secondary"
                  href="/insightweb/endUser/createAccount"
                >
                  {t('Create an account')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default connectToLocale(ReceiptHeader)
