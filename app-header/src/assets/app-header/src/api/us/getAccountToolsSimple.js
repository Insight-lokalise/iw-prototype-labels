import { getCurrentLocale } from '@insight/toolkit-utils/lib/helpers/localeHelpers'
import { INSIGHT_LOCALE_COOKIE_NAME } from '../common/locales'

import axios from 'axios'

/**
 * Retrieve account tools menu for CES
 */

const getAccountToolsSimple = async ({
  displayDashboard,
  isCES,
  renewalsWebSite,
  UserType,
  availableSites,
}) => {
  const { data: menuData } = await axios.get(
    '/insightweb/getAccountToolsMenuDetails'
  )
  const {
    data: { cloudConfigured },
  } = await axios.get('/insightweb/is-cloud-configured')

  const isCiamEnabled =
    window.flags && window.flags['GNA-12439-CIAM-MIGRATION-PING-ONE-IDENTITY']

  const getCloudUrl = () => {
    if (!cloudConfigured) return ''
    const CCX = availableSites.find((website) => website.name == 'CCX')
    return CCX?.nav
  }

  const websiteUrls = {
    cloud: isCiamEnabled ? getCloudUrl() : '/insightweb/jumpToCloudPlatform',
    renewalManager: isCiamEnabled
      ? renewalsWebSite?.nav
      : `/insightweb/sso/jump?target=${renewalsWebSite?.name}`,
  }

  const myCompanyItem = [
    {
      title: 'My company',
      href: '/insightweb/welcome',
      icon: 'company',
    },
  ]

  const myDashboardItem = [
    {
      title: 'Dashboard',
      href: '/insightweb/dashboard',
      icon: 'dashboard',
    },
  ]

  const myAccountItem = [
    {
      title: 'Account settings',
      href: '/insightweb/userProfile',
      icon: 'settings-outline',
    },
  ]

  const cloudManagement = [
    {
      title: 'Manage cloud',
      href: websiteUrls.cloud,
      icon: 'cloud',
    },
  ]
  // get default domain locale for AEM urls
  const domainLocale = getCurrentLocale(INSIGHT_LOCALE_COOKIE_NAME)
  const isSimplifiedCESUser = UserType === 'Limited' && isCES

  const isSavedListEnabled = window.flags['CES-1520-saved-lists']

  const orderItem = [
    {
      title: 'Orders',
      href: '/insightweb/orderHistory',
      icon: 'orders',
    },
  ]

  const quoteItem = [
    {
      title: 'Quotes',
      href: '/insightweb/quotes',
      icon: 'quotes',
    },
  ]

  const invoiceItem = [
    {
      title: 'Invoices',
      href: '/insightweb/invoices',
      icon: 'invoice',
    },
  ]

  const contactUsItem = [
    {
      title: 'Contact us',
      href: `/${domainLocale}/about/contact-us.html?refcode=support`,
      icon: 'contact-us',
    },
  ]

  let renewalAndWarrantyItem = []
  if (renewalsWebSite) {
    renewalAndWarrantyItem = [
      {
        title: 'Renewals & Warranty Manager',
        href: websiteUrls.renewalManager,
        icon: 'renewal-warranty',
      },
    ]
  }

  const savedListItem = [
    {
      title: 'Saved lists',
      href: '/insightweb/savedLists',
      icon: 'clipboard-list',
    },
  ]

  /******************************
   * Rearrange person menu link
   * My company
   * Dashboard
   * Orders
   * Quotes
   * Invoices
   * Saved List
   * Manage cloud
   * Renewals & Warranty Manager
   * Account settings
   * Contact us
   * ****************************/
  const accountToolsMenuItems = [
    ...(!!menuData?.welcome ? myCompanyItem : []),
    ...(displayDashboard ? myDashboardItem : []),
    ...orderItem,
    ...(!isSimplifiedCESUser ? quoteItem : []),
    ...invoiceItem,
    ...(isSavedListEnabled ? savedListItem : []),
    ...(cloudConfigured ? cloudManagement : []),
    ...renewalAndWarrantyItem,
    ...(!isSimplifiedCESUser ? myAccountItem : []),
    ...contactUsItem,
  ]

  return accountToolsMenuItems
}

export default getAccountToolsSimple
