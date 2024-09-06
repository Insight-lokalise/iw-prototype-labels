import React from 'react'

import { t } from '@insight/toolkit-utils'
import { Button } from '@insight/toolkit-react'

export default function Reports(props) {
  const { account, goToHashLink } = props
  const isReportingManagementEnabled =
    window && window.flags && window.flags['GNA-13914-REPORTING-MANAGEMENT']

  const reportsObject = [
    {
      title: account?.reportsObj?.reports ? 'reportingManagement' : ``,
      href: `/insightweb/reportingManagement`,
    },
    {
      title: account?.reportsObj?.inventoryReports ? 'inventoryReports' : ``,
      onClick: () => goToHashLink('/insightweb/reportingLists#inventory'),
    },
    {
      title: account?.reportsObj?.softwareReports
        ? 'softwareSummaryReports'
        : ``,
      onClick: () => goToHashLink('/insightweb/reportingLists#software'),
    },
    {
      title: account?.reportsObj?.standardReports ? 'standardReports' : ``,
      onClick: () => goToHashLink('/insightweb/reportingLists#standard'),
    },
    {
      title: account?.reportsObj?.businessReview ? 'businessReview' : ``,
      href: `/insightweb/businessReview`,
    },
    {
      title: account?.reportsObj?.spendingAnalysis
        ? 'softwareSpendAnalysis'
        : ``,
      href: `/insightweb/spendingAnalysis`,
    },
  ]
  const reportsObjectItems = reportsObject.map((reports) => {
    if (reports?.title) {
      return (
        <li>
          <Button {...reports}>{t(reports.title)}</Button>
        </li>
      )
    }
  })

  const reportsObjectVariant = [
    {
      title: account?.reportsObj?.reports ? 'reportingManagement' : ``,
      href: `/insightweb/reportingManagement`,
    },
    {
      title: account?.reportsObj?.businessReview ? 'businessReview' : ``,
      href: `/insightweb/businessReview`,
    },
    {
      title: account?.reportsObj?.spendingAnalysis
        ? 'softwareSpendAnalysis'
        : ``,
      href: `/insightweb/spendingAnalysis`,
    },
  ]
  const reportsVariant = reportsObjectVariant.map((reports) => {
    if (reports?.title) {
      return (
        <li>
          <Button {...reports}>{t(reports.title)}</Button>
        </li>
      )
    }
  })

  return isReportingManagementEnabled ? reportsVariant : reportsObjectItems
}
