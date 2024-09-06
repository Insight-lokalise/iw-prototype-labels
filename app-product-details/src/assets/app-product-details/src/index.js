import React from 'react'
import { render } from 'react-dom'
import { Locale } from '@insight/toolkit-react'
import setToolkitLabels from '@insight/toolkit-react/lib/utils/setToolkitLabels'
import { getCurrentLocale } from '@insight/toolkit-utils/lib/helpers'
import Routes from './routes'
import './scss/index.scss'
import {getFeatureFlags} from './api/getFeatureFlags'
import { getSessionUser } from './api/getSessionUser'
import { flatPermissions, flatWebGroupPermissions } from './lib/flatPermission'
import { getDefaultLoggedOutSalesOrg, fetchLabels } from '@insight/toolkit-utils'
import { getCookie, hasCookie } from '@insight/toolkit-utils/lib/helpers/cookieHelpers'
import {IPS_CONTRACT_NAME_COOKIE_NAME, IPS_CONTRACT_ID_COOKIE_NAME} from './constants'

const locale = getCurrentLocale('insight_current_locale')

fetchLabels({ labelFileName: "app-product-details", app: 'app-product-details', locale }).then((labels) => {
  setToolkitLabels(labels)
  getFeatureFlags().then(()=>renderApp(Routes))
})

function renderApp() {
  const root = document.getElementById('react-app-product-details')
  getSessionUser().then(({ isLoggedIn, userInformation, isIpsLogo }) => {
    const permissions = flatPermissions(isLoggedIn? userInformation?.permissions: null)
    const webGroupPermissions = flatWebGroupPermissions(isLoggedIn? userInformation?.webGroupPermissions: [])
    const isIPSUser = (isLoggedIn && userInformation.isIpsUser) || isIpsLogo
    const salesOrg = (isLoggedIn && userInformation.salesOrg) ||
    getDefaultLoggedOutSalesOrg(locale, isIPSUser)

    const logoutContractName = hasCookie(IPS_CONTRACT_NAME_COOKIE_NAME) ? decodeURIComponent(decodeURIComponent(getCookie(IPS_CONTRACT_NAME_COOKIE_NAME))): null
    const logoutContractId = hasCookie(IPS_CONTRACT_ID_COOKIE_NAME) ? getCookie(IPS_CONTRACT_ID_COOKIE_NAME): null
    const getActiveContract = userInformation?.contract?.name || logoutContractName || null
    const activeContractName = getActiveContract === 'Open market' ? 'openMarket' : getActiveContract || null
    const activeContractId = userInformation?.contract?.contractId || logoutContractId || null
    const contract = (activeContractId || activeContractName) ? {
      contractName: activeContractName,
      contractId: activeContractId
    } : null
    render(
      <Locale value={{ locale, userInformation, permissions, webGroupPermissions, salesOrg, isIPSUser, contract }}>
        <Routes />
      </Locale>,
      root
    )
  })
}

if (module.hot) {
  module.hot.accept('./routes', renderApp)
}
