import React from 'react'
import ReactDOM from 'react-dom'

import { Locale } from '@insight/toolkit-react'
import setToolkitLabels from '@insight/toolkit-react/lib/utils/setToolkitLabels'
import { getCurrentLocale } from '@insight/toolkit-utils/lib/helpers'
import { i18n } from '@insight/toolkit-utils/lib/labels'
import './scss/index.scss'
import WrapperComponent from './routes'
import { getAccountInformation, getFeatureFlags, getContractDetils, getTranslations } from './api'
import { INSIGHT_CURRENT_LOCALE_COOKIE_NAME } from './constants'
import { headerInfo } from '../../app-header/src/__tests__/headerInfo'

const parseBoolean = (value) => value === true || value === 'true'
const locale = getCurrentLocale(INSIGHT_CURRENT_LOCALE_COOKIE_NAME)

const placeholder = document.getElementById('react-app-search')
const landingPageInfo = {
  initQuery: placeholder.dataset.initquery,
  isBrandPage: parseBoolean(placeholder.dataset.isbrandpage),
  isLandingPage: placeholder.dataset.islandingpage,
  productSet: placeholder.dataset.productset,
  transformQuery: parseBoolean(placeholder.dataset.transformQuery),
}

function renderApp() {
    Promise.all([
        getAccountInformation(),
        getFeatureFlags(),
    ])
    .then(([headerInfo, featureFlags])=>
        Promise.all([
            getTranslations(headerInfo),
            getContractDetils(headerInfo)
        ])
    )
    .then(([
            {
                cdmUid,
                currencyCode,
                domainUrl,
                isLoggedIn,
                isIPSUser,
                webGroupId,
                salesOrg,
                sessionId,
                isHybridXEnabled,
                permissions,
                webGroupPermissions,
                showProductImages
            } = headerInfo,
            contract
        ]) => {
        //const isMultipleContract = contract && contract?.contractType === "All"
        ReactDOM.render(
            <React.StrictMode>
                <Locale
                    value={{
                        locale,
                        cdmUid,
                        contract,
                        currencyCode,
                        domainUrl,
                        isLoggedIn,
                        isIPSUser,
                        webGroupId,
                        salesOrg,
                        sessionId,
                        isHybridXEnabled,
                        permissions,
                        webGroupPermissions,
                        showProductImages
                    }}
                >
                    <WrapperComponent landingPageInfo={landingPageInfo} />
                </Locale>
            </React.StrictMode>,
            placeholder
        )
    })
}

renderApp()
