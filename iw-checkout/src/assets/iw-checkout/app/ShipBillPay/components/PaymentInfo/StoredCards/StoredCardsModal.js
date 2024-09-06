import React from 'react'
import { IWModal, IWAnchor } from './../../../../../libs/iw-components'
import { checkExpired } from './../paymentInfoHelpers'

import InlineEditableCardView from './InlineEditableCardViewForm'

import { t } from '@insight/toolkit-utils/lib/labels'

const cardDescription = t('Card description')
const cardText = t('Card')
const expirationDate = t('Expiration date')
const expiredText = t('Expired')
const nameOnCard = t('Name on card')
const removeCard = t('Remove card')
const storedCards = t('Stored cards')
const continueText = t('Continue')
const cancelText = t('Cancel')
const updateText = t('Update')
const endingIn = t(' ending in')

export function CardView(props) {
    const card = props.card
    const isExpired = checkExpired(card.storedCardExpMonth, card.storedCardExpYear)
    let lastFourDigits = card.displayCardNum && card.displayCardNum.slice(-4)
    if(!card.displayCardNum) {
      lastFourDigits = card.storedCardToken && card.storedCardToken.slice(-4)
    }
    return (
        <div className="table__body">
            <div className="table__row">
                <div className="row is-collapse-child align-middle">
                    <div className="column small-1 table__col">
                        { isExpired ?
                            <IWAnchor className="ion-edit" onClick={()=>props.onToggleCardEditable(card.storedCardId)} title={updateText}></IWAnchor>
                            :
                            <input name="cardToUse" type="radio" className="stored-cards-modal__selected"
                                defaultChecked ={props.selectedCardId === card.storedCardId}
                                onClick={props.onSelectingCard}
                            />
                        }
                    </div>
                    <div className="column table__col">
                        <div className="row align-middle">
                            <div className="column small-5 hide-for-medium">
                                <p className="stored-cards-modal__heading">{cardDescription}</p>
                            </div>
                            <div className="column small-7 medium-3">
                                <p className="stored-cards-modal__text">{card.storedCardDesc}</p>
                            </div>
                            <div className="column small-5 hide-for-medium">
                                <p className="stored-cards-modal__heading">{cardText}</p>
                            </div>
                            <div className="column small-7 medium-3">
                                <p className="stored-cards-modal__text">
                                    <span className={`icon-cards icon-cards--${card.storedCardType}`}></span>
                                    {endingIn} {lastFourDigits}
                                </p>
                            </div>
                            <div className="column small-5 hide-for-medium">
                                <p className="stored-cards-modal__heading">{expirationDate}</p>
                            </div>
                            <div className="column small-7 medium-2 large-3">
                                { isExpired ?
                                    <p className="stored-cards-modal__text color--red">{expiredText}</p>
                                    :
                                    <p className="stored-cards-modal__text">{card.storedCardExpMonth < 10 ? `0${card.storedCardExpMonth}` : card.storedCardExpMonth} / {card.storedCardExpYear}</p>
                                }
                            </div>
                            <div className="column small-5 hide-for-medium">
                                <p className="stored-cards-modal__heading">{nameOnCard}</p>
                            </div>
                            <div className="column small-7 medium-expand">
                                <p className="stored-cards-modal__text">{card.storedCardHolderName}</p>
                            </div>
                            <div className="column small-12 medium-shrink">
                                <span className="ion-trash-a stored-cards-modal__icon hide-for-small-only" title={removeCard} onClick={() => props.onDeleteCard(card.storedCardId)}></span>
                                <IWAnchor href="#" className="stored-cards-modal__text hide-for-medium" onClick={() => props.onDeleteCard(card.storedCardId)}><strong>{removeCard}</strong></IWAnchor>
                            </div>
                        </div>
                    </div>
                </div>
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
            title={storedCards}
            confrimBtnText={continueText}
            onConfirm={props.useThisCard}
            cancelBtnText={cancelText}
            onHide={props.onHide}>
            <div className="cart-container">
                <div className="row stored-cards-modal">
                    <div className="column">
                        <div className="table">
                            <div className="table__header hide-for-small-only">
                                <div className="row is-collapse-child align-middle">
                                    <div className="column medium-1 table__col table__col--header" />
                                    <div className="column table__col table__col--header">
                                        <div className="row align-middle">
                                            <div className="column medium-3">
                                                {cardDescription}
                                            </div>
                                            <div className="column medium-3">
                                                {cardText}
                                            </div>
                                            <div className="column medium-2 large-3">
                                                {expirationDate}
                                            </div>
                                            <div className="column">
                                                {nameOnCard}
                                            </div>
                                            <div className="column shrink" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {props.cards.map((card, index) =>
                                card.editable
                                    ? <InlineEditableCardView
                                          key={index}
                                          card={card}
                                          onToggleCardEditable={props.onToggleCardEditable}
                                          handleFormSubmit={values => props.handleFormSubmit(card, values)}
                                      />
                                    : <CardView
                                          key={index}
                                          card={card}
                                          selectedCardId={props.selectedCardId}
                                          onDeleteCard={props.onDeleteCard}
                                          onToggleCardEditable={props.onToggleCardEditable}
                                          onSelectingCard={() => props.onSelectingCard(card)}
                                      />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </IWModal>
    )
}
