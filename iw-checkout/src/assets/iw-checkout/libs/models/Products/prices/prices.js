/**
 *  From an array of @param prices, choose the pricing option to use.
 *
 * If the user is browsing under a particular contract and that contract has special
 * pricing, (as generally indicated by the response of some request to get product
 * information, such as `compareProducts`) use the contract's pricing. This already
 * accounts for finding the cheapest of various prices.
 *
 * If the user is browsing freely they may see open market or standard product
 * listing prices.
 *
 * Some products require special pricing and the user must call to receive a quote.
 *
 * NOTE: Generally: Contract prices > Call for quote > Your Price > Open Market Price > List Price
 *
 * NOTE: Logic abstracted from the definition of getPriceFromWebProduct in productinfo.js
 *
 * @param  {Array<Object>} prices           Collection of price objects, usually of shape:
 *                                          { currency, inventoryPrice, morePricesAvailable, price, priceLabel }
 * @param  {Object} [contractDisplayInfo={}] If a user is browsing under a specific contract. If
 *                                           this item has special pricing, it will be held here.
 * @return {Object}                          The price Object from the collection with the correct
 *                                           pricing information
 */
export function getAppropriateProductPrice(prices, contractDisplayInfo = null) {
  let appropriatePrice
  const priceMap = priceTypes(prices)

  if (contractDisplayInfo != null) {
    return {
      price: contractDisplayInfo.contractPrice,
      currency: contractDisplayInfo.currency || 'USD',
      contractTitle: contractDisplayInfo.contractShortTitle || contractDisplayInfo.contractTitle || '',
    }
  } else if (priceMap.isInventoryPrice) {
    appropriatePrice = prices.find(price => ['COIPRICELABEL', 'CSIPRICELABEL'].includes(price.priceLabel))
  } else if (priceMap.callForPrice) {
    appropriatePrice = prices.find(price => price.priceLabel === 'CALLFORPRICELABEL')
  } else if (priceMap.yourPrice != null) {
    appropriatePrice = prices.find(price => price.priceLabel === 'YOURPRICELABEL')
    // appropriatePrice = priceMap.yourPrice
  } else if (priceMap.openMarketPrice != null) {
    appropriatePrice = prices.find(price => price.priceLabel === 'OPENMARKETPRICELABEL')
    // appropriatePrice = priceMap.openMarketPrice
  } else {
    appropriatePrice = prices.find(price => price.priceLabel === 'LISTPRICELABEL' || price.priceLabel === null)
    // appropriatePrice = priceMap.listPrice
  }

  return appropriatePrice
}

/**
 * @deprecated
 * Copied from search.js' contactUsRequestOnclick.
 *
 * We have temporarily decided to not implement this functionality because it causes
 * so much coupling between the React cart and the older cart.
 *
 * @return {undefined}             side-effect only code
 */
function contactUsForProductPricing(/*materialId, description*/) { // eslint-disable-line
    // const data = {
    //     materialId,
    //     description,
    //     labels: searchLabels.labels
    // }
    // const template = InsightCommon.getContent(InsightSearch.staticContentUrl, '', 'search/contactPricingPopUpTemplate.html')
    // $('#contactUsPopUpDivTemplate').attr('title', searchLabels.labels.contactUsForPricePopUpHeading)
    // $('#contactUsPopUpDivTemplate').html('')
    // $.template('contactUsConfiguratorTemplate', contactUsConfiguratorTemplate);
    // InsightCommon.renderTemplate('contactUsConfiguratorTemplate', data, '#contactUsPopUpDivTemplate');
    // $('#contactUsPopUpDivTemplate').dialog({ width: 'auto', height: 'auto', resizable: true, position: 'relative', draggable: true });
}

/**
 * Turn an array of price objects into an object with keys representing the available prices.
 * This seems clearly redundant / unnecessary. The parsing is weird so I haven't yet figured out
 * the better alternative. This is taken from `function getPrices(prices)` of productinfo.js
 * @param  {Array<Object>} prices       Collection of price objects, usually of shape:
 *                                      { currency, inventoryPrice, morePricesAvailable, price, priceLabel }
 * @return {Object}                     generally of shape {listPrice?, openMarketPrice?, yourPrice?,
 *                                                callForPrice?, isInventoryPrice?}
 */
function priceTypes(prices) {
    return prices.reduce((acc, priceGroup) => {
        const { price, inventoryPrice } = priceGroup
        let { priceLabel } = priceGroup

        if (priceLabel == null) priceLabel = 'NULL'
        switch (priceLabel) {
            case 'LISTPRICELABEL':
                acc.listPrice = price
                break
            case 'OPENMARKETPRICELABEL':
                acc.openMarketPrice = price
                break
            case 'YOURPRICELABEL':
                acc.yourPrice = price
                break
            case 'COIPRICELABEL':
            case 'CSIPRICELABEL':
                acc.yourPrice = inventoryPrice
                acc.isInventoryPrice = true
                break
            case 'CALLFORPRICELABEL':
                acc.yourPrice = price
                acc.callForPrice = priceLabel
                break
            case 'NULL':
                if (acc.listPrice != null) acc.listPrice = price
                break
            case 'LEASEPRICELABEL':
                acc.leasePrice = price
                break
            case 'VATPRICELABEL':
                acc.vatPrice = price
                break
            default: throw Error(`Error parsing price: ${JSON.stringify(priceGroup)}`)
        }

        return acc
    }, {})
}
