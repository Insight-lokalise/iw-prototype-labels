import { formatDate, formatCurrencyValue, toDate } from 'lib'

export default function formatClientlinkData ({ expectedCloseDate, opptyRevAmt, probabilityOfClosing, quoteNumber }) {
  const timestampDate = toDate(parseInt(expectedCloseDate))
  return {
    'misc-expectedCloseDate': formatDate(timestampDate, 'MM/DD/YYYY'),
    'misc-opptyRevAmt': formatCurrencyValue(opptyRevAmt),
    'misc-probabilityOfClosing': `${probabilityOfClosing.substring(0,2)}%`,
    'dealInfo-quoteNumber': quoteNumber
  }
}
