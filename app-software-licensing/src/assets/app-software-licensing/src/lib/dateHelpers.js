import { getCurrentLocale } from '@insight/toolkit-utils/lib/helpers/localeHelpers'

const insightLocale = getCurrentLocale('insight_current_locale','insight_locale')

export function getMonthAndYear(reportingDate){
  const date = new Date(reportingDate.replace(/-/g, '/'))
  const locale = insightLocale.replace('_','-')
  const month = date.toLocaleDateString(locale, { month: 'long' })
  const year = date.toLocaleDateString(locale, { year: 'numeric' })
  return `${month}${' '}${year}`
}

export function getReportingMonths(reportingMonths){
  const reportingMonth = reportingMonths.map(reportingDate => {
    const date = new Date(reportingDate.replace(/-/g, '/'))
    const locale = insightLocale.replace('_','-')
    const month = date.toLocaleDateString(locale, { month: 'long' })
    return month
  })
  return reportingMonth.join(', ')
}

export function getAnniversaryMonth(anniversaryDate){
  const date = new Date(anniversaryDate)
  const locale = insightLocale.replace('_','-')
  const month = date.toLocaleDateString(locale, { month: 'long' })  
  return `${month}`
}