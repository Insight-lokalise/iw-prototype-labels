/* eslint-disable import/prefer-default-export */
import { getRegion } from "@insight/toolkit-utils/lib/helpers/localeHelpers";
import { GET_USERDATA, SAVE_USERDATA } from "../types";

// TODO Update when data is available immediately from JSP
// let counter = 200
/**
 * Gets userData from JSP after waiting for it to be fully populated
 * @param  {Object}   userObject window.Insight
 * @return {Action}
 */
export function getUserData(userObject) {
  return (dispatch) => {
    dispatch({ type: GET_USERDATA });
    dispatch(saveUserData(userObject));
  };
}
/**
 * Save relevant user data & permissions
 * @param  {Object} userObject window.Insight when fully populated
 * @return {Action}
 */
function saveUserData(userObject) {
  const {
    apac,
    defaultConsortiaId,
    isLoggedin,
    isSEWPUser,
    locale,
    userInformation,
    userPermissions,
    webGroupPermissions,
  } = userObject;
  const isEMEA = getRegion("insight_current_locale") == "EMEA";
  const salesOrg = isLoggedin ? userInformation.salesOrg : null;
  const isUSSalesOrg = ["2400", "2500"].includes(salesOrg);
  const isPCMUSUser =
    userInformation &&
    userInformation.cdmUid &&
    userInformation.cdmUid.startsWith("PCM") &&
    isUSSalesOrg;
  const userData = {
    defaultConsortiaId,
    isAPAC: apac,
    isLoading: false,
    isLoggedIn: isLoggedin,
    isPCMUSUser,
    isSEWPUser,
    locale,
    userPermissions: Array.isArray(userPermissions) ? userPermissions : [],
    userSalesOrg: userInformation ? userInformation.salesOrg : "2400",
    userSoldto: userInformation ? userInformation.soldto : "",
    webGroupId: userInformation ? userInformation.webGroupId : "",
    webGroupPermissions: Array.isArray(webGroupPermissions)
      ? webGroupPermissions
      : [],
    isEMEA: isEMEA,
  };
  return { type: SAVE_USERDATA, payload: userData };
}
