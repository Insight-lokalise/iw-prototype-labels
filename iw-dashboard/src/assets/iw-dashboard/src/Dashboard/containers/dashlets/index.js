import approver from './Approver'
import enterpriseAgreementDetails from './EnterpriseAgreementDetails'
import licensePositionByPublisher from './LicensePositionByPublisher'
import news from './InsightNews'
import powerBi from './PowerBI'
import welcome from './Welcome'
import recentInvoices from './RecentInvoices'
import recentOrders from './RecentOrders'
import recentQuotes from './RecentQuotes'
import requestor from './Requestor'
import sbBillingCountry from './SBBillingCountry'
import sbManufacturer from './SBManufacturer'
import sbMonth from './SBMonth'
import sbProductCategory from './SBProductCategory'
import sbRegion from './SBRegion'
import sbShippingCountry from './SBShippingCountry'
import upcomingRenewals from './UpcomingRenewals'

// Every dashlet must export an object with 2 properties: Dashlet and gridProps
// Dashlet (required) is the component itself
// gridProps (optional) is an object that contains any custom props for react-grid-layout's grid
const dashletComponents = {
  approver,
  enterpriseAgreementDetails,
  licensePositionByPublisher,
  news,
  powerBi,
  recentInvoices,
  recentOrders,
  recentQuotes,
  requestor,
  sbBillingCountry,
  sbManufacturer,
  sbMonth,
  sbProductCategory,
  sbRegion,
  sbShippingCountry,
  upcomingRenewals,
  welcome,
}

const defaultDashletGridProps = { h: 2, w: 1, x: 0, y: Infinity, minH: 2, maxH: 2, minW: 1, maxW: 2 }

// Iterates over the gridProps and injects the defaultDashletGridProps
Object.keys(dashletComponents).forEach(dashlet => {
  dashletComponents[dashlet].gridProps = {
    ...defaultDashletGridProps,
    ...dashletComponents[dashlet].gridProps,
  }
})

export default dashletComponents
