import axios, { POST } from './axiosConfig'
import { transformShoppingToCart } from './transformShoppingToCart'

/** Save Quote API
 * 
 * Save the current quote using the provided info
 *  @param {string} quoteName
 *  @param {string} quoteNotes
 *  @param {number} carrierId
 *  @param {string} attentionForShipping
 *  @param {boolean} shipToOverride
  {
    quoteName: 'ces test',
    quoteNotes: 'test notes',
    carrierId: 70,
    attentionForShipping: 'ces user',
    shipToOverride: true
  }
 */
export const saveQuote = async (quote, shipTo) => {
  if (!quote) throw new Error('Error saving quote: missing required quote')
  try {
    // Transform shopping request to cart object prior to saving quote
    await transformShoppingToCart()
    const { data } = await axios({
      method: POST,
      url: `insightweb/transaction/v1/saveQuote`,
      data: {
        quoteName: quote.quoteName,
        quoteNotes: quote.comments,
        carrierId: parseInt(quote.shippingMethod),
        attentionForShipping: quote.contactName,
        shipTo,
        shipToOverride: true,
      },
    })
    if (!data) throw new Error('Error saving quote')
    return data
  } catch (err) {
    if (err.response?.data?.message) err = new Error(err.response.data.message)
    console.warn(`Failed to save quote`, err)
    throw err
  }
}

export default {
  saveQuote,
}
