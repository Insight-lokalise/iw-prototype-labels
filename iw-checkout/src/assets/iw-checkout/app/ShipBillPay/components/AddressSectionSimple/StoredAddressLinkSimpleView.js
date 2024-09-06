import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { Button, StoredAddressModal } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils/lib/labels'
import { msgBox } from './../../../../libs/iw-components'
import { normalizeToPurchaseOrderAddress } from './../../../../libs/models/Address/address'
import { selector_storedShippingAddresses, selector_storedBillingAddresses } from '../../selectors'
import { getStoredAddresses } from '../../actions'

const ADDRESS_RECORDS_PER_PAGE = 3

export const StoredAddressLinkSimpleView = ({
    selectedAddress,
    selectAddress,
    getStoredAddresses,
    storedAddresses,
    isShipping,
    messageBoxId,
}) => {
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [totalRecords, setTotalRecords] = useState(1)
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [openStoredAddressModal, setOpenStoredAddressModal] = useState(false)

    useEffect(() => {
        setCurrentPage(storedAddresses.currentPage)
        setTotalPages(storedAddresses.totalPages)
        setTotalRecords(storedAddresses.totalRecords)        
    }, [storedAddresses])

    const onSubmit = async (newAddress) => {

        msgBox.removeMsg(messageBoxId, 'restrictShippingMessage')
        const normalizedAddr = normalizeToPurchaseOrderAddress(newAddress)
        selectAddress(normalizedAddr)
        setOpenStoredAddressModal(false)
    }

    const searchHandler = (term) => {
        setLoading(true)
        setSearchTerm(term)
        const pageObj = {
            shipIndicator: isShipping,
            searchKey: term,
            startPage:  1,
        }
        getStoredAddresses(pageObj)
            .then(() => setLoading(false))
            .catch(() => {setLoading(false)})
    }

    const pageHandler = (newPage) => {
        setLoading(true)
        const pageObj = {
            shipIndicator: isShipping,
            searchKey: searchTerm,
            startPage: newPage,
        }
        getStoredAddresses(pageObj)
            .then(() => setLoading(false))
            .catch(() => {setLoading(false)})
    }

    const calculateStats = () => {
        if (!storedAddresses) return                
        const to = Math.ceil(currentPage * ADDRESS_RECORDS_PER_PAGE)
        const from = Math.floor(to - ADDRESS_RECORDS_PER_PAGE + 1)
        const calculatedTo = (totalRecords < to) ? totalRecords : to
        const rangeText = (from == calculatedTo) ? from : `${from}-${calculatedTo}`

        return `${t('Showing')} 
            ${!totalRecords ? '0' : `${rangeText}`}
            ${t('of')} ${totalRecords} ${
            totalRecords === 1 ? t('Result') : t('Results')
        }`
    }

    const openModal = () => {
        setSearchTerm('')
        getStoredAddresses({ shipIndicator: isShipping, startPage: 1, searchKey: '' }).then(() => {
            setOpenStoredAddressModal(true)
            setLoading(false)
        }).catch(() => {setLoading(false)})
    }

    return (
    <>
        <Button color="link" onClick={openModal}>
            {t('Stored addresses')}
        </Button>
        {openStoredAddressModal && (
        <StoredAddressModal
            addresses={storedAddresses.savedAddresses}
            currentAddressLabel={isShipping ? t('Current shipping address') : t('Current billing address')}
            currentAddress={{
                attentionLine: selectedAddress.attentionLine,
                partnerFunction: selectedAddress.id,
                partnerCompany: selectedAddress.companyName,
                partnerAaddress1: selectedAddress.address.address1,
                partnerAddress2: selectedAddress.address.address2,
                partnerAddress3: selectedAddress.address.address3,
                partnerCity: selectedAddress.address.city,
                poBox: selectedAddress.address.poBox,
                partnerState: selectedAddress.address.state,
                partnerZip: selectedAddress.address.zipCode,
                partnerCountry: selectedAddress.address.countryId,
                partnerCounty: selectedAddress.address.county,
            }}
            currentPage={currentPage}
            error={error}
            loading={loading}
            onClose={() => setOpenStoredAddressModal(false)}
            onSubmit={onSubmit}
            pageHandler={pageHandler}
            searchHandler={searchHandler}
            secondaryLabel={calculateStats()}
            showResultsText
            totalPages={totalPages}
        />
        )}
    </>
    )
}

function mapStateToProps(state, { isShipping }) {
    return {
        storedAddresses: isShipping ? selector_storedShippingAddresses(state) : selector_storedBillingAddresses(state),
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getStoredAddresses: (searcObj) => {
            return getStoredAddresses({
                ...searcObj,
                recordsPerPage: ADDRESS_RECORDS_PER_PAGE,
            })
        }
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(StoredAddressLinkSimpleView)

StoredAddressLinkSimpleView.propTypes = {
    storedAddresses: PropTypes.shape({
        savedAddresses: PropTypes.array,
        totalPages: PropTypes.number.isRequired,
        totalRecords: PropTypes.number.isRequired,
    }),
    selectedAddress: PropTypes.object.isRequired,
    selectAddress: PropTypes.func.isRequired,
    getStoredAddresses: PropTypes.func,
    isShipping: PropTypes.bool.isRequired,
}