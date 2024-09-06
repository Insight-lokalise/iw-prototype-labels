import React from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils/lib/labels'
import { IWModal, IWAddress } from './../../../../../libs/iw-components'

import StoredAddressesSearch from './SearchView'
import { SavedAddressList } from './SavedAddressList'
import IWPagination from './../../../../../libs/iw-components/iw-pagination/iw-pagination'

export default function StoredAddressModal(props) {
    const usingAddress = t('You are using this address:')
    const noSelectedAddress = t('No default address')
    const shippingTitle = t('Shipping addresses')
    const billingTitle = t('Billing addresses')
    const attnTxt = t('Attn:')
    const cancelText = t('Cancel')
    const continueText = t('Continue')
    const {
            savedAddresses,
            getStoredAddresses,
            updateFavoriteName,
            refreshFavoriteAddresses,
            useThisAddress,
            toggleItem,
            recordsPerPage,
            totalRecords,
            isShipping,
            selectedAddress,
            handlePageChange,
            setSearchKey,
            pickedAddress,
         } = props
    return (
        <IWModal
            backdropClassName='iw-dialog iw-dialog-backdrop'
            modalSize='xLarge'
            showIf={props.showStoredAddressDialog}
            title={isShipping ? shippingTitle : billingTitle}
            cancelBtnText={cancelText}
            confrimBtnText={continueText}
            onHide={props.onHide}
            onConfirm={useThisAddress}
            >
            <div className="row stored-address">
                <div className="column">
                    {selectedAddress ?
                        <div>
                            <p><strong>{usingAddress}</strong></p>
                            <div className="row">
                                <div className="columns hide-for-small-only medium-shrink table__col--select"></div>
                                <div className="columns small-12 medium-expand">
                                    <p className="no-margin-bot">
                                        <strong>
                                            { selectedAddress.partnerCompany ||
                                              selectedAddress.companyName ||
                                              selectedAddress.shippingCompany ||
                                              selectedAddress.billingCompany
                                            }
                                        </strong>
                                    </p>
                                </div>
                                <div className="columns small-12 medium-expand">
                                    { selectedAddress.attentionLine &&
                                        <p className="no-margin-bot">{attnTxt}&nbsp;{ selectedAddress.attentionLine }</p>
                                    }
                                    <IWAddress
                                        address={selectedAddress} />
                                </div>
                                <div className="columns small-12 medium-expand">
                                    <p><strong>{selectedAddress.favoriteName}</strong></p>
                                </div>
                            </div>
                        </div>
                        : <p>{ noSelectedAddress }</p>
                    }
                <StoredAddressesSearch
                    getStoredAddresses={getStoredAddresses}
                    isShipping={isShipping}
                    setSearchKey={setSearchKey}
                    handlePageChange={handlePageChange} />
                <SavedAddressList
                    savedAddresses={savedAddresses}
                    selectedAddress={selectedAddress}
                    pickedAddress={pickedAddress}
                    updateFavoriteName={updateFavoriteName}
                    refreshFavoriteAddresses={refreshFavoriteAddresses}
                    useThisAddress={useThisAddress}
                    toggleItem={toggleItem}
                    isShipping = {isShipping} />
                {totalRecords > 5 &&
                    <IWPagination
                        intialPage={1}
                        tmpStartPage={props.tmpStartPage}
                        totalRecords={totalRecords}
                        recordsPerPage={recordsPerPage}
                        handlePageChange={handlePageChange} />
                }
                </div>
            </div>
        </IWModal>
    )
}

StoredAddressModal.propTypes = {
    savedAddresses: PropTypes.array.isRequired,
    getStoredAddresses: PropTypes.func.isRequired,
    useThisAddress: PropTypes.func,
    toggleItem: PropTypes.func.isRequired,
    recordsPerPage: PropTypes.number,
    totalRecords: PropTypes.number,
    isShipping: PropTypes.bool.isRequired,
    selectedAddress: PropTypes.object,
    handlePageChange: PropTypes.func,
    setSearchKey: PropTypes.func,
    pickedAddress: PropTypes.object
}
