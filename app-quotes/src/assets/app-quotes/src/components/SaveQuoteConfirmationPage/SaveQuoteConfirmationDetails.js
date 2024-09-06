import React from 'react'
import { Button, Message, Panel } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils/lib/labels'
import { SaveQuoteConfirmationDetail } from './SaveQuoteConfirmationDetail'

export const SaveQuoteConfirmationDetails = (props) => (
  <Panel className="c-save-quote-panel">
    <div className="o-grid o-grid--justify-between">
      <div className="o-grid__item">
        <h1 className="u-h3 u-text-bold">{t('Quote saved')}</h1>
        <Message className="c-save-quote-confirmation__message" type="success">
          {t('Your quote has successfully been saved')}.
        </Message>
      </div>
      <div className="o-grid--full-height o-grid--bottom">
        <div className="o-grid__item u-1/1">
          <Button
            color="inline-link"
            icon="print"
            iconPosition="right"
            className="u-text-bold c-save-quote-panel__print hide-for-print"
            onClick={window.print}
          >
            {t('Print')}
          </Button>
        </div>
      </div>
    </div>
    <div className="o-grid o-grid--justify-between">
      <SaveQuoteConfirmationDetail
        title={t('Quote name')}
        value={props.quoteName}
      />
      <SaveQuoteConfirmationDetail
        title={t('Reference number')}
        value={props.webReferenceNumber}
      />
    </div>
    <div className="o-grid o-grid--justify-between">
      <SaveQuoteConfirmationDetail
        title={t('Quote created')}
        value={props.createdAt}
        date
      />
      <SaveQuoteConfirmationDetail
        title={t('Account number')}
        value={props.soldTo?.id}
      />
    </div>
    <div className="o-grid o-grid--justify-between">
      <SaveQuoteConfirmationDetail
        title={t('Quote expiration')}
        value={props.expires}
        date
      />
      <SaveQuoteConfirmationDetail
        title={t('Account name')}
        value={props.user?.name}
      />
    </div>
    <div>
      <Button
        className="u-text-bold c-save-quote-panel__view-all hide-for-print"
        color="link"
        icon="redo"
        iconPosition="right"
        href="/insightweb/quotes"
      >
        {t('View all quotes')}
      </Button>
    </div>
  </Panel>
)

export default SaveQuoteConfirmationDetails
