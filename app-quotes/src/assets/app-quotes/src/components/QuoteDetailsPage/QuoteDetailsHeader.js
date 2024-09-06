import React from 'react'
import { Date, Message, Tag } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils/lib/labels'
import QuoteDetailsHeaderItem from './QuoteDetailsHeaderItem'
import QuoteDetailsUtilityLinks from './QuoteDetailsUtilityLinks'

export const QuoteDetailsHeader = ({
  quoteId,
  quoteName,
  quoteReferenceNumber,
  quoteCreatedDate,
  quoteExpirationDate,
  accountNumber,
  accountName,
  isAnyItemInvalid,
  isConverted,
  isExpired,
  addToast,
}) => {
  const expiredText = () => {
    return (
      <span tabIndex={0}>
        {t('Expired: ')}
        <Date date={quoteExpirationDate} type="date" />
      </span>
    )
  }

  return (
    <React.Fragment>
      <div className="u-margin-bot">
        <section className="o-grid o-grid--justify-between">
          <div className="o-grid__item">
            <h1 className="u-h3 u-text-bold c-app-quote-details__heading">
              {t('Quote details')}
            </h1>
          </div>
          <div className="o-grid__item">
            <QuoteDetailsUtilityLinks quoteId={quoteId} addToast={addToast}/>
          </div>
        </section>
        <section className="o-grid">
          <div className="o-grid__item u-1/1 u-1/3@tablet">
            <h2
              className="c-app-quote-details__id u-margin-bot-none u-h5"
              data-testid="quoteNum"
            >
              {quoteId}
            </h2>
          </div>
          {isExpired ? (
            <div className="o-grid__item u-2/3@tablet" data-testid="expired">
              <Tag
                icon="alert"
                text={expiredText()}
                color="red"
                labelClass="c-app-quote-details__expired"
              />
            </div>
          ) : null}
          {!isExpired && isConverted ? (
            <div className="o-grid__item u-3/4@tablet" data-testid="converted">
              <Tag
                className={'c-app-quote-details__converted-tag'}
                icon="alert"
                text={t('This quote has already been converted.')}
                color="red"
                labelClass="c-app-quote-details__converted"
              />
            </div>
          ) : null}
        </section>
      </div>
      <div className="o-grid">
        <QuoteDetailsHeaderItem
          value={quoteName}
          title={'Quote name'}
          testid="quote-name"
        />
        <QuoteDetailsHeaderItem
          value={quoteReferenceNumber}
          title={'Reference number'}
          testid="ref-number"
        />
        <QuoteDetailsHeaderItem
          value={<Date date={quoteCreatedDate} type="date" />}
          title={'Quote created'}
          testid="quote-creation"
        />
        <QuoteDetailsHeaderItem
          value={accountNumber}
          title={'Account number'}
          testid="acct-number"
        />
        <QuoteDetailsHeaderItem
          value={<Date date={quoteExpirationDate} type="date" />}
          title={'Quote expiration'}
          testid="quote-expiration"
        />
        <QuoteDetailsHeaderItem
          value={accountName}
          title={'Account name'}
          testid="acct-name"
        />
        {isAnyItemInvalid && (
          <Message
            className="o-grid__item u-1/1 c-app-quote-details__message"
            type="error"
          >
            {t(
              'The indicated items below are no longer available and will be removed from your cart upon conversion.'
            )}
          </Message>
        )}
      </div>
    </React.Fragment>
  )
}
