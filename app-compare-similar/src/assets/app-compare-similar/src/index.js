import React from 'react'
import { render } from 'react-dom'
import { Locale } from '@insight/toolkit-react'
import Routes from './routes'
import './scss/index.scss'
import { getSessionUser } from './api/getSessionUser'
import { getFeatureFlags } from './api/getFeatureFlags'
import { flatPermissions } from '../lib/flatPermission'
import setToolkitLabels from '@insight/toolkit-react/lib/utils/setToolkitLabels';
import { getCurrentLocale, getDefaultLoggedOutSalesOrg, fetchLabels } from '@insight/toolkit-utils';
import { getCookie, hasCookie } from '@insight/toolkit-utils/lib/helpers/cookieHelpers'
import {IPS_CONTRACT_ID_COOKIE_NAME, IPS_CONTRACT_NAME_COOKIE_NAME} from './constants'

const locale = getCurrentLocale('insight_current_locale')

fetchLabels({ labelFileName: 'app-compare-similar', app: 'app-compare-similar', locale }).then((labels) => {
  setToolkitLabels(labels);
  getFeatureFlags().then(()=>renderApp(Routes))
})

function renderApp() {
  const root = document.getElementById('react-app-compare-similar')
  getSessionUser().then(({ isLoggedIn, userInformation, isIpsLogo, sessionId }) => {
    const permissions = flatPermissions(isLoggedIn ? userInformation?.permissions : null)
    const isIPSUser = (isLoggedIn && userInformation?.isIpsUser) || isIpsLogo
    const salesOrg = (isLoggedIn && userInformation?.salesOrg) || getDefaultLoggedOutSalesOrg(locale, isIPSUser)
    const loginContract = isIPSUser && isLoggedIn ? userInformation?.contract : null
    // Logout contract details
    const ipsContractID = hasCookie(IPS_CONTRACT_ID_COOKIE_NAME) ? getCookie(IPS_CONTRACT_ID_COOKIE_NAME): null
    const ipsContractName = hasCookie(IPS_CONTRACT_NAME_COOKIE_NAME) ? getCookie(IPS_CONTRACT_NAME_COOKIE_NAME): null
    const logoutContract =  isIPSUser && ipsContractID && !isLoggedIn ? {
      name: ipsContractName,
      contractType: decodeURIComponent(decodeURIComponent(ipsContractID)),
      contractId: decodeURIComponent(decodeURIComponent(ipsContractID))
    } : null

    const contract = isIPSUser ? (loginContract || logoutContract) : null

    render(
      <Locale value={{ locale, isLoggedIn, userInformation, permissions, isIPSUser, contract, sessionId, salesOrg }}>
        <Routes />
      </Locale>,
      root
    )
  })
}

if (module.hot) {
  module.hot.accept('./routes', renderApp)
}
