import React, {Fragment} from 'react'
import PropTypes from "prop-types";
import { useSelector } from 'react-redux'
import {t} from "@insight/toolkit-utils/lib/labels";
import { IWModal } from "../../../../libs/iw-components"
import { selector_loginAsFlag } from './../../../../libs/User/selectors'
import AddNewCardWP from "./../PaymentInfo/AddNewCardWP"
import SelectedPaymentCardViewWP from "./StoredCards/SelectedPaymentCardViewWP"
import {StoredCardsLink} from "./PaymentSFCs"
import PaymentModalStoredCards from "./StoredCards/PaymentModalStoredCards"

export default function PaymentModal(props) {
  const isLoginAs = useSelector(selector_loginAsFlag);
  const loginAsStoredCardMsg = t('Stored cards are not available to "Login As" users')
  const {storedCards, inAddCardView, isAddNewCardVisible, locale, showAddNewCardLink, toggleAddNewCard, openStoredCardsModal} = props
  const isItaly = locale.split('_')[1] === 'IT'

  return (
    <div>
      <IWModal
        backdropClassName="iw-dialog iw-dialog-backdrop"
        modalSize="xLarge"
        showIf={props.openPaymentModal}
        title={t('Payment')}
        hideConfirmButton
        onHide={props.onHide}>
        <div className="cart-container payment-modal">
          {isLoginAs &&
            <div className="row expanded is-collapse-child">
              <div className="column">
                <span className="payment-info--loginas__warning">{loginAsStoredCardMsg}</span>
              </div>
            </div>
          }
          {!openStoredCardsModal &&
            <div className="stored-card-or-new-card-links">
              { storedCards.length > 0 &&
                <span>
                  <StoredCardsLink onClick={()=>props.setPaymentState({openStoredCardsModal: !openStoredCardsModal})} />
                  <span className="vertical-separator"> | </span>
                </span>
              }
              { showAddNewCardLink &&
                <a className="section__body-action" onClick={toggleAddNewCard}>
                  {inAddCardView || isAddNewCardVisible ? t('Cancel') : t('Add new')}
                </a>
              }
            </div>
          }
          {openStoredCardsModal ?
            <PaymentModalStoredCards
              cards={props.storedCards}
              isEMEA={props.isEMEA}
              selectedCardId={props.selectedCardId}
              onDeleteCard={props.onDeleteCard}
              onToggleCardEditable={props.onToggleCardEditable}
              updateCard={props.updateCard}
              updateCardToUse={props.updateCardToUse}
              onCancel={()=>props.setPaymentState({openStoredCardsModal: false})}
            />
            :
            <Fragment>
              {isAddNewCardVisible ?
                <AddNewCardWP
                  setPaymentState={props.setPaymentState}
                  canSaveCard={props.hasStoredCardAccess}
                  isAddToStoredCardsSelected={props.isAddToStoredCardsSelected}
                  resultCallback={props.resultCallback}
                  storedCardDesc={props.storedCardDesc}
                  isDefaultCard={props.isDefaultCard}
                  isItaly={isItaly}
                />
                :
                <div>
                  {!isLoginAs &&
                  <SelectedPaymentCardViewWP
                    defaultCardId={props.defaultCardId}
                    setPaymentState={props.setPaymentState}
                    resultCallback={props.resultCallback}
                    selectedCard={props.cardToUse}
                    isDefaultCard={props.isDefaultCard}
                    isItaly={isItaly}
                    onUpdateExpiredCard={props.onUpdateExpiredCard}
                  />
                  }
                </div>
              }
            </Fragment>
          }
        </div>
      </IWModal>
    </div>
  )
}

PaymentModal.propTypes = {
  cardToUse: PropTypes.object.isRequired,
  defaultCardId: PropTypes.number.isRequired,
  hasStoredCardAccess: PropTypes.bool.isRequired,
  inAddCardView: PropTypes.bool.isRequired,
  isAddNewCardVisible: PropTypes.bool.isRequired,
  isDefaultCard: PropTypes.bool,
  isEMEA: PropTypes.bool.isRequired,
  isSelectedCardVisible: PropTypes.bool.isRequired,
  locale: PropTypes.string.isRequired,
  onDeleteCard: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  onToggleCardEditable: PropTypes.func.isRequired,
  openStoredCardsModal: PropTypes.bool.isRequired,
  openPaymentModal: PropTypes.bool.isRequired,
  onUpdateExpiredCard: PropTypes.func.isRequired,
  showAddNewCardLink: PropTypes.bool.isRequired,
  selectedCardId: PropTypes.number.isRequired,
  setPaymentState: PropTypes.func.isRequired,
  storedCardDesc: PropTypes.string,
  storedCards: PropTypes.array,
  toggleAddNewCard: PropTypes.func.isRequired,
  resultCallback: PropTypes.func.isRequired,
  updateCard: PropTypes.func.isRequired,
  updateCardToUse: PropTypes.func.isRequired,
}

