import React, { useState } from 'react'
import { IWModal, IWAnchor } from './../../../../../libs/iw-components'
import { checkExpired } from './../paymentInfoHelpers'
import { IWMessage } from './../../../../../libs/iw-components/iw-messageBox'
import InlineEditableCardView from './InlineEditableCardViewForm'

import { t } from '@insight/toolkit-utils/lib/labels'
import { DefaultCardView } from './DefaultCardView'
import { submit3DSPayMetricData } from './../../../../../libs/models/Payments/payment'

function getLastFourDigits(displayCardNum, storedCardToken) {
  let lastFourDigits = displayCardNum && displayCardNum.slice(-4)
  if (!displayCardNum) {
    lastFourDigits = storedCardToken && storedCardToken.slice(-4)
  }
  return lastFourDigits
}

export function CardView(props) {
  const { card } = props
  const isExpired = checkExpired(
    card.storedCardExpMonth,
    card.storedCardExpYear
  )
  const lastFourDigits = getLastFourDigits(
    card.displayCardNum,
    card.storedCardToken
  )

  return (
    <div className="table__body">
      <div className="table__row">
        <div className="row is-collapse-child align-middle">
          <div className="column small-1 table__col">
            {isExpired ? (
              <IWAnchor
                className="ion-edit"
                onClick={() => props.onToggleCardEditable(card.storedCardId)}
                title={t('Update')}
              />
            ) : (
              <input
                name="cardToUse"
                type="radio"
                className="stored-cards-modal__selected"
                defaultChecked={props.selectedCardId === card.storedCardId}
                onClick={props.onSelectingCard}
              />
            )}
          </div>
          <div className="column table__col">
            <div className="row align-middle">
              <div className="column small-5 hide-for-medium">
                <p className="stored-cards-modal__heading">
                  {t('Card description')}
                </p>
              </div>
              <div className="column small-7 medium-3">
                <p className="stored-cards-modal__text">
                  {card.storedCardDesc}
                </p>
              </div>
              <div className="column small-5 hide-for-medium">
                <p className="stored-cards-modal__heading">{t('Card')}</p>
              </div>
              <div className="column small-7 medium-3">
                <p className="stored-cards-modal__text">
                  <span
                    className={`icon-cards icon-cards--${card.storedCardType}`}
                  />
                  {` ${t('ending in')}`} {lastFourDigits}
                </p>
              </div>
              <div className="column small-5 hide-for-medium">
                <p className="stored-cards-modal__heading">
                  {t('Expiration date')}
                </p>
              </div>
              <div className="column small-7 medium-2 large-3">
                {isExpired ? (
                  <p className="stored-cards-modal__text color--red">
                    {t('Expired')}
                  </p>
                ) : (
                  <p className="stored-cards-modal__text">
                    {card.storedCardExpMonth < 10
                      ? `0${card.storedCardExpMonth}`
                      : card.storedCardExpMonth}{' '}
                    / {card.storedCardExpYear}
                  </p>
                )}
              </div>
              <div className="column small-5 hide-for-medium">
                <p className="stored-cards-modal__heading">
                  {t('Name on card')}
                </p>
              </div>
              <div className="column small-7 medium-expand">
                <p className="stored-cards-modal__text">
                  {card.storedCardHolderName}
                </p>
              </div>
              {props.selectedCardId !== card.storedCardId && (
                <div className="column small-12 medium-shrink">
                  <span
                    className="ion-trash-a stored-cards-modal__icon hide-for-small-only"
                    title={t('Remove card')}
                    onClick={() => props.onDeleteCard(card.storedCardId)}
                  />
                  <IWAnchor
                    href="#"
                    className="stored-cards-modal__text hide-for-medium"
                    onClick={() => props.onDeleteCard(card.storedCardId)}
                  >
                    <strong>{t('Remove card')}</strong>
                  </IWAnchor>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export function StoredCardsModalView(props) {
  const defaultCards = props.cards.filter((c) => c.isDefaultCard)
  const defaultCard = defaultCards[0]
  const [authReady, setAuthReady] = useState(true)
  const [authError, setAuthError] = useState('')
  const enableCardScreening = window.flags && window.flags['GNA-9004-CS']
  const preAuthHandler = (card, values) => {
    if (authReady) {
      const { billing, salesOrg, currencyCode } = props

      setAuthReady(false)
      setAuthError('')
      submit3DSPayMetricData({
        cvvRequired: true,
        enable3DS: false,
        messageType: 'CSTO',
        card: {
          // this is needed when using a saved card
          storedCardId: card.storedCardId,
          storedCardType: card.storedCardType,
          storedCardHolderName: card.storedCardHolderName,
          storedCardExpMonth: values.storedCardExpMonth,
          storedCardExpYear: values.storedCardExpYear,
        },
        address: {
          address1: billing?.address?.address1?.trim(),
          city: billing?.address?.city?.trim(),
          state: billing?.address?.state?.trim(),
          zipCode: billing?.address?.zipCode?.trim(),
          countryId: billing?.address?.countryId?.trim(),
        }, // billing address is need for pre-authorization
        cvv: values.cvvNumber,
        salesOrg,
        currencyCode,
      })
        .then((paymetricsCardInfo) => {
          // if api returns the card token, that means authorization passed
          if (paymetricsCardInfo && paymetricsCardInfo.token) {
            props.handleFormSubmit(card, values).then(() => setAuthReady(true))
          } else {
            setAuthError(
              t(
                'The validation of this card was unsuccessful and could not be saved. Please use a different card or contact your bank/financial institution.'
              )
            )
            setAuthReady(true)
          }
        })
        .catch((error) => {
          setAuthError(
            t(
              'An unexpected error occurred. Please contact your Account Executive for more information.'
            )
          )
          setAuthReady(true)
        })
    }
  }

  return (
    <div className="column" data-private="true">
      {defaultCard && (
        <DefaultCardView
          lastFourDigits={getLastFourDigits(
            defaultCard.displayCardNum,
            defaultCard.storedCardToken
          )}
          type={defaultCard.storedCardType}
        />
      )}
      <div className="table">
        <div className="table__header hide-for-small-only">
          {authError && (
            <div className="row align-middle">
              <div className="column small-12">
                <IWMessage
                  className="expanded"
                  text={authError}
                  severity="error"
                />
              </div>
            </div>
          )}
          <div className="row is-collapse-child align-middle">
            <div className="column medium-1 table__col table__col--header" />
            <div className="column table__col table__col--header">
              <div className="row align-middle">
                <div className="column medium-3">{t('Card description')}</div>
                <div className="column medium-3">{t('Card')}</div>
                <div className="column medium-2 large-3">
                  {t('Expiration date')}
                </div>
                <div className="column">{t('Name on card')}</div>
                <div className="column shrink" />
              </div>
            </div>
          </div>
        </div>
        {props.cards.map((card, index) =>
          card.editable ? (
            <InlineEditableCardView
              key={index}
              card={card}
              isEMEA={props.isEMEA}
              isRequisition={props.isRequisition}
              isCyberSource={props.isCyberSource}
              onToggleCardEditable={props.onToggleCardEditable}
              handleFormSubmit={(values) =>
                // pre-authorization is only for non-requestors and backend enables it for supported currency. Login as won't have access to this modal
                enableCardScreening &&
                !props.isRequisition &&
                props.isCyberSource
                  ? preAuthHandler(card, values)
                  : props.handleFormSubmit(card, values)
              }
            />
          ) : (
            <CardView
              key={index}
              card={card}
              isEMEA={props.isEMEA}
              selectedCardId={props.selectedCardId}
              onDeleteCard={props.onDeleteCard}
              onToggleCardEditable={props.onToggleCardEditable}
              onSelectingCard={() => props.onSelectingCard(card)}
            />
          )
        )}
      </div>
    </div>
  )
}
export function StoredCardsModal(props) {
  return (
    <IWModal
      backdropClassName="iw-dialog iw-dialog-backdrop"
      modalSize="xLarge"
      showIf={props.showStoredCardsDialog}
      title={t('Stored cards')}
      confrimBtnText={t('Continue')}
      onConfirm={props.useThisCard}
      cancelBtnText={t('Cancel')}
      onHide={props.onHide}
    >
      <div className="cart-container">
        <div className="row stored-cards-modal">
          <StoredCardsModalView
            cards={props.cards}
            handleFormSubmit={props.handleFormSubmit}
            isRequisition={props.isRequisition}
            isCyberSource={props.isCyberSource}
            isEMEA={props.isEMEA}
            selectedCardId={props.selectedCardId}
            onDeleteCard={props.onDeleteCard}
            onToggleCardEditable={props.onToggleCardEditable}
            onSelectingCard={props.onSelectingCard}
            billing={props.billing}
            salesOrg={props.salesOrg}
            currencyCode={props.currencyCode}
          />
        </div>
      </div>
    </IWModal>
  )
}
