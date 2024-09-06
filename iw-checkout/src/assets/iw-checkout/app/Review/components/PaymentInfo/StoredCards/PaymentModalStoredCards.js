import React, {useState, useEffect} from 'react'
import PropTypes from "prop-types";

import {StoredCardsModalView} from "./StoredCardsModal"
import {IWButton} from "../../../../../libs/iw-components";
import {t} from "@insight/toolkit-utils/lib/labels";

export default function PaymentModalStoredCards(props) {
  const initialCard = props.cards.find(card => card.storedCardId === props.selectedCardId)
  const [selectedCard, setSelectedCard] = useState(initialCard)

  useEffect(()=>{
    const selectedCard = props.cards.find(card => card.storedCardId === props.selectedCardId)
    selectedCard && setSelectedCard(selectedCard)
  }, [props.cards, props.selectedCardId])

  const handleUpdateCard = (card, values) => {
    delete card.editable
    const updatedCardInfo = {
      ...card,
      ...values,
    }
    props.updateCard(updatedCardInfo)
  };

  const hideStoredCardsDialog = () => {
    props.onCancel()
    // Reset editable card's editable status.
    const editableCard = props.cards.find(card => card.editable)
    if (editableCard) {
      this.props.onToggleCardEditable(editableCard.storedCardId)
    }
  };

  const useThisCard = (event) => {
    if(Object.keys(selectedCard).length === 0) return false
    props.updateCardToUse(selectedCard)
    if (!event.isPropagationStopped()) {
      hideStoredCardsDialog();
    }
  };

  return (
    <div className="stored-cards-modal-view">
      <StoredCardsModalView
        cards={props.cards}
        isEMEA={props.isEMEA}
        selectedCardId={props.selectedCardId}
        onDeleteCard={props.onDeleteCard}
        onToggleCardEditable={props.onToggleCardEditable}
        handleFormSubmit={handleUpdateCard}
        onSelectingCard={setSelectedCard}
      />
      <div className="row align-right">
        <div className="columns small-6 medium-shrink">
          <IWButton
            className="expanded hollow no-margin-bot"
            onClick={hideStoredCardsDialog}
            type="button"
          >
            {t('Cancel')}
          </IWButton>
        </div>
        <div className="columns small-6 medium-shrink">
          <IWButton
            className="expanded no-margin-bot"
            onClick={useThisCard}
            type="button"
          >
            {t('Continue')}
          </IWButton>
        </div>
      </div>
    </div>
  )
}

PaymentModalStoredCards.propTypes = {
  cards: PropTypes.array,
  isEMEA: PropTypes.bool.isRequired,
  selectedCardId: PropTypes.number.isRequired,
  onDeleteCard: PropTypes.func.isRequired,
  onToggleCardEditable: PropTypes.func.isRequired,
  updateCard: PropTypes.func.isRequired,
  updateCardToUse: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}
