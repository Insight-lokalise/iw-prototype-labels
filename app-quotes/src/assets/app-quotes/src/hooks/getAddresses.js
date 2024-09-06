import { useState, useEffect } from 'react'
import { fetchAddresses } from '../api'

export const getAddresses = (deps = []) => {
  const [{ response, loading, error }, setAddresses] = useState({
    loading: true,
    error: null,
    response: null,
  })

  const [{ currentPage, searchTerm }, selectAddress, setSelectAddressIsReady] =
    deps

  useEffect(() => {
    if (!selectAddress) return
    setAddresses({ response, loading: true, error: null })
    // Call api using the specified quote id
    try {
      fetchAddresses({
        startPage: currentPage || 1,
        shipToBillToSearch: {
          shipToBillToSearchType: 'All',
          searchText: searchTerm,
        },
      }).then(({ shipResponse }) => {
        if (shipResponse) {
          setAddresses({
            error: null,
            loading: false,
            response: shipResponse,
          })
          setSelectAddressIsReady(true)
        }
      })
    } catch (err) {
      setAddresses({ loading: false, error: err.message, response: null })
    }
  }, deps)

  return [response, loading, error]
}

export default getAddresses
