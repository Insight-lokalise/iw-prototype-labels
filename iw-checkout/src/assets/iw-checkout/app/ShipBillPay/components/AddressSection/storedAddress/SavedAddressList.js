import React from 'react'
import PropTypes from 'prop-types'

import { t } from '@insight/toolkit-utils/lib/labels'
import { ShowIf } from './../../../../../libs/higherOrderComponents'
import { IWAddress } from './../../../../../libs/iw-components'
import { FavoriteInput } from './FavoriteInput'

export function SavedAddressList(props) {
    const accountName = t('Account name')
    const address = t('Address')
    const favoriteName = t('Favorite name')
    const attnTxt = t('Attn:')
    const noResultsFound = t('No search results found')

    return (
        <div className="table">
            <div className="table__header">
                <div className="row align-middle">
                    <div className="columns small-1 medium-shrink table__col table__col--header table__col--select"></div>
                    <div className="columns small-5 medium-expand table__col table__col--header">{ accountName }</div>
                    <div className="columns table__col table__col--header">{ address }</div>
                    <ShowIf permissions={['edit_chkout_default_favs']}>
                        <div className="columns hide-for-small-only table__col table__col--header">{ favoriteName }</div>
                    </ShowIf>
                </div>
            </div>
            <div className="table__body">
                { props.savedAddresses.length > 0 ? props.savedAddresses.map((address, index) => (
                    <div className="table__row" key={ address.partnerFunction }>
                        <div className="row align-middle">
                            <div className="columns small-1 medium-shrink table__col table__col--select table__col--body">
                                <input type="radio" name="defaultAddress" value={address.partnerFunction}
                                    id={address.partnerFunction}
                                    defaultChecked={props.pickedAddress.id === address.partnerFunction}
                                    onClick={()=>props.toggleItem(address.partnerFunction, address)} />
                            </div>
                            <div className="columns small-5 medium-expand table__col table__col--body">
                                <label htmlFor={address.partnerFunction} className="stored-address__label">{address.partnerCompany}</label>
                            </div>
                            <div className="columns table__col table__col--body">
                                { address.attentionLine !== null &&
                                    <p className="no-margin-bot">{attnTxt} { address.attentionLine }</p>
                                }
                                <IWAddress className="no-margin-bot"
                                    address={address} />
                            </div>
                            <ShowIf permissions={['edit_chkout_default_favs']}>
                                <div className="columns small-11 small-offset-1 medium-expand medium-offset-0 table__col table__col--body">
                                    <FavoriteInput
                                        key= {index}
                                        address={address}
                                        updateFavoriteName={props.updateFavoriteName}
                                        refreshFavoriteAddresses={props.refreshFavoriteAddresses}
                                        isShipping={props.isShipping}
                                    />
                                </div>
                            </ShowIf>
                        </div>
                    </div>
                    )) :
                    <div className="table__col">
                        <p className="no-margin-bot">{noResultsFound}</p>
                    </div>
                }
            </div>
        </div>
    );
}

SavedAddressList.propTypes = {
    address: PropTypes.shape({
        partnerCompany: PropTypes.string.isRequired,
        partnerFunction: PropTypes.string,
        attentionLine: PropTypes.string,
    }),
    pickedAddress: PropTypes.object.isRequired,
}
