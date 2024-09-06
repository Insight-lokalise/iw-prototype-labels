import {
  fetchGigyaApiKey,
  fetchHeaderInformation,
  onAuthentication,
  gigyaDataLogging,
} from './api';
import { getCookieByName } from './utils';

const GIGYA_KEYS = {
  GAC: 'gac_',
  GLT: 'glt_',
  LOG_DATA: 'gigyaDataLogged',
  LOG_TYPE: 'gigya',
}

export class InsightGigyaSSO {

  apiKeyEndPoint = null
  apiKey = null
  authURI = null
  gigyaWebSDK = '//cdns.eu1.gigya.com/js/gigya.js?apikey='
  /*
  * expectation: targetDomain is present in query parameter
  * */
  targetDomain = null
  onAuthFailureURI = null
  redirectTo = null
  locale = null
  loginAs = false
  repId = null
  requestInitiatedFrom = null
  cdmUid = null //UID from Insight userInformation object
  UID = null //UID from Jump redirect

  constructor({apiKeyEndPoint, authURI, onAuthFailureURI}) {
    this.authURI = authURI;
    this.apiKeyEndPoint = apiKeyEndPoint;
    this.onAuthFailureURI = onAuthFailureURI
    this.init()
  }

  init = async () => {
    await this.setApiKey()
    this.setTargetDomain()
    this.setRedirectTo()
    this.setLoginAs()
    this.setRepId()
    this.setLocale()
    this.setRequestInitiatedFrom()
    this.setCdmUid()
    this.setUID()
    if(this.getGigyaWebSDKLDFlagFromParam()) {
      this.setGACCookie();
    }
    this.loadGigyaWebSDK()
  }


  loadGigyaWebSDK = () => {
    const script = document.createElement('script');
    script.onload = this.onGigyaWebSDKLoad
    script.src = this.gigyaWebSDK + this.apiKey
    script.async = true
    document.head.appendChild(script);
  }

  onGigyaWebSDKLoad = (event) => {

  }

  setCdmUid = async () => {
    const cdmUid = this.getUrlParams('cdmUid')
    if(!cdmUid) return
    this.cdmUid = cdmUid
  }

  setUID = async () => {
    const UID = this.getUrlParams('UID')
    if(!UID) return
    this.UID = UID
  }

  setGACCookie = () => {
    const gacCookie = getCookieByName(GIGYA_KEYS.GAC);
    if(!gacCookie) return
    this.gacCookie = gacCookie;
  }

  getRedirectUrl = () => this.getUrlParams('redirectUrl');

  getGigyaWebSDKLDFlagFromParam = () => this.getUrlParams('ldFlag') === 'true';

  setApiKey = async () => {
    const {data: apiKey} = await fetchGigyaApiKey(this.apiKeyEndPoint)
    this.apiKey = apiKey
  }

  setTargetDomain = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const targetDomainFromQuery = urlParams.get('targetDomain')
    if(!targetDomainFromQuery) return
    // when target domain is in URL, this is outgoing
    this.requestInitiatedFrom = window.location.origin
    const targetDomain = new URL(this.getAppropriateProtocol(targetDomainFromQuery))
    const params = new URLSearchParams(targetDomain.search);
    urlParams.forEach((value, key) => {
      if(key !== 'targetDomain') {
        params.append(key, value)
      }
    })
    params.append("requestInitiatedFrom", this.requestInitiatedFrom)
    this.targetDomain = params ?
      `${targetDomain.origin}${targetDomain.pathname}?${params}`
      : `${targetDomain.origin}${targetDomain.pathname}`
  }

  setRequestInitiatedFrom = () => {
    const requestInitiatedFrom = this.getUrlParams('requestInitiatedFrom')
    if(!requestInitiatedFrom) return
    this.requestInitiatedFrom = requestInitiatedFrom
  }

  setLoginAs = () => {
    const loginAs = this.getUrlParams('loginAs')
    if(!loginAs) return
    this.loginAs = loginAs
  }

  setRepId = () => {
    const repId = this.getUrlParams('repId')
    if(!repId) return
    this.repId = repId
  }

  setRedirectTo = () => {
    const encodedRedirectURLFromQuery = this.getUrlParams('redirectTo')
    if(!encodedRedirectURLFromQuery) return
    this.redirectTo = decodeURIComponent(encodedRedirectURLFromQuery)
  }

  setLocale = () => {
    const locale = this.getUrlParams('targetLocale')
    if(!locale) return
    this.locale = locale
  }

  getUrlParams = (key) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(key)
  }

  getAppropriateProtocol = (url) => url.startsWith("http")? url : `${window.location.protocol}//${url}`

  getAppropriateHost = (url) => url.startsWith("http")? url : `${window.location.origin}/insightweb${url}`

  onLoginHandler = (response) => {
    const {errorCode, errorMessage, operation, UID, UIDSignature, signatureTimestamp } = response
    if (errorCode == 0) {
      if(this.getGigyaWebSDKLDFlagFromParam()) {
        this.handleOnAuth({
          UID,
          UIDSignature,
          signatureTimestamp,
          redirectTo: this.redirectTo,
          locale: this.locale,
          loginas: this.loginAs,
          repId: this.repId,
          requestInitiatedFrom: this.requestInitiatedFrom,
        })
      } else {
        this.isOutGoing()? this.handleJump(UID): this.handleOnAuth({
          UID,
          UIDSignature,
          signatureTimestamp,
          redirectTo: this.redirectTo,
          locale: this.locale,
          loginas: this.loginAs,
          repId: this.repId,
          requestInitiatedFrom: this.requestInitiatedFrom,
        });
      }
    }  else {
      // handle errors -> navigate to home page
      console.log(`${"An error has occurred!" + '\n' +
        "details: "}${  errorMessage  }\n` +
        `In method: ${  operation}`)
      const destination =  this.isOutGoing() ? new URL(this.targetDomain).hostname : (this.onAuthFailureURI || document.location.hostname)
      // redirect and don't log the redirect page in the history
      window.location.replace(this.getAppropriateProtocol(destination))
    }
  }

  isOutGoing = () => !!this.targetDomain

  handleJump = async (UID) => {
    //compare userInformation cdmUiD with SDK UID if cdmUid is in the url params
    if(this.cdmUid && this.cdmUid != UID) {
      console.log(`cdmUid ${this.cdmUid} does not match UID ${UID}`)
      //logout when UIDs don't match
      this.handleLogout(UID)
    }
    else {
      if(this.getGigyaWebSDKLDFlagFromParam()) {
        await this.logData({ UID });
      }
      //pass UID from SDK as part of redirect url
      const targetUrl = this.targetDomain.indexOf('?') > -1 ? `${this.targetDomain}&UID=${UID}` : `${this.targetDomain}?UID=${UID}`
      // redirect and don't log the redirect page in the history
      window.location.replace(this.getAppropriateProtocol(targetUrl))
    }
  }

  handleOnAuth = async (payload) => {
    //compare UID from redirect with SDK UID if UID is in the url params
    if(this.UID && this.UID != payload.UID) {
      //logout when UIDs don't match
      console.log(`Redirect UID ${this.UID} does not match UID ${payload.UID}`)
      this.handleLogout(payload.UID)
    }
    else {
      if(this.getGigyaWebSDKLDFlagFromParam()) {
        await this.logData({ UID: payload.UID });
      }
      await onAuthentication(this.authURI, payload)
    }
  }

  handleServiceNowSSO = () => {
    fetchHeaderInformation().then(({data})=>{
      const {userInformation: {serviceNowInfo: { redirectURL, spName}}} = data
      gigya.fidm.saml.initSSO({
        spName,
        redirectURL
      })
    })

  }

  handleLogout = (UID) => {
    window.location.replace(this.getAppropriateProtocol(`${document.location.hostname}/insightweb/logout?UID=${UID}`));
  }

  // Log Gigya Data
  logData = async (params = {}) => {
    try {
      const { UID = '' } = params;
      const data = {
        type: GIGYA_KEYS.LOG_TYPE,
        data: {
          gac: this.gacCookie || '',
          glt: getCookieByName(GIGYA_KEYS.GLT) || '',
          cdmUid: this.cdmUid,
          cdmUidWebSdk: UID,
          timestamp: new Date().toUTCString(),
        },
      }

      await gigyaDataLogging({ data, onSuccess: () => { localStorage.setItem(GIGYA_KEYS.LOG_DATA, true); } });
    } catch (error) {
      console.error('Error invoking Gigya Logging API: ', error)
    }
  }
}
