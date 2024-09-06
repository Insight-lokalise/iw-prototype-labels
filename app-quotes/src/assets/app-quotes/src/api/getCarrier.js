import axios, { POST } from './axiosConfig'

export const getCarrier = async (carrier) => {
  try {
    const isUsingThirdParty =
      carrier.billMyCarrier && !!carrier.thirdPartyCarrier
    const { data } = await axios({
      method: POST,
      url: 'insightweb/carrier',
      data: {
        cart: {
          summary: {
            shippingCost: isUsingThirdParty ? 0 : carrier.price,
          },
        },
        shipping: {
          carrier: {
            name: carrier.carrier,
            option: carrier.condition || carrier.shippingCode,
            saturday: !!Number(carrier.saturdayDelivery || carrier.saturday),
            description: carrier.conditionDescription,
          },
          shipComplete: carrier.shipComplete,
        },
      },
    })
    if (!data) throw new Error('Failed to retrieve carrier')
    return data
  } catch (err) {
    console.warn('Failed to retrieve carrier')
    throw err // re-throw error for initial testing of functionality
  }
}
