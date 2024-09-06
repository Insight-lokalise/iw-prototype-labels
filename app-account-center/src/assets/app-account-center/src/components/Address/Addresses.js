import React, {useState, useEffect} from 'react'
import AddressesHeader from './AddressesHeader'
import AddressesList from './AddressesList'
import { fetchCheckOutDefaults, fetchPersonalInformation } from "../../api";

const Addresses = ({addToast}) => {
  const [filterString, setFilterString] = useState('')
  const [defaultShipping, setDefaultShipping] = useState(null)
  const [defaultBilling, setDefaultBilling] = useState(null)
  const [soldTo, setSoldTo] = useState(null)

  useEffect(()=>{
    Promise.all([fetchCheckOutDefaults(true), fetchPersonalInformation()]).then(([{defaultShippingAddress, defaultBillingAddress}, {accountNumber}])=> {
      setDefaultShipping(defaultShippingAddress || {})
      setDefaultBilling(defaultBillingAddress || {})
      setSoldTo(accountNumber)
    });
  }, [])

  // update checkout defaults cache and addresses for the specified address type
  const getDefaultAddresses = (isShipping) => {
    return fetchCheckOutDefaults(true).then(({defaultShippingAddress, defaultBillingAddress})=>{
      isShipping ? 
        setDefaultShipping(defaultShippingAddress || {}) :
        setDefaultBilling(defaultBillingAddress || {})
    })
  }

  return (
    <div className="c-account-center">
      <div className='c-account-header'>
        <div className='o-grid o-grid--bottom'>
          <div className="o-grid__item">
            <AddressesHeader setFilterString={setFilterString} />
          </div>
        </div>
      </div>
      <div className='o-grid o-grid--gutters-small c-account-center-tiles'>
        <div className="o-grid__item">
          <AddressesList 
            isShipping
            filterString={filterString}
            defaultAddress={defaultShipping}
            getDefaultAddresses={getDefaultAddresses} 
            addToast={addToast}
            soldTo={soldTo}
          />
        </div>
      </div>
      <div className='o-grid o-grid--gutters-small c-account-center-tiles'>
        <div className="o-grid__item">
          <AddressesList 
            filterString={filterString}
            defaultAddress={defaultBilling}
            getDefaultAddresses={getDefaultAddresses}
            addToast={addToast}
            soldTo={soldTo}
          />
        </div>
      </div>
    </div>
  )
}

export default Addresses;
