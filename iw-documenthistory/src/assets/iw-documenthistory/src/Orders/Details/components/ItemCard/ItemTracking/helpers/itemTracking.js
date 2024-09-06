import React from 'react'
import { l } from '@insight/toolkit-utils/lib/labels'
import groupBy from 'lodash/groupBy'
import { IWAnchor } from '../../../../../../libs/iw-components'
import { POD_LINK } from '../../../../constants/Constants'

// Add description to Asset/Serial numbers.
function injectProps(bundleItem) {
  // Properties to be injected, from materialInfo.
  const { description, materialId } = bundleItem.materialInfo
  const lineItemTrackingInfo = bundleItem.lineItemTrackingInfo.filter(hasAssetSerial).map(trackingNumberInfo => {
    const serialAssetWithDescription = trackingNumberInfo.serialNumberAssetTagList.map(serialAssetNumber => ({
      ...serialAssetNumber,
      description,
      materialId,
    }))
    return { ...trackingNumberInfo, serialNumberAssetTagList: serialAssetWithDescription }
  })
  return { ...bundleItem, lineItemTrackingInfo }
}

function hasAssetSerial(trackingItem) {
  return (
    //for EMEA, lineItemTrackingInfo is considered valid if consignmentNo is not empty, otherwise check for serialNumberAssetTagList
    trackingItem.consignmentNo || trackingItem.serialNumberAssetTagList &&
    trackingItem.serialNumberAssetTagList.some(serialAsset => serialAsset.serialNumber || serialAsset.assetTag)
  )
}

function hasTrackingInfo(bundleItem) {
  const trackingNumbersInfoList = bundleItem.lineItemTrackingInfo || []
  return trackingNumbersInfoList.length > 0
}

function isShippable(bundleItem) {
  return !bundleItem.materialInfo.nonShipabble
}

export function getFormattedDate(date) {
  if (!date) return ''
  const locale = l().replace('_', '-')
  const month = date.toLocaleString(locale, { month: 'short' })
  const day = date.toLocaleString(locale, { day: '2-digit' })
  const year = date.toLocaleString(locale, { year: 'numeric' })
  return `${day}-${month}-${year}`
}

export function getFormattedUTCDate(date) {
  if (!date) return ''
  const locale = l().replace('_', '-')
  const month = date.toLocaleString(locale, { month: 'short', timeZone: 'UTC' })
  const day = date.toLocaleString(locale, { day: '2-digit', timeZone: 'UTC' })
  const year = date.toLocaleString(locale, { year: 'numeric', timeZone: 'UTC' })
  return `${day}-${month}-${year}`
}

export function getFormattedUTCTime(date) {
  if (!date) return ''
  const locale = l().replace('_', '-')
  return date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })
}

export function getBundleTrackingInfo(bundle) {
  const bundleItemsWithTracking = bundle.data.filter(hasTrackingInfo)
  // Adds item's materialId and description to it's respective Asset/SerialNumbers objects.
  const bundleWithTrackingAndProps = bundleItemsWithTracking.map(injectProps)
  // Get all existent Tracking Number objects in the bundle.
  const bundlesLineItemTrackingInfo = bundleWithTrackingAndProps.reduce(
    (acc, bundleItem) => [...acc, ...bundleItem.lineItemTrackingInfo],
    []
  )
  const hasShippableItems = bundle.data.some(isShippable)

  // Group tracking information by tracking Number
  const byTrackingNumberList = Object.values(groupBy(bundlesLineItemTrackingInfo, 'trackingNumber'))

  const uniqueLineItemTrackingInfo = byTrackingNumberList.map(trackingNumberItems => {
    const trackingItemsWithSerialOrAsset = trackingNumberItems.filter(hasAssetSerial)
    // Get all Serial/AssetTag numbers that belong to a Tracking Number.
    const serialAssetList = trackingItemsWithSerialOrAsset.reduce(
      (acc, trackingItem) => [...acc, ...trackingItem.serialNumberAssetTagList],
      []
    )
    return { ...trackingNumberItems[0], serialNumberAssetTagList: serialAssetList }
  })

  return {
    ...bundle.data[0],
    lineItemTrackingInfo: uniqueLineItemTrackingInfo,
    nonShipabble: !hasShippableItems,
  }
}

export function renderPODLink(linkText, orderNumber, sapLineItemNumber) {
  return (
    <IWAnchor className="orders__link" target="_blank" href={POD_LINK + orderNumber + '/' + sapLineItemNumber}>
      <span className="orders__link-text">{linkText}</span>
    </IWAnchor>
  )
}
