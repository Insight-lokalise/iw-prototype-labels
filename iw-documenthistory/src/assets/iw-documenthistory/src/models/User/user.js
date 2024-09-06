import { get, post } from "../fetch";

/**
 * [loadUser description]
 * @return {[type]} [description]
 */
export function loadUser() {
  return window.InsightUserObject.ready().then((user) => {
    return {
      b2bLoginInfo: user.b2bLoginInfo,
      defaultConsortiaId: user.defaultConsortiaId,
      isAPAC: user.apac,
      isLoggedIn: user.isLoggedin,
      isNavy: user.isNavy,
      isSEWPUser: user.isSEWPUser,
      navySTName: user.navySTName,
      userInformation: user.userInformation,
      userPermissions: user.userPermissions,
      webGroupPermissions: user.webGroupPermissions,
      locale: user.locale,
    };
  });
}

/**
 * gets the requestor group object
 * @return {Object} requestor groups
 */
export function getRequestorGroups() {
  const url = "/insightweb/ar/getRequestorGroup";

  return get(url).catch((error) => {
    throw error; // re-throw error for initial testing of functionality
  });
}

/**
 * fetch default carrier for user
 */
export function getDefaultCarrier() {
  return post("transaction/getFreightCostByCarrier", "").catch((error) => {
    console.warn("Failed to fetch default carrier.", error);
    throw error;
  });
}

/**
 * fetch default billing Address for user
 */
export function getDefaultBillingAddress() {
  return get("transaction/getDefaultBillingAddress").catch((error) => {
    console.warn("Failed to fetch default billing address", error);
    throw error;
  });
}

/**
 * fetch default shipping Address for user
 */
export function getDefaultShippingAddress() {
  return get("transaction/getDefaultShippingAddress").catch((error) => {
    console.warn("Failed to fetch default shipping address", error);
    throw error;
  });
}
