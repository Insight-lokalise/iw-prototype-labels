import React from 'react'

import { t } from '@insight/toolkit-utils'
import { Button } from '@insight/toolkit-react'

export default function Tools(props) {
  const { account, goToHashLink } = props
  const isCiamEnabled =
    window.flags && window.flags['GNA-12439-CIAM-MIGRATION-PING-ONE-IDENTITY']

  const serviceNowFlag =
    window.flags && window.flags['GNA-9531-Load-Gigya-WebSdk-Auth']
  const toolsObject = [
    {
      title: account?.toolsObj?.manageCloud ? 'cloudManagementDashboard' : ``,
      href: isCiamEnabled
        ? account?.toolsObj?.manageCloudNavURL
        : `/insightweb/jumpToCloudPlatform`,
    },
    {
      title: account?.toolsObj?.myStandards,
      onClick: () => goToHashLink('/insightweb/search#demoCompanyStandards'),
    },
    {
      title:
        account?.toolsObj?.myStandardsNew === 'Company Standards'
          ? 'companyStandards'
          : account?.toolsObj?.myStandardsNew,
      href: `/insightweb/companyStandards`,
    },
    {
      title: account?.toolsObj?.demoStandards ? 'companyStandards' : '',
      href: `/insightweb/search#demoCompanyStandards`,
    },
    {
      title:
        account?.toolsObj?.demoStandardsNew === 'Company Standards'
          ? 'companyStandards'
          : account?.toolsObj?.demoStandardsNew,
      href: `/insightweb/companyStandards`,
    },
    {
      title: account?.toolsObj?.licenseAdvisor
        ? 'Enterprise License Dashboard'
        : ``,
      href: isCiamEnabled
        ? account?.toolsObj?.licenseAdvisorNavURL
        : `/insightweb/sso/jump?target=NA-ELD`,
    },
    {
      title: account?.toolsObj?.emeaLicenseAdvisor
        ? 'Enterprise License Dashboard'
        : ``,
      href: isCiamEnabled
        ? account?.toolsObj?.emeaLicenseAdvisorNavURL
        : `/insightweb/sso/jump?target=EMEA-ELD`,
    },
    {
      title: account?.toolsObj?.licenseManager
        ? 'enterpriseLicenseManager'
        : ``,
      href: `/insightweb/sso/jump?target=NA-ELM`,
    },
    {
      title: account?.toolsObj?.renewalManager
        ? 'Renewals & warranty manager'
        : ``,
      href: isCiamEnabled
        ? account?.toolsObj?.renewalsNavURL
        : `/insightweb/sso/jump?target=NA-RWM`,
    },
    {
      title: account?.toolsObj?.softwareContracts
        ? 'softwareLicensingAgreements'
        : ``,
      href: `/insightweb/softwareLicensing`,
    },
    {
      title: account?.toolsObj?.savedCarts ? 'savedCarts' : ``,
      href: `/insightweb/manageCart`,
    },
    {
      title: account?.toolsObj?.serviceNow ? 'Licensing Desk' : '',
      href: isCiamEnabled
        ? account?.toolsObj?.serviceNowNavURL
        : serviceNowFlag
        ? 'javascript:handleServiceNowSSO()'
        : `/insightweb/sso/serviceNow`,
    },
  ]

  return toolsObject.map((tools) => {
    if (tools?.title) {
      return (
        <li>
          <Button {...tools}>{t(tools?.title)}</Button>
        </li>
      )
    }
  })
}
