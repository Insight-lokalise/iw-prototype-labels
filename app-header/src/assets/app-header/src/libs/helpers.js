import {
  getPersistCheckoutFromStorage,
  hasStorage,
  setPersistCheckoutFromStorage
} from "@insight/toolkit-utils/lib/helpers/storageHelpers";
import { getShoppingRequestEnabledFlag } from '@insight/toolkit-utils/lib/helpers/getShoppingRequestEnabledFlag'
import {saveUserInfoToShoppingRequest} from "../api/us/saveUserInfoToShoppingRequest";

import isCheckoutFlow, {isCartPage} from "../api/common/isCheckoutFlow";
import { getVcInfo } from "../api/us/getVcInfo";
import { prepareUIShoppingCart } from "../api/us/prepareUIShoppingCart";
import { getSoftwarePreferences } from '../api/us/getSoftwarePreferences';
import { postSyncGuestCheckout } from '../api/us/postSyncGuestCheckout';
import { getRegion } from '@insight/toolkit-utils';
import { INSIGHT_CURRENT_LOCALE_COOKIE_NAME, REGION_CODE } from "../api/common/locales";

export async function updateShoppingRequestWithUser(headerInfo) {
  const isCheckoutRoute = isCheckoutFlow()
  const {userInformation, locale, isLoggedIn } = headerInfo
  const webGroupNumber = userInformation?.webGroup?.id
  const isShoppingReqWGEnabled = window?.flags['GNA-11686-CES-SHOPPING-CART'].indexOf(webGroupNumber) !== -1
  const isLoggedOutDefault = window?.flags['GNA-10394-SHOPPING-CART'] && !isLoggedIn && locale.split("_")[1] === 'US'
  const isShoppingCartEnabled = getShoppingRequestEnabledFlag(locale, isLoggedOutDefault, isShoppingReqWGEnabled)

  if (!isShoppingCartEnabled || isCheckoutRoute) { return false }
  // determine if session webgroup, webloginprofile, soldto, are in sync with shopping request
  const checkoutStorage = getPersistCheckoutFromStorage()
  const { shoppingRequest = null, lineLevelSessionInfos = null } = checkoutStorage
  let id = null
  let loginProfileId = null
  let webGroupId = null
  if (shoppingRequest && Object.keys(shoppingRequest).length > 0) {
    const { soldTo, user } = shoppingRequest
    id = soldTo.id
    loginProfileId = user.loginProfileId
    webGroupId = shoppingRequest.webGroupId
  }
  const {
    webGroup, account, webLoginProfileId, currencyCode,
    isIpsUser, isLoginAs, loginAsemail, loginAsName, rp,
    salesAreaId, firstName, lastName, email, phone
  } = userInformation
  const needToSync = (webGroup.id !== webGroupId) || (account.id !== id) || (loginProfileId !== webLoginProfileId)
  if (needToSync) {
    const payload = {
      currency: currencyCode,
      ips: isIpsUser,
      locale,
      loginAs: isLoginAs,
      loginAsEmail: loginAsemail,
      loginAsName,
      loginId: webLoginProfileId,
      rp,
      salesAreaId,
      soldto: account.id,
      user: {
        email,
        firstName,
        lastName,
        phone,
      },
      webGroupId: webGroup.id,
    }
    try {
      const vcInfo = await getVcInfo()
      let request = {
        ...payload,
        ...vcInfo,
        shoppingRequest,
      }
      if (lineLevelSessionInfos) {
        request = { ...request, lineLevelSessionInfos }
      }
      const { data } = await saveUserInfoToShoppingRequest(request)
      if (data) {
        // store it into localstorage
        let nextState = {
          ...checkoutStorage,
          shoppingRequest: JSON.stringify(data.shoppingRequest),
          lineLevelSessionInfos: JSON.stringify(data.lineLevelSessionInfos)
        }
        if (data.lineLevelSessionInfos) {
          nextState = {
            ...nextState,
            lineLevelSessionInfos: JSON.stringify(data.lineLevelSessionInfos)
          }
        }
        setPersistCheckoutFromStorage('persist:checkout', JSON.stringify(nextState))
        window.postMessage({ type: 'cart:updated' }, window.location.origin);
      }
    } catch (error) {
      console.warn("Failed to sync shopping request with user session", error)
    }
  }
}

export async function syncShoppingRequest(headerInfo) {
  const isCheckoutRoute = isCheckoutFlow()
  const isCartPageRoute = isCartPage()
  const { locale, isLoggedIn, userInformation } = headerInfo
  const cartInSession = window.localStorage.getItem("cartInSession")
  const webGroupNumber = userInformation?.webGroup?.id
  const isShoppingReqWGEnabled = window?.flags['GNA-11686-CES-SHOPPING-CART'].indexOf(webGroupNumber) !== -1
  const isLoggedOutDefault = window?.flags['GNA-10394-SHOPPING-CART'] && !isLoggedIn && locale.split("_")[1] === 'US'
  const isShoppingCartEnabled = getShoppingRequestEnabledFlag(locale, isLoggedOutDefault, isShoppingReqWGEnabled)
  if(isShoppingCartEnabled && (isCheckoutRoute || isCartPageRoute)) { return false }
  if(cartInSession) {

  //const isShoppingCartEnabled = window?.flags['GNA-10394-SHOPPING-CART'] && !isLoggedIn && locale === 'en_US';

    const { shoppingRequest, lineLevelSessionInfos, invalidMaterials } = await prepareUIShoppingCart()
    const checkoutStorage = getPersistCheckoutFromStorage()
    setPersistCheckoutFromStorage('persist:checkout', JSON.stringify({
      ...checkoutStorage,
      shoppingRequest: shoppingRequest === null ? {} : JSON.stringify(shoppingRequest),
      lineLevelSessionInfos: JSON.stringify(lineLevelSessionInfos),
      invalidMaterials: JSON.stringify(invalidMaterials)
    }))
    window.postMessage({ type: 'cart:updated' }, window.location.origin);
    window.localStorage.removeItem("cartInSession")
    // when user is at this state, user info is already in session so need to invoke updateShoppingRequestWithUser
  }
  return true
  // what if user is already using CTA "add to cart" race condition ??
}

const getClientBrowserDate = () => {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset();
  return new Date(today.getTime() - (timezoneOffset * 60 * 1000)).toLocaleDateString();
}

export function syncShoppingRequestFromGuest(headerInfo) {
  const {userInformation, locale, isLoggedIn } = headerInfo
  const webGroupNumber = userInformation?.webGroup?.id
  const isShoppingReqWGEnabled = window?.flags['GNA-11686-CES-SHOPPING-CART'].indexOf(webGroupNumber) !== -1
  const isLoggedOutDefault = window?.flags['GNA-10394-SHOPPING-CART'] && !isLoggedIn && locale.split("_")[1] === 'US'
  const isShoppingCartEnabled = getShoppingRequestEnabledFlag(locale, isLoggedOutDefault, isShoppingReqWGEnabled)
  return new Promise(async (resolve, reject) => {
    try {
      if (window.flags && window.flags['GNA-11259-CART-TO-VIEWCART']) {
        const guestCheckoutSyncStatus = localStorage.getItem('persist:guest:checkout:status');
        if (guestCheckoutSyncStatus) {
          const { displayEnableAbandonedCarts } = await getSoftwarePreferences();
          const ShoppingRequestFromStorageObj = getPersistCheckoutFromStorage();
          const shoppingRequestObj = (hasStorage('persist:checkout') && ShoppingRequestFromStorageObj?.shoppingRequest ? ShoppingRequestFromStorageObj?.shoppingRequest : null)
          const lineLevelSessionInfosObj = (hasStorage('persist:checkout') && ShoppingRequestFromStorageObj?.lineLevelSessionInfos ? ShoppingRequestFromStorageObj?.lineLevelSessionInfos : [])
          if (displayEnableAbandonedCarts && shoppingRequestObj && !isShoppingCartEnabled) {
            // no need to sync when shopping request is null
            postSyncGuestCheckout({
              shoppingRequest: shoppingRequestObj,
              lineLevelSessionInfos: lineLevelSessionInfosObj,
              clientBrowserDate: getClientBrowserDate()
            }).then(() => {
              localStorage.removeItem('persist:guest:checkout:status');
              resolve();
            })
          } else {
            resolve();
          }
        } else {
          resolve();
        }
      } else {
        resolve();
      }
    } catch (e) {
      console.log(e);
      reject()
    }
  });

}
export const isEmeaRegion = () => {
  const region = getRegion(INSIGHT_CURRENT_LOCALE_COOKIE_NAME);
  return region === REGION_CODE.EMEA;
}
