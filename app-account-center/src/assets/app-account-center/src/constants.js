export const ADD_NEW = "addNew";
export const AVAILABLE = "available";
export const CARD_ICON_MAPPING = {
  AMEX: "amex",
  DISC: "discover",
  VISA: "visa",
  MC: "mastercard",
};
export const INSIGHT_CURRENT_LOCALE_COOKIE_NAME = "insight_current_locale";
export const INVALID_CURRENT_PASSWORD = "Your current password is not correct";
export const LOGIN_ID_NOT_FOUND = "Login Does Not Exists";
export const LOGIN_INFO_UPDATED_SUCCESSFULLY =
  "Login information successfully updated";
export const MANAGE = "manage";
export const OLD_PASSWORD_USED =
  "The new password entered must be unique to your previous five passwords.";
export const PASSWORD_MISMATCH = "Invalid new password";
export const PAGE_ROUTE = {
  MY_ACCOUNT: "/userProfile",
  MANAGE_ADDRESS: "/userProfile/addresses/manage",
  MANAGE_PAYMENT: "/userProfile/payments/manage",
  ADD_ADDRESS: "/userProfile/addresses/addNew",
  ADD_PAYMENT: "/userProfile/payments/addNew",
  EDIT_ADDRESS:
    "/userProfile/addresses/edit/:editType/:partner/:defaultPartner",
  EDIT_PAYMENT: "/userProfile/payments/edit/:method/:cardId",
  ACCOUNTS: "/userProfile/accounts",
};
export const ROUTES = {
  MY_ACCOUNT: {
    url: PAGE_ROUTE.MY_ACCOUNT,
    name: "Account settings",
  },
  ADD_ADDRESS: {
    url: PAGE_ROUTE.ADD_ADDRESS,
    name: "Add address",
  },
  EDIT_ADDRESS: {
    url: PAGE_ROUTE.EDIT_ADDRESS,
    name: "Edit address",
  },
  MANAGE_ADDRESS: {
    url: PAGE_ROUTE.MANAGE_ADDRESS,
    name: "Manage addresses",
  },
  ADD_PAYMENT: {
    url: PAGE_ROUTE.ADD_PAYMENT,
    name: "Add card",
  },
  MANAGE_PAYMENT: {
    url: PAGE_ROUTE.MANAGE_PAYMENT,
    name: "Manage payments",
  },
  ACCOUNTS: {
    url: PAGE_ROUTE.ACCOUNTS,
    name: "Accounts",
  },
  EDIT_PAYMENT: {
    url: PAGE_ROUTE.EDIT_PAYMENT,
    name: "Edit card",
  },
};
export const BREADCRUMBS = {
  MY_ACCOUNT: [ROUTES.MY_ACCOUNT],
  MANAGE_ADDRESS: [ROUTES.MY_ACCOUNT, ROUTES.MANAGE_ADDRESS],
  ADD_ADDRESS: [ROUTES.MY_ACCOUNT, ROUTES.MANAGE_ADDRESS, ROUTES.ADD_ADDRESS],
  EDIT_ADDRESS: [ROUTES.MY_ACCOUNT, ROUTES.MANAGE_ADDRESS, ROUTES.EDIT_ADDRESS],
  MANAGE_PAYMENT: [ROUTES.MY_ACCOUNT, ROUTES.MANAGE_PAYMENT],
  ACCOUNTS: [ROUTES.MY_ACCOUNT, ROUTES.ACCOUNTS],
  ADD_PAYMENT: [ROUTES.MY_ACCOUNT, ROUTES.MANAGE_PAYMENT, ROUTES.ADD_PAYMENT],
  EDIT_PAYMENT: [ROUTES.MY_ACCOUNT, ROUTES.MANAGE_PAYMENT, ROUTES.EDIT_PAYMENT],
};
export const SAME = "same";
export const UNAVAILABLE = "unavailable";
export const USERPROFILE = "userProfile";
export const US_PHONE_NUMBER_PATTERN = "[0-9]{3}-[0-9]{3}-[0-9]{4}";
export const SHIPTO_AVAILABLE_COUNTRY = {
  "US": ["US"],
  "CA": ["CA"],
}

export const BILLTO_AVAILABLE_COUNTRY = {
  "US": ["US"],
  "CA": ["US", "CA"],
}

