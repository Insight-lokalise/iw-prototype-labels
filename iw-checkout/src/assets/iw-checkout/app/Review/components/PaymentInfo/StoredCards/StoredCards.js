import React, { Component } from 'react'
import { StoredCardsLink } from './../PaymentSFCs'
import { StoredCardsModal } from './StoredCardsModal'
import ScrollToTop from '../../../../../libs/routes/ScrollToTop'

export class StoredCards extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedCardId: 0,
      selectedCard: {},
    }
  }

  handleSelectCard = (card) => {
    this.setState({ selectedCard: card })
  }

  handleUpdateCard = (card, values) => {
    delete card.editable
    const updatedCardInfo = {
      ...card,
      ...values,
    }
    return this.props.updateCard(updatedCardInfo)
  }

  hideStoredCardsDialog = () => {
    this.props.hideStoredCardsModal()

    // Reset editable card's editable status.
    const editableCard = this.props.storedCards.find((card) => card.editable)
    if (editableCard) {
      this.props.onToggleCardEditable(editableCard.storedCardId)
    }
    // scroll back up to payment section
    ScrollToTop()
  }

  useThisCard = () => {
    if (Object.keys(this.state.selectedCard).length === 0) return false
    this.props.updateCardToUse(this.state.selectedCard)
  }

  render() {
    return (
      <span>
        <StoredCardsLink onClick={this.props.showStoredCardsModal} />
        {this.props.openStoredCardsModal && (
          <StoredCardsModal
            cards={this.props.storedCards}
            isRequisition={this.props.isRequisition}
            isCyberSource={this.props.isCyberSource}
            isEMEA={this.props.isEMEA}
            onHide={this.hideStoredCardsDialog}
            showStoredCardsDialog={this.props.openStoredCardsModal}
            useThisCard={this.useThisCard}
            selectedCardId={this.props.defaultCardId}
            onDeleteCard={this.props.onDeleteCard}
            onToggleCardEditable={this.props.onToggleCardEditable}
            handleFormSubmit={this.handleUpdateCard}
            onSelectingCard={this.handleSelectCard}
            billing={this.props.billing}
            salesOrg={this.props.salesOrg}
            currencyCode={this.props.currencyCode}
          />
        )}
      </span>
    )
  }
}

// paymentType={this.props.paymentType}
// updateCard={this.updateCard}
