import React, {Component} from 'react'
import { StoredCardsLink } from './../PaymentSFCs'
import { StoredCardsModal } from './StoredCardsModal'

export class StoredCards extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showStoredCardsDialog: false,
            selectedCardId: 0,
            selectedCard: {},
        }
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if (!prevState.showStoredCardsDialog && nextProps.openStoredCardsModal) {
            return {showStoredCardsDialog : true}
        } else {
            return null;
        }
    }

    handleSelectCard = card => {
        this.setState({ selectedCard: card })
    };

    handleUpdateCard = (card, values) => {
        delete card.editable
        const updatedCardInfo = {
            ...card,
            ...values,
        }
        this.props.updateCard(updatedCardInfo)
    };

    hideStoredCardsDialog = () => {
        this.setState({ showStoredCardsDialog: false })

        // Reset editable card's editable status.
        const editableCard = this.props.storedCards.find(card => card.editable)
        if (editableCard) {
            this.props.onToggleCardEditable(editableCard.storedCardId)
        }
    };

    showStoredCardsDialog = () => {
        this.setState({ showStoredCardsDialog: true })
    };

    useThisCard = () => {
        if(Object.keys(this.state.selectedCard).length === 0) return false
        this.props.updateCardToUse(this.state.selectedCard)
    };

    render() {
        return (
            <span>
                <StoredCardsLink onClick={this.showStoredCardsDialog} />
                {this.state.showStoredCardsDialog &&
                    <StoredCardsModal
                        cards={this.props.storedCards}
                        onHide={this.hideStoredCardsDialog}
                        showStoredCardsDialog={this.state.showStoredCardsDialog}
                        useThisCard={this.useThisCard}
                        selectedCardId={this.props.defaultCardId}
                        onDeleteCard={this.props.onDeleteCard}
                        onToggleCardEditable={this.props.onToggleCardEditable}
                        handleFormSubmit={this.handleUpdateCard}
                        onSelectingCard={this.handleSelectCard}
                    />}
            </span>
        )
    }
}

// paymentType={this.props.paymentType}
// updateCard={this.updateCard}
