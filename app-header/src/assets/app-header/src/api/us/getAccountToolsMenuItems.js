import axios from 'axios'

let cachedResponse

export default function getAccounts() {
  const isCiamEnabled =
    window.flags && window.flags['GNA-12439-CIAM-MIGRATION-PING-ONE-IDENTITY']
  const isReportingManagementEnabled =
    window.flags && window.flags['GNA-13914-REPORTING-MANAGEMENT'];

  if (!cachedResponse) {
    cachedResponse = axios.get('/insightweb/getAccountToolsMenuDetails')
  }

  return cachedResponse
    .catch((error) => {
      console.warn('Failed to get account tools menu data', error)
      throw error
    })
    .then((response) => {
      const {
        dashboard,
        ordersObj,
        supportObj,
        toolsObj,
        reportsObj,
        personalObj,
        adminObj,
      } = response.data

      const items = []
      const websiteUrls = {
        cloud: isCiamEnabled
          ? toolsObj.manageCloudNavURL
          : 'javascript:InsightNavigation.attachCloudLink()',
        eld: isCiamEnabled
          ? toolsObj.licenseAdvisorNavURL
          : '/insightweb/sso/jump?target=NA-ELD',
        eld_EMEA: isCiamEnabled
          ? toolsObj.emeaLicenseAdvisorNavURL
          : '/insightweb/sso/jump?target=EMEA-ELD',
        renewalManager: isCiamEnabled
          ? toolsObj.renewalsNavURL
          : '/insightweb/sso/jump?target=NA-RWM',
      }

      // Add 'my company' and dashboard menu items.
      if (!!response?.data?.welcome) {
        addItem(items, 'My Company', '/insightweb/welcome')
      }
      addItem(items, 'Dashboard', '/insightweb/dashboard', () => dashboard)

      // Build out the 'orders' menu.
      const ordersItems = addItem(
        items,
        'Orders',
        null,
        () => Object.keys(ordersObj).length
      )
      const newRequestUrl = `/insightweb/newRequest?client=${ordersObj.newRequest}`
      addItem(
        ordersItems,
        'Quote History',
        '/insightweb/quoteHistory',
        () => ordersObj.quoteHistory
      )
      addItem(
        ordersItems,
        'Requisition History',
        '/insightweb/ar/reqHistory',
        () => ordersObj.requisitionHistory
      )
      addItem(
        ordersItems,
        'Create New Request',
        newRequestUrl,
        () => ordersObj.newRequest
      )
      addItem(
        ordersItems,
        'Order Tracking / History',
        '/insightweb/orderHistory',
        () => ordersObj.orderTracking
      )
      addItem(
        ordersItems,
        'Invoice History',
        '/insightweb/invoiceHistory',
        () => ordersObj.invoiceHistory
      )

      // Build out the 'tools' menu.
      const toolsItems = addItem(
        items,
        'Tools',
        null,
        () => Object.keys(toolsObj).length
      )
      // eslint-disable-next-line no-script-url
      addItem(
        toolsItems,
        'Cloud Management Dashboard',
        websiteUrls.cloud,
        () => toolsObj.manageCloud
      )
      addItem(
        toolsItems,
        toolsObj.myStandards,
        '/insightweb/search#demoCompanyStandards',
        () => toolsObj.myStandards
      )
      addItem(
        toolsItems,
        toolsObj.myStandardsNew,
        '/insightweb/companyStandards',
        () => toolsObj.myStandardsNew
      )
      addItem(
        toolsItems,
        'Company Standards',
        '/insightweb/search#demoCompanyStandards',
        () => toolsObj.demoStandards
      )
      addItem(
        toolsItems,
        'Company Standards',
        '/insightweb/companyStandards',
        () => toolsObj.demoStandardsNew
      )
      addItem(
        toolsItems,
        'Enterprise License Dashboard',
        websiteUrls.eld,
        () => toolsObj.licenseAdvisor
      )
      addItem(
        toolsItems,
        'Enterprise License Dashboard',
        websiteUrls.eld_EMEA,
        () => toolsObj.emeaLicenseAdvisor
      )
      addItem(
        toolsItems,
        'Enterprise License Manager',
        '/insightweb/sso/jump?target=NA-ELM',
        () => toolsObj.licenseManager
      )
      addItem(
        toolsItems,
        'Renewals & Warranty Manager',
        websiteUrls.renewalManager,
        () => toolsObj.renewalManager
      )
      addItem(
        toolsItems,
        'Software License Agreements',
        '/insightweb/softwareLicensing',
        () => toolsObj.softwareContracts
      )
      addItem(
        toolsItems,
        'Saved Comparison Lists',
        '/insightweb/savedCompareList',
        () => toolsObj.productCompare
      )
      addItem(
        toolsItems,
        'Saved Carts / Order Templates',
        '/insightweb/manageCart',
        () => toolsObj.savedCarts
      )

      // Build out the 'reports' menu.
      if (isReportingManagementEnabled) {
        const reportsItems = addItem(
          items,
          'Reports',
          null,
          () => Object.keys(reportsObj).length
        )
        addItem(
          reportsItems,
          'Reporting Management',
          '/insightweb/reportingManagement',
          () => reportsObj.reports
        )
        addItem(
          reportsItems,
          'Business Review',
          '/insightweb/businessReview',
          () => reportsObj.businessReview
        )
      } else {
        const reportsItems = addItem(
          items,
          'Reports',
          null,
          () => Object.keys(reportsObj).length
        )
        addItem(
          reportsItems,
          'Reporting Management',
          '/insightweb/reportingManagement',
          () => reportsObj.reports
        )
        addItem(
          reportsItems,
          'Inventory Reports',
          '/insightweb/reportingLists#inventory',
          () => reportsObj.inventoryReports
        )
        addItem(
          reportsItems,
          'Software Summary Reports',
          '/insightweb/reportingLists#software',
          () => reportsObj.softwareReports
        )
        addItem(
          reportsItems,
          'Standard Reports',
          '/insightweb/reportingLists#standard',
          () => reportsObj.standardReports
        )
        addItem(
          reportsItems,
          'Business Review',
          '/insightweb/businessReview',
          () => reportsObj.businessReview
        )
      }

      // Build out the 'personalization' menu.
      const personalItems = addItem(
        items,
        'Personalization',
        null,
        () => Object.keys(personalObj).length
      )
      addItem(
        personalItems,
        'Personal Product List',
        '/insightweb/search/personalProducts',
        () => personalObj.personalProductList
      )
      addItem(
        personalItems,
        'User Subscriptions',
        'https://pages.insight.com/insight-subscription-center.html',
        () => personalObj.userSubscriptions
      )
      addItem(
        personalItems,
        'User Profile',
        '/insightweb/userProfile#profileInfo',
        () => personalObj.userProfile || personalObj.userPreferences
      )

      // Build out the 'administration' menu.
      const adminItems = addItem(
        items,
        'Administration',
        null,
        () => Object.keys(adminObj).length
      )
      addItem(
        adminItems,
        'Approval Management',
        '/insightweb/ar/approvalpath',
        () => adminObj.approvalManagement
      )
      addItem(
        adminItems,
        'Manage Standards',
        '/insightweb/search#manageStandards',
        () => adminObj.manageStandards
      )
      addItem(
        adminItems,
        'Manage Standards',
        '/insightweb/standards-manager',
        () => adminObj.manageStandardsNew
      )
      addItem(
        adminItems,
        'S.T.A.R.S.',
        '/insightweb/stars',
        () => adminObj.stars
      )
      addItem(
        adminItems,
        'User Management',
        '/insightweb/userManagement',
        () => adminObj.userManagement
      )
      addItem(
        adminItems,
        'Roles',
        '/insightweb/rolesAndPermissions',
        () => adminObj.roles
      )

      // Build out the 'support' menu.
      const supportItems = addItem(
        items,
        'Support',
        null,
        () => Object.keys(supportObj).length
      )
      addItem(
        supportItems,
        'Account Team',
        '/insightweb/salesRep',
        () => supportObj.accountTeam
      )
      addItem(
        supportItems,
        'Customer Documents',
        '/insightweb/accountTools#customerDocs',
        () => supportObj.customerDocs
      )
      addItem(
        supportItems,
        'RMA Request',
        '/en_US/help/return-policy.html',
        () => supportObj.rma
      )

      // utility function to simplify adding items and building menus.
      function addItem(parent, title, url, fn) {
        let result = null

        if (parent && (!fn || fn())) {
          const node = {
            title,
            type: 'link',
            href: url,
            nodes: [],
            id: title,
          }

          parent.push(node)
          result = node.nodes
        }

        return result
      }

      return items
    })
}
