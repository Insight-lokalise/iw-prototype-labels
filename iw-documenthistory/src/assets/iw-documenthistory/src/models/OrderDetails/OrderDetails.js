import axios from 'axios'
import { l } from '@insight/toolkit-utils/lib/labels'
import { validateEmail as validateEmailToolkit } from '@insight/toolkit-utils/lib/helpers/validators'
import { getUTCTimeStamp } from '@insight/toolkit-utils'

export function createDuplicateOrder(orderNumber) {
  return axios.post('/insightweb/transaction/loadCartFromOrderHistory', {
    clientBrowserDate: getUTCTimeStamp(),
    orderNumberFromHistoryPage: orderNumber,
    opsCenterFromHistoryPage: 31,
  })
}

export function getOrdersData(detailURL, orderNumber, soldTo) {
  return axios.get(`../../${detailURL}/${orderNumber}/${soldTo}`)
}

export function getTrackingInformation(orderNumber) {
  return axios.get(`../../report/orderTracking/${orderNumber}`)
}

export function addTrackingNotifications(body) {
  return axios.post('../../report/sendTrackingEmail', body)
}

export function validateEmail(email) {
  return validateEmailToolkit(email)
}

/**
 * Validates each email in a comma-separated string of emails
 * @param  {String} emails comma-separated or semi-colon separated list of emails
 * @return {Boolean}        Whether every email in the string is valid.
 */
export function validateEmails(emails) {
  const separator = emails.includes(';') ? ';' : ','
  if (emails) {
    return emails.split(separator).every(email => validateEmail(email))
  }
  return false
}

/**
 * Builds a URL for the product details page of a passed in item. Mostly just
 * concatenates some properties.
 * Based on `CommonUtil.productdetailURLMap`
 * @param  {Object} {
 *         locale
 *         materialId
 *         mfrName
 *         mfrId
 *         description
 * }                                        Required product information to build the URL
 * @return {String}                         A URL to the product details page of the passed in item.
 */

export function makeProductDetailURL({
  locale = l() || 'en_US',
  materialId,
  manufacturerName,
  mfrPartNumber,
  description,
}) {
  const productDescription = description
    .replace(/[\.,-\/#!$%\"\'\^&\*;:{}=\-_`~()]/g, '')
    .trim()
    .replace(/ +(?= )/g, '')
    .replace(/\s/g, '-')

  return `../../${locale}/buy/product/${encodeURIComponent(materialId)}/${encodeURIComponent(
    manufacturerName
  )}/${encodeURIComponent(mfrPartNumber)}/${productDescription}/`
}

export default function getCompleteOrderHistory(filters) {
  return axios.post('orderSearch/history', filters)
}

export function getSortedUrl(consignmentNumber, salesAreaId) {
  return axios.get(`/insightweb/report/sortedWebURL/${consignmentNumber}/${salesAreaId}`)
}