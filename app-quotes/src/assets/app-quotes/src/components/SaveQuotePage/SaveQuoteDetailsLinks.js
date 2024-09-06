import React, { useContext, useState } from 'react'
import { Button, ButtonGroup, StoredAddressModal } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils/lib/labels'
import { getAddresses } from '../../hooks/getAddresses'
import { ADDRESS_RECORDS_PER_PAGE } from '../../api/getData'
import { saveShippingAddressToShoppingRequest } from '../../api/saveAddress'
import { SaveQuoteContext } from '../../context/SaveQuoteContext'

export const SaveQuoteDetailsLinks = ({
  shipping,
  addressId,
  address,
  companyName,
  attentionLine,
  formValues,
  setAddNewAddress,
  setFormValues,
  setQuoteAddress,
  setAddressError,
}) => {
  const { quote, onQuoteUpdate } =
    useContext(SaveQuoteContext)

  const initialStoredAddressState = {
    currentPage: 1,
    searchTerm: null,
  }
  const [state, setState] = useState(initialStoredAddressState)
  const [selectAddress, setSelectAddress] = useState(false)
  const [selectAddressIsReady, setSelectAddressIsReady] = useState(false)
  const [response, loading, error] = getAddresses([
    state,
    selectAddress,
    setSelectAddressIsReady,
  ])

  const addresses = response?.shipToBillToaddress

  const onSubmit = async (newAddress) => {
    try {
      // Handle new address selection
      const formattedAddress = {
        company: newAddress.partnerCompany,
        address1: newAddress.partnerAaddress1,
        address2: newAddress.partnerAddress2,
        address3: newAddress.partnerAddress3,
        city: newAddress.partnerCity,
        poBox: newAddress.poBox,
        state: newAddress.partnerState,
        zipCode: newAddress.partnerZip,
        zipExt: newAddress.partnerZip,
        countryId: newAddress.partnerCountry,
        county: newAddress.partnerCounty,
      }
      const addressToSave = {
        address: {
          ...formattedAddress,
        },
        attentionLine: newAddress.attentionLine,
        companyName: newAddress.partnerCompany,
        favoriteName: null,
        notes: '',
        overrideAddress: false,
        phone: newAddress.partnerPhone,
        id: newAddress.partnerFunction,
      }

      const { status, data: shippingRes } = await saveShippingAddressToShoppingRequest(
        addressToSave
      )
      if(shippingRes?.restrictIntlShipping) {
        setAddressError(true)
      }else{
        setAddressError(false)
      }
      if (status !== 200) {
        console.error('Error saving shipping address to shopping request')
      }
      setFormValues({
        ...formValues,
        ...{ contactName: newAddress.attentionLine || null },
        address: newAddress,
        storedAddress: true,
      })
      setQuoteAddress(addressToSave)
      onQuoteUpdate(quote)
      setSelectAddress(false)
      setSelectAddressIsReady(false)
    } catch (err) {
      console.warn(err.message)
    }
  }

  const pageHandler = (currentPage) => setState({ ...state, currentPage })

  const searchHandler = (term) => {
    setState({
      currentPage: 1,
      searchTerm: term,
    })
  }

  const handleCloseSelectAddress = () => {
    setSelectAddress(false)
    setSelectAddressIsReady(false)
  }

  const handleOpenSelectAddress = () => {
    setSelectAddress(true)
    setState({
      currentPage: 1,
      searchTerm: null,
    })
  }

  function calculateStats(response) {
    if (!response) return
    const { currentPage, totalRecords } = response
    const to = Math.ceil(currentPage * ADDRESS_RECORDS_PER_PAGE)
    const from = Math.floor(to - ADDRESS_RECORDS_PER_PAGE + 1)
    const calculatedTo = totalRecords < to ? totalRecords : to
    const rangeText = from == calculatedTo ? from : `${from}-${calculatedTo}`

    return `${t('Showing')} 
      ${!totalRecords ? '0' : `${rangeText}`}
      ${t('of')} ${totalRecords} ${
      totalRecords === 1 ? t('Result') : t('Results')
    }`
  }

  return (
    <section className="o-grid__item c-save-quote-links">
      <ButtonGroup align="right">
        <Button color="link" onClick={() => handleOpenSelectAddress()}>
          {t('Stored addresses')}
        </Button>
        <span>|</span>
        <Button color="link" onClick={() => setAddNewAddress(true)}>
          {t('Add new')}
        </Button>
      </ButtonGroup>
      {selectAddress && selectAddressIsReady && (
        <StoredAddressModal
          addresses={addresses}
          currentAddressLabel={t('Current shipping address')}
          currentAddress={{
            attentionLine,
            partnerFunction: addressId,
            partnerCompany: companyName,
            partnerAaddress1: address.address1,
            partnerAddress2: address.address2,
            partnerAddress3: address.address3,
            partnerCity: address.city,
            poBox: address.poBox,
            partnerState: address.state,
            partnerZip: address.zipCode,
            partnerCountry: address.countryId,
            partnerCounty: address.county,
            partnerPhone: shipping.phone
          }}
          currentPage={state.currentPage}
          error={error}
          loading={loading}
          onClose={() => handleCloseSelectAddress()}
          onSubmit={onSubmit}
          pageHandler={pageHandler}
          searchHandler={searchHandler}
          secondaryLabel={calculateStats(response)}
          // showResultsText
          totalPages={response?.totalPages}
        />
      )}
    </section>
  )
}

export default SaveQuoteDetailsLinks
