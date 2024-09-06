import React from 'react'
import ReactDOM from 'react-dom'
import detectPointer from '@insight/toolkit-utils/lib/events/detectPointer'
import { getEnvironmentName } from '@insight/toolkit-utils/lib/helpers/getEnvironmentName'

import App from './components/App'
import createModuleRegistry from './module-registry'
import { fetchGigyaApiKey, fetchHeaderInformation } from './api/us/gigyawebsdk'
import { getCookieByName, GIGYA_KEYS, logGigyaData } from './utils'
import { initLogRocket, initLaunchdarklyClient } from 'api'

const { registerModule, triggerExternalAction } = createModuleRegistry()

// Wait until the document has been fully parsed before rendering the app
document.addEventListener('DOMContentLoaded', () => {
  // append an empty div to the body to render into
  const element = document.createElement('div')
  document.body.appendChild(element)

  /* Loading gigya web sdk script in every page */
  if (window.flags && window.flags['GNA-9531-Load-Gigya-WebSdk-Auth']) {
    // Storing GAC for Logging API
    if (!isGLTCookieAvailable()) {
      localStorage.setItem(GIGYA_KEYS.GAC, getCookieByName(GIGYA_KEYS.GAC))
    }
    loadGigyaWebSDK()
  }
  // render app into the dom
  ReactDOM.render(<App />, element)

  // Detect whether the user is using a pointer device (mouse or touch) and set
  // an 'is-using-pointer' class on the body as appropriate
  detectPointer()
  // init logrocket session recording
  if (window.getPrivacySettings) {
    if (getPrivacySettings().performance) {
      initLogRocket()
    }
  } else {
    console.warn('getPrivacySettings should be defined - initializing LR.')
    initLogRocket()
  }
})

initLaunchdarklyClient()
  .then((client) => {
    // This code can be removed after fusion, as of now it is interferring with the current EMEA site.
    if (client === undefined || client === null) {
      window.flags = {}
    } else {
      client.on('ready', () => {
        window.flags = client.allFlags()
        // pre-prod validation enablement
        if (
          getEnvironmentName(window.location.origin) === 'pre' &&
          window.flags['GNA-9004-CS-PRE']
        ) {
          window.flags['GNA-9004-CS'] = true
        }
      })
    }
  })
  .catch(() => {
    window.flags = {}
  })

const isGLTCookieAvailable = () => {
  let availability = false
  const cookieValue = document.cookie
  const cookieValueItems = cookieValue.split(';')
  cookieValueItems.map((item) => {
    if (item.includes('glt_')) {
      availability = true
    }
  })
  return availability
}

const onGigyaWebSDKLoad = () => {
  if (!isGLTCookieAvailable()) {
    gigya.accounts.getAccountInfo({
      callback: (response) => {
        const { UID = '' } = response || {}
        localStorage.setItem(GIGYA_KEYS.UID, UID)
        if (response && response.errorCode === 0) {
          logGigyaData()
        }
      },
    })
  } else {
    const dataLogged = localStorage.getItem(GIGYA_KEYS.LOG_DATA)
    if (!dataLogged) {
      logGigyaData()
    }
  }
}

const loadGigyaWebSDK = async () => {
  const gigyaWebSDK = '//cdns.eu1.gigya.com/js/gigya.js?apikey='
  const apiKey = await getApiKey()
  const script = document.createElement('script')
  script.onload = onGigyaWebSDKLoad
  script.src = gigyaWebSDK + apiKey
  script.async = true
  document.head.appendChild(script)
}

const getApiKey = async () => {
  const apiKeyEndPoint = '/insightweb/gigyaAPIKey'
  const responseData = await fetchGigyaApiKey(apiKeyEndPoint)
  const { data } = responseData
  return data
}

window.handleServiceNowSSO = () => {
  fetchHeaderInformation().then(({ data }) => {
    const {
      userInformation: {
        serviceNowInfo: { redirectURL, spName },
      },
    } = data
    gigya.fidm.saml.initSSO({
      spName,
      redirectURL,
    })
  })
}

// Export provided dependencies and shared-functions.
export default {
  React,
  ReactDOM,
  registerModule,
  triggerExternalAction,
}
