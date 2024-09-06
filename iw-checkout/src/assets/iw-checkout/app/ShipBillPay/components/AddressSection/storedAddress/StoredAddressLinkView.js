import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { t } from '@insight/toolkit-utils/lib/labels'

import { IWAnchor, msgBox } from './../../../../../libs/iw-components'
import StoredAddressModal from './StoredAddressModal'
import { updateFavoriteName, getStoredAddresses } from '../../../actions'
import { selector_savedShippingAddresses, selector_storedShippingAddresses, selector_storedBillingAddresses } from '../../../selectors'
import { normalizeToPurchaseOrderAddress } from './../../../../../libs/models/Address/address'

class StoredAddressLinkView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showStoredAddressModal: false,
            useThisAddress: props.selectedAddress || {},
            partnerFunction: '',
            recordsPerPage: 5,
            startPage: 1,
            shipIndicator: true,
            searchKey: '',
        }
    }

    componentDidMount() {
        const shipIndicator = this.props.isShipping
        this.props.getStoredAddresses({ shipIndicator, startPage: 1, searchKey: '' })
    }

    setSearchKey = searchKey => {
        this.setState({ searchKey: searchKey }, () => {
            this.handlePageChange({
                startPage: 1,
            })
        })
    };

    toggleStoredAddressModal = () => {
        this.setState({
            showStoredAddressModal: !this.state.showStoredAddressModal,
            startPage: 1,
            searchKey: '',
        })
        this.props.scrollToSection()
    };

    toggleItem = (partnerId, address) => {
        this.setState({
            partnerFunction: partnerId,
            useThisAddress: normalizeToPurchaseOrderAddress(address),
        })
    };

    useThisAddress = () => {
        msgBox.removeMsg(this.props.messageBoxId, 'restrictShippingMessage')
        const normalizedAddr = normalizeToPurchaseOrderAddress(this.state.useThisAddress)
        this.props.selectAddress(normalizedAddr)
        this.props.setSelectedFavorite({ value: normalizedAddr.id })
        this.props.scrollToSection()
    };

    handlePageChange = pageObj => {
        /*
            Used temporary startpage in pagination to let the componnet knows that to rerender the pagination
            when we do search by keyword in the middle of pagination ex:4th page.
            After pagination renders by search keyword, reset the tmpStartPage to null to avoid conflict in next search
         */
        pageObj.shipIndicator = this.props.isShipping
        pageObj.searchKey = this.state.searchKey
        this.setState({
            startPage: pageObj.startPage,
            tmpStartPage: pageObj.startPage,
        }, () => {
            this.props.getStoredAddresses(pageObj)
            this.setState({ tmpStartPage: null })
        })
    };

    render() {
        const storedAddresseText = t('Stored addresses')
        return (
          <Fragment>
            <IWAnchor onClick={this.toggleStoredAddressModal} className={cn('section__body-action', this.props.className)}>
                <span>{storedAddresseText}</span>
            </IWAnchor>
            <StoredAddressModal
              savedAddresses={this.props.storedAddresses.savedAddresses}
              onHide={this.toggleStoredAddressModal}
              getStoredAddresses = {this.props.getStoredAddresses}
              showStoredAddressDialog={this.state.showStoredAddressModal}
              updateFavoriteName={this.props.updateFavoriteName}
              refreshFavoriteAddresses={this.props.refreshFavoriteAddresses}
              toggleItem={this.toggleItem}
              useThisAddress={this.useThisAddress}
              handlePageChange={this.handlePageChange}
              startPage={this.state.startPage}
              totalRecords={this.props.storedAddresses.totalRecords}
              recordsPerPage={this.state.recordsPerPage}
              isShipping={this.props.isShipping}
              selectedAddress={this.props.selectedAddress}
              pickedAddress={this.state.useThisAddress}
              setSearchKey={this.setSearchKey}
              tmpStartPage={this.state.tmpStartPage}
            />
          </Fragment>
        )
    }
}

function mapStateToProps(state, { isShipping }) {
    return {
        updatedFavoriteName: selector_savedShippingAddresses(state),
        storedAddresses: isShipping ? selector_storedShippingAddresses(state) : selector_storedBillingAddresses(state),
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateFavoriteName,
        getStoredAddresses,
    }, dispatch)
}

StoredAddressLinkView.propTypes = {
    storedAddresses: PropTypes.shape({
        savedAddresses: PropTypes.array,
        totalPages: PropTypes.number.isRequired,
        totalRecords: PropTypes.number.isRequired,
    }),
    getStoredAddresses: PropTypes.func,
    isShipping: PropTypes.bool.isRequired,
    setSelectedFavorite: PropTypes.func.isRequired,
    selectedAddress: PropTypes.func.isRequired,
    scrollToSection: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(StoredAddressLinkView)
