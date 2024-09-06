import { batch } from "react-redux";
import setToolkitLabels from "@insight/toolkit-react/lib/utils/setToolkitLabels";
import {
  getInObject,
  i18n,
  getCurrentLocale,
  getRegion,
} from "@insight/toolkit-utils";

import {
  deletePin,
  fetchInitialData,
  fetchProductSets,
  putPin,
  putUserSettings,
} from "../api";
import {
  addPin,
  getInsightUserData,
  fetchProductSetsPending,
  saveCategories,
  saveInsightUserData,
  saveLocale,
  savePins,
  saveProductGroups,
  saveProductSets,
  saveTags,
  saveUserSettings,
  saveWebGroupSettings,
} from "./actions";
import {
  selector_isPinned,
  selector_locale,
  selector_pins,
  selector_userSettings,
  selector_isSharedUser,
  selector_isB2bUser,
} from "./selectors";

const INSIGHT_CURRENT_LOCALE_COOKIE_NAME = "insight_current_locale";

export function getInitialData() {
  return (dispatch) => {
    const locale = getCurrentLocale(INSIGHT_CURRENT_LOCALE_COOKIE_NAME);
    const promiseArray = [
      fetchInitialData(),
      i18n({ app: "app-cs-client", locale }),
    ];
    Promise.all(promiseArray).then(
      ([
        {
          data: {
            categories,
            productGroups,
            tags,
            userSettings,
            webGroupSettings,
          },
        },
        labels,
      ]) => {
        setToolkitLabels(labels);
        const defaultSettings = {
          pins: [],
          showPictures: true,
          viewMode: webGroupSettings.defaultView,
        };
        batch(() => {
          if (!userSettings) putUserSettings(defaultSettings);
          const { pins, ...otherUserSettings } =
            userSettings || defaultSettings;
          dispatch(getUserData(window.Insight));
          dispatch(saveCategories(categories));
          dispatch(saveLocale(locale));
          dispatch(savePins(pins));
          dispatch(saveProductGroups(arrayToMap(productGroups)));
          dispatch(saveTags({ ...arrayToMap(tags), pins: {} }));
          dispatch(saveUserSettings(otherUserSettings));
          dispatch(saveWebGroupSettings(webGroupSettings));
        });
      }
    );
  };
}

export function getProductSets(productGroupId) {
  return (dispatch, getState) => {
    dispatch(fetchProductSetsPending());
    const locale = selector_locale(getState());
    fetchProductSets({ locale, productGroupId }).then(({ data }) => {
      dispatch(saveProductSets({ data, id: productGroupId }));
    });
  };
}

export function setViewMode(viewMode) {
  if (viewMode !== "LIST" && viewMode !== "TILE") {
    return console.warn(
      `Invalid viewMode type of ${viewMode}, must be "TILE" or "LIST".`
    );
  }
  return (dispatch, getState) => {
    const { showPictures } = selector_userSettings(getState());
    const isShared = selector_isSharedUser(getState());
    const isB2B = selector_isB2bUser(getState());
    const isSharedAccount = isShared || isB2B;

    if (isSharedAccount) {
      dispatch(saveUserSettings({ viewMode }));
    } else {
      putUserSettings({ showPictures, viewMode }).then(() => {
        dispatch(saveUserSettings({ viewMode }));
      });
    }
  };
}

export function togglePin(id) {
  return (dispatch, getState) => {
    if (selector_isPinned(getState(), id)) {
      deletePin(id).then(() => {
        const pins = selector_pins(getState()).filter((entry) => entry !== id);
        dispatch(savePins(pins));
      });
    } else {
      putPin(id).then(() => {
        dispatch(addPin(id));
      });
    }
  };
}

export function toggleShowPictures() {
  return (dispatch, getState) => {
    const { showPictures, viewMode } = selector_userSettings(getState());
    putUserSettings({ showPictures: !showPictures, viewMode }).then(() => {
      dispatch(saveUserSettings({ showPictures: !showPictures }));
    });
  };
}

function arrayToMap(arr, mapKey = "id") {
  return arr.reduce((acc, entry) => {
    acc[entry[mapKey]] = entry;
    return acc;
  }, {});
}

/**
 * Gets userData from JSP after waiting for it to be fully populated
 * @param  {Object}   userObject window.Insight
 * @return {Action}
 */
export function getUserData(userObject) {
  return (dispatch, getState) => {
    dispatch(getInsightUserData());
    const userType = getInObject(
      userObject,
      ["userInformation", "UserType"],
      "Standard"
    );
    const isB2bUser = getInObject(
      userObject,
      ["b2bLoginInfo", "isB2BUser"],
      false
    );
    const webGroupPermissions = getInObject(
      userObject,
      ["webGroupPermissions"],
      []
    );
    const isSharedUser = userType === "Shared";
    const isSharedAccount = isSharedUser || isB2bUser;
    const isEMEA = getRegion(INSIGHT_CURRENT_LOCALE_COOKIE_NAME) == "EMEA";
    dispatch(
      saveUserData({
        userPermissions: userObject.userPermissions,
        webGroupPermissions,
        isB2bUser,
        isSharedUser,
        isEMEA,
        isSharedAccount,
      })
    );
  };
}
/**
 * Save relevant user permissions
 * @param  {Object} userObject window.Insight when fully populated
 * @return {Action}
 */
export function saveUserData(userData) {
  return saveInsightUserData(userData);
}
