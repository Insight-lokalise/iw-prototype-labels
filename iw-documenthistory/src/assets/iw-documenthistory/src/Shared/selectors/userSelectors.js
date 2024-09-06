import get from "lodash-es/get";

export const selector_user = (state) => get(state, "user", {});
export const selector_consortiaId = (state) =>
  selector_user(state).defaultConsortiaId || 0;
export const selector_isEMEA = (state) => selector_user(state).isEMEA || false;
export const selector_isAPAC = (state) => selector_user(state).isAPAC || false;
export const selector_isCanada = (state) =>
  selector_user(state).userSalesOrg === "4100";
export const selector_userDataIsLoading = (state) =>
  selector_user(state).isLoading || false;
export const selector_isLoggedIn = (state) =>
  selector_user(state).isLoggedIn || false;
export const selector_isPCMUSUser = (state) =>
  selector_user(state).isPCMUSUser || false;
export const selector_isSEWPUser = (state) =>
  selector_user(state).isSEWPUser || false;
export const selector_soldto = (state) => selector_user(state).userSoldto || "";
export const selector_userPermissions = (state) =>
  get(selector_user(state), "userPermissions", []);
export const selector_hasUserPermission = (state, permission) =>
  selector_userPermissions(state).includes(permission);
export const selector_hasDuplicateOrderPermission = (state) =>
  selector_hasUserPermission(state, "enable_duplicate_order");
export const selector_hasInvoiceEnabledPermission = (state) =>
  selector_hasUserPermission(state, "enable_invoicing");
export const selector_hasLimitOnSearchPermission = (state) =>
  selector_hasUserPermission(state, "limit_om_search");
export const selector_hasMyOrdersOnlyPermission = (state) =>
  selector_hasUserPermission(state, "my_orders");
export const selector_webGroupId = (state) =>
  selector_user(state).webGroupId || "";
export const selector_webGroupPermission = (state) =>
  get(selector_user(state), "webGroupPermissions", []);
export const selector_haswebGroupPermission = (state, permission) =>
  selector_webGroupPermission(state).includes(permission);
export const selector_hasEWRFees = (state) =>
  selector_haswebGroupPermission(state, "ewr_fees_in_cart");
