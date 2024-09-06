import { useState, useEffect } from 'react'
import { fetchShippingCarriers, getCarrier } from '../api'
import { shippingCarrier } from '../lib/helpers'
import { getTaxAndEWRFee } from '../api/getData'

/** getShippingCarriers
 *
 * Get the shipping carriers */
export const getShippingCarriers = (deps = []) => {
  const [{ loading, error, ...carriers }, setCarriers] = useState({
    shoppingRequest: null,
    selectedCarrier: null,
    availableCarriers: null,
    loading: true,
    error: null,
  })
  const fetchCarriers = async (cart) => {
    if (!cart) return
    try {
      // Get cart and carrier data
      const carriers = await fetchShippingCarriers()
      // Transform carriers to shipping carriers
      const { selectedCarrier, availableCarriers } = shippingCarrier(
        carriers,
        cart?.shipping
      )
      const price = cart?.summary?.shippingCost || selectedCarrier?.price

      let shoppingRequest
      try {
        // Get an updated shopping request by passing the cart response to get carrier
        shoppingRequest = await getCarrier({
          ...selectedCarrier,
          price,
        })
      } catch (err) {
        // TODO: Exclude nonshippable parts. Need incase the carrier call fails. Non shippable parts.
        shoppingRequest = cart
      }

      const { data } = await getTaxAndEWRFee() //update tax
      if (!data) {
          throw new Error('Error retrieving Shopping Request')
      }
      shoppingRequest = data

      // Set both the quote and transformed carrier state
      setCarriers({
        shoppingRequest,
        availableCarriers,
        selectedCarrier,
        loading: false,
        error: null,
      })
    } catch (err) {
      setCarriers({ carriers: null, loading: false, error: err.message })
    }
  }
  useEffect(() => {
    const cart = deps[0]
    fetchCarriers(cart)
  }, deps)

  return [carriers, loading, error, fetchCarriers]
}

export default getShippingCarriers
