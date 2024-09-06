// This function formats Order templates for easier rendering
export default function orderFormatting(data) {
  const list = {
    contracts: data.contracts,
    shippingAddress: !!data.shipping && formatShipBill(data.shipping, 'ship'),
    billingAddress: !!data.billing && formatShipBill(data.billing, 'bill'),
  }
  if (data.freightInfo) {
    const { carrier, notes, notificationEmail } = data.freightInfo
    list.shippingOptions = [
      { header: 'Shipping carrier:', text: `${carrier.name}${carrier.description ? ` - ${carrier.description}` : ''}` },
      { header: 'Notifications:', text: notificationEmail },
      { header: 'Shipping related notes:', text: notes },
      { header: 'Carrier account:', text: carrier.thirdPartyDisplayName }
    ]
  }
  if (data.additionalOrderInfo ) {
    list.additionalInformation = data.additionalOrderInfo.map(entry => ({ header: entry.name, text: entry.value }))
  }
  return list
}

// This is a helper function for formatting the shipping and billing data
function formatShipBill({ address, attentionLine, companyName, phone }, type) {
  const addressText = address && formatAddress(address)
  return [
    { header: 'Company:', text: companyName },
    { header: `${type === 'ship' ? 'Shipping' : 'Billing'} address:`, text: addressText },
    { header: 'Phone:', text: phone },
    { header: 'Attention:', text: attentionLine },
  ]
}

// This is a helper function for formatting an address object into an array of strings
function formatAddress({ address1, address2, address3, city, state, zipCode, country }) {
  const result = []
  if(address1) result.push(address1)
  if(address2) result.push(address2)
  if(address3) result.push(address3)
  if(city || state || zipCode) {
    result.push(`${city}${city && state && ', '}${state}${state && zipCode && ', '}${zipCode}`)
  }
  if(country) result.push(country)
  return result.length > 0 ? result : undefined
}
