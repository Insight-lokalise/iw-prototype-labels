import React, {Component} from 'react'
import PropTypes from 'prop-types'

import { t } from '@insight/toolkit-utils/lib/labels'
import { IWAnchor } from '../../../../../libs/iw-components'

const editFavName = t('Edit favorite name')
const cancelFavName = t('Cancel')
const saveFavName = t('Save favorite name')
const favoriteAddress = t('Favorite address')
const duplicateError = t('The favorite name entered already exists.')
const addFavName = t('Add favorite name')

export class FavoriteInput extends Component {
    constructor() {
        super()
        this.state = {
            isFavoriteNameEditable: false,
            hasDuplicateFavoriteName: false,
        }
    }

    deleteOrCancelFavoriteName = () => {
        if (this.state.isFavoriteNameEditable) { // Cancel from editing favorite name
            this.setState({
                isFavoriteNameEditable: false,
                hasDuplicateFavoriteName: false,
            })
        } else { // delete favorite name
            this.saveFavoriteName()
        }
    };

    saveFavoriteName = () => {
        const favoriteName = this.state.isFavoriteNameEditable ? this.refs.favName.value : ''
        if (this.state.isFavoriteNameEditable) {
            this.toggleFavoriteName() // toggle state only in save scenario not in delete scenario
        }
        const shipBillIndicator = this.props.isShipping ? 1 : 2 /* 1- Shipping , 2- Billing*/
        const updatedAddressObj = {
            partnerFunction: this.props.address.partnerFunction,
            favouriteId: this.props.address.favouriteId,
            favouriteLineId: this.props.address.favouriteLineId,
            shipBillIndicator,
            updateNickName: true,
            updateDefAddress: false,
            favoriteName,
        }
        this.props.updateFavoriteName(updatedAddressObj)
            .then((response) => {
                if (response.Exception) {
                    this.setState({
                        hasDuplicateFavoriteName: true,
                        isFavoriteNameEditable: true,
                    })
                } else {
                    this.setState({ hasDuplicateFavoriteName: false })
                }
            })
            .then(this.props.refreshFavoriteAddresses)
    };

    toggleFavoriteName = () => {
        this.setState({ isFavoriteNameEditable: !this.state.isFavoriteNameEditable })
    };

    render() {
        const favouriteName = this.props.address.favouriteName
        const { isFavoriteNameEditable } = this.state
        return (
            <div className="fav-name">
                <div className="row align-middle">
                    { favouriteName ?
                        <span className='columns shrink ion-ios-heart color--crimson fav-name__icon' title={favoriteAddress}>
                            <span className="show-for-sr">{favoriteAddress}</span>
                        </span> :
                        <IWAnchor className='columns shrink ion-ios-heart-outline fav-name__icon fav-name__icon--add' onClick={this.toggleFavoriteName} title={addFavName}>
                            <span className="show-for-sr">{addFavName}</span>
                        </IWAnchor>
                    }
                    <div className="columns">
                        <div className="row align-middle">
                            { favouriteName && !isFavoriteNameEditable &&
                                <div className="columns">
                                    <div className="row align-middle">
                                        <div className="columns fav-name__label">{favouriteName}</div>
                                        <IWAnchor className="columns shrink ion-edit fav-name__icon" onClick={this.toggleFavoriteName} title={editFavName}>
                                            <span className="show-for-sr">{editFavName}</span>
                                        </IWAnchor>
                                    </div>
                                </div>
                            }
                            { isFavoriteNameEditable &&
                                <input ref="favName" type="text" className="columns no-margin-bot"
                                    defaultValue={favouriteName} maxLength="20" />
                            }
                            { (favouriteName || isFavoriteNameEditable) &&
                                <IWAnchor className="columns shrink ion-close fav-name__icon" onClick={this.deleteOrCancelFavoriteName} title={cancelFavName}>
                                    <span className="show-for-sr">{cancelFavName}</span>
                                </IWAnchor>
                            }
                            { isFavoriteNameEditable &&
                                <IWAnchor className="columns shrink ion-checkmark fav-name__icon" onClick={this.saveFavoriteName} title={saveFavName}>
                                    <span className="show-for-sr">{saveFavName}</span>
                                </IWAnchor>
                            }
                        </div>
                    </div>
                </div>
                { this.state.hasDuplicateFavoriteName &&
                    <div className="row row__gutter--tiny collapse align-middle fav-name__error">
                        <span className="columns shrink iw-message__icon iw-message__icon--error ion-ios-information"></span>
                        <div className="columns">{duplicateError}</div>
                    </div>
                }
            </div>
        )
    }
}

FavoriteInput.propTypes = {
    index: PropTypes.number,
    isShipping: PropTypes.bool.isRequired,
    address: PropTypes.object.isRequired,
    updateFavoriteName: PropTypes.func.isRequired,
    refreshFavoriteAddresses: PropTypes.func.isrequired,
}
