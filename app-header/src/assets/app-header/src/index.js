import React from "react";
import ReactDOM from "react-dom";
import { getCookie, hasCookie } from '@insight/toolkit-utils/lib/helpers/cookieHelpers'

import {
  fetchSearchSuggestions,
  getCachedAemMenuItems,
  getCachedFilteredItemsMap,
  getHeaderInformation,
  getLoggedInFilterMap,
  getTranslations,
} from "api";
import {getFeatureFlags} from './api/us'
import {IPS_CONTRACT_NAME_COOKIE_NAME, IPS_CONTRACT_ID_COOKIE_NAME} from './api/us/constants'
import "./scss/index.scss";
import IAHeader from "./components/IAHeader";
import HeaderSimple from "./components/HeaderSimple/HeaderSimple";
import { updateShoppingRequestWithUser, syncShoppingRequest, syncShoppingRequestFromGuest } from "./libs/helpers";


Promise.all([
  getHeaderInformation(),
  getFeatureFlags(),
]).then(([headerInfo, featureFlags])=>
    Promise.all([
      getTranslations(headerInfo),
      getCachedAemMenuItems(),
      getCachedFilteredItemsMap(
        headerInfo.isLoggedIn ? headerInfo.userInformation.email : "loggedOut"
      ),
      // headerInfo.isLoggedIn && syncShoppingRequestFromGuest()
    ])
  )
  .then(([headerInfo, cachedAemMenuItems, cachedFilteredItemMap]) => {
    const element = document.getElementById("app-header");
    const { isCES, isIPSUser, isLoggedIn, userInformation } = headerInfo;
    const loginContract = isIPSUser && isLoggedIn ? userInformation?.contract : null
    // Logout contract details
    const ipsContractID = hasCookie(IPS_CONTRACT_ID_COOKIE_NAME) ? getCookie(IPS_CONTRACT_ID_COOKIE_NAME): null
    const ipsContractName = hasCookie(IPS_CONTRACT_NAME_COOKIE_NAME) ? getCookie(IPS_CONTRACT_NAME_COOKIE_NAME): null
    const logoutContract =  isIPSUser && ipsContractID && !isLoggedIn ? {
      contractType: decodeURIComponent(decodeURIComponent(ipsContractName)),
      contractId: ipsContractID
    } : null

    const contract = isIPSUser ? (loginContract || logoutContract) : null

    ReactDOM.render(
      isCES ? (
        <HeaderSimple
          cachedAemMenuItems={cachedAemMenuItems}
          cachedFilteredItemMap={cachedFilteredItemMap}
          headerInfo={headerInfo}
        />
      ) : (
        <IAHeader
          cachedAemMenuItems={cachedAemMenuItems}
          cachedFilteredItemMap={cachedFilteredItemMap}
          headerInfo={headerInfo}
          contract={contract}
        />
      ),
      element
    );
    if (headerInfo.isLoggedIn) {
      document.body.classList.add("is-logged-in");
    }
    if (headerInfo.isCES) {
      document.body.classList.add("is-ces");
      syncShoppingRequest(headerInfo).then((data) => {
        if (data) {
          updateShoppingRequestWithUser(headerInfo).then(() => syncShoppingRequestFromGuest(headerInfo))
        }
      })
    }
    else {
      syncShoppingRequestFromGuest(headerInfo)
    }
  });

export default { getLoggedInFilterMap };
export { fetchSearchSuggestions };
