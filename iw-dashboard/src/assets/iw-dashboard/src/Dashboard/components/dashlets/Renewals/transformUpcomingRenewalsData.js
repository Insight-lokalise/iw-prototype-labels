import React from 'react'
import { t } from '@insight/toolkit-utils/lib/labels'

import generateSubHeader from '../TieredTableSubHeader'
import { fetchRenewalsURL } from '../../../../services'
import { IWAnchor, IWExpandableTableRow } from '../../../../iw-components'

export default function transformTableData(data) {
  const criticalText = 'Your coverage will expire soon. Please contact your account support team.'
  const warningText =
    'Your account support team will be sending out a quote soon. To expedite, please feel free to contact them.'
  const safeText = 'Your coverage will expire in 61-90 days. No actions are required at this time.'
  const criticalSection = [generateSubHeader('critical', criticalText, 'alert'), ...buildSection(data, 0, 31)]
  const warningSection = [generateSubHeader('warning', warningText, 'alert'), ...buildSection(data, 31, 61)]
  const safeSection = [generateSubHeader('safe', safeText, 'alert'), ...buildSection(data, 61)]
  let tableData = []
  if (criticalSection.length > 1) tableData = tableData.concat(criticalSection)
  if (warningSection.length > 1) tableData = tableData.concat(warningSection)
  if (safeSection.length > 1) tableData = tableData.concat(safeSection)
  return tableData
}
function buildSection(data, min, max) {
  const section = data.filter(entry => entry.expiryDays >= min && (!max || entry.expiryDays < max)).sort((a, b) => {
    if (a.expiryDays < b.expiryDays) return -1
    if (a.expiryDays > b.expiryDays) return 1
    return 0
  })
  return section.map(createRow)
}
function createRow({
  clientPo,
  expiryDays,
  manufacturer,
  prevOrderNo,
  renewalEndDate,
  renewalQuoteNo,
  soldTo,
}) {
  const quoteURL = `quoteDetails?quoNum=${renewalQuoteNo}&documentSoltos=${soldTo}`
  const orderURL = `orderDetails/${prevOrderNo}/${soldTo}`
  const quoteAnchor = renewalQuoteNo ? (
    ((typeof renewalQuoteNo === 'number' || (renewalQuoteNo.length > 8 && !(/[^0-9]/.test(renewalQuoteNo)))) && <IWAnchor href={quoteURL}>{renewalQuoteNo}</IWAnchor>) || renewalQuoteNo
  ) : (
    <IWAnchor onClick={() => redirect(manufacturer, prevOrderNo, clientPo, expiryDays)}>{t('Request a Quote')}</IWAnchor>
  )
  return {
    rowComponent: IWExpandableTableRow,
    rowComponentProps: {
      rowData: {
        renewalEndDate,
        manufacturer: <span className="no-wrap">{t(manufacturer)}</span>,
        renewalQuoteNo: quoteAnchor,
        prevOrderNo: <IWAnchor href={orderURL}>{prevOrderNo}</IWAnchor>,
        clientPo,
        expiryDays,
      },
    },
  }
}

// TODO: Verify when API is fully functional
function redirect(manufacturer, prevOrderNo, clientPO, expiryDays) {
  fetchRenewalsURL(manufacturer, prevOrderNo, clientPO, expiryDays).then(response => {
    window.location.assign(response.data)
  })
}
