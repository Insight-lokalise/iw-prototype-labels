import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Header from "@insight/toolkit-react/lib/Header/Header";
import { Locale } from "@insight/toolkit-react/lib/Locale/Locale";
import { isDesktop , setCookie, getCookie } from "@insight/toolkit-utils";
import { setStorage } from "@insight/toolkit-utils/lib/helpers/storageHelpers";
import listen from '@insight/toolkit-utils/lib/events/listen'

import cn from "classnames";

import { isHybridXEnabled } from 'app-api-user-service'
import { getAemMenuItems, getFilteredItemsMap } from "api";

import { SearchContextProvider } from "../context/SearchContext";
import IAHeaderBottom from "./IAHeaderBottom/IAHeaderBottom";
import IAHeaderContext from "../context/IAHeaderContext";
import IAHeaderFlyouts from "./IAHeaderFlyouts/IAHeaderFlyouts";
import IAHeaderMiddle from "./IAHeaderMiddle/IAHeaderMiddle";
import IAHeaderTop from "./IAHeaderTop/IAHeaderTop";
import ModalContextProvider from "./Modal/ModalContextProvider";
import ModalRenderer from "./Modal/ModalRenderer";
import SkipLinkTarget from "./IAHeaderMegaMenu/SkipLinkTarget";
import { Alert } from "@insight/toolkit-react/lib/Alert/Alert";
import EndIESupportMessage from "./EndIESupportMessage/EndIESupportMessage";
import { isGuestCheckoutFlow, getLocation } from "../api/common/isGuestCheckoutFlow";

export default function IAHeader({
  cachedAemMenuItems,
  cachedFilteredItemMap,
  headerInfo,
  contract
}) {
  const { locale, isLoggedIn, isIPSUser, isSEWPUser, userInformation: { isCES } = {} } = headerInfo;

  const [filteredItemMap, setFilteredItemMap] = useState(cachedFilteredItemMap);
  const [aemMenuItems, setAemMenuItems] = useState(cachedAemMenuItems);
  const [isDesktopView, setIsDesktopView] = useState(isDesktop());
  const [alertData, setAlertData] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [showOnlyGuestCheckoutLinks, setShowOnlyGuestCheckoutLinks] = useState(false)

  useEffect(() => {
    getAemMenuItems().then((menuData) => {
      setAemMenuItems(menuData);
      const { alert } = menuData;
      setAlertData(alert);
      setShowAlert(
        alert &&
          !(Object.entries(alert).length === 0) &&
          !getCookie("insight_hide_alert") &&
          !isLoggedIn
      );
    });
    const resize = () => {
      setIsDesktopView(isDesktop());
    };
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  const updateCheckoutHeader = () => {
    const path = getLocation();
    const showOnlyGuestCheckoutLink = window.flags && window.flags['CES-26-GUEST-CHECKOUT'] && isGuestCheckoutFlow(path) && !isLoggedIn;
    setShowOnlyGuestCheckoutLinks(showOnlyGuestCheckoutLink)

    const isLoggedOutUSUser= locale==="en_US" && !isIPSUser && !isSEWPUser && window.flags && window.flags['GNA-12386-DEFAULT-LOGGED-OUT'];
    const isShoppingCartEnabled = window?.flags['GNA-10394-SHOPPING-CART'];
    const isShoppingCart = isShoppingCartEnabled && isLoggedOutUSUser
    if(isShoppingCart && !isGuestCheckoutFlow(path)) {
      setStorage('quickCheckoutRequested', false)
    }
  }

  useEffect(() => {
    updateCheckoutHeader()
    return listen('location', () => {
      updateCheckoutHeader()
    })
  }, [])

  useEffect(() => {
    if (aemMenuItems) {
      getFilteredItemsMap({ aemMenuItems, headerInfo }).then(
        setFilteredItemMap
      );
    }
  }, [aemMenuItems, headerInfo]);

  const shouldRender = aemMenuItems && filteredItemMap;
  const secondaryNavPresent = !!document.getElementById(
    "react-app-secondary-nav"
  );
  const secondaryNavBlackPresent = !!document.querySelector('.c-subnav--black');

  const onAlertClose = () => {
    setCookie("insight_hide_alert", true);
    setShowAlert(false);
  };

  const isHybridExperience = isHybridXEnabled(isLoggedIn, isCES);

  return shouldRender ? (
    <div className={cn("ds-v1  app-header", { "guest-checkout-flow": showOnlyGuestCheckoutLinks })}>
      <Locale value={{ locale }}>
        <IAHeaderContext.Provider
          value={{ filteredItemMap, headerInfo, menuItems: aemMenuItems, isHybridExperience: isHybridExperience, contract }}
        >
          <SearchContextProvider>
            <ModalContextProvider>
              <ModalRenderer />
              <Header>
                {(isDesktopView && !showOnlyGuestCheckoutLinks) ? <IAHeaderTop /> : null}
                <IAHeaderMiddle isIPSUser={headerInfo.isIPSUser} />
                <IAHeaderBottom isDesktop={isDesktopView} showOnlyCartLink={showOnlyGuestCheckoutLinks} />
                <IAHeaderFlyouts />
                <SkipLinkTarget />
              </Header>
              {showAlert && (
                <Alert
                  alert={alertData}
                  onAlertClose={onAlertClose}
                  className={
                    cn({
                      "secondary-nav": secondaryNavPresent,
                      "secondary-nav-black": secondaryNavBlackPresent
                    })
                  }
                />
              )}
              <EndIESupportMessage />
            </ModalContextProvider>
          </SearchContextProvider>
        </IAHeaderContext.Provider>
      </Locale>
    </div>
  ) : null;
}

IAHeader.propTypes = {
  cachedAemMenuItems: PropTypes.shape({}),
  cachedFilteredItemMap: PropTypes.shape({}),
  headerInfo: PropTypes.shape({
    customContactNumber: PropTypes.string.isRequired,
    isAccountToolsEnabled: PropTypes.bool.isRequired,
    isCreateAccountEnabled: PropTypes.bool.isRequired,
    isIPSUser: PropTypes.bool.isRequired,
    isLimitedBuyer: PropTypes.bool.isRequired,
    isLiveChatEnabled: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isPhoneNumberEnabled: PropTypes.bool.isRequired,
    isSEWPUser: PropTypes.bool.isRequired,
    locale: PropTypes.string.isRequired,
    userInformation: PropTypes.shape({
      account: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
          .isRequired,
        name: PropTypes.string.isRequired,
      }),
      availableSites: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
        })
      ),
      b2bInfo: PropTypes.shape({
        customMastheadFooter: PropTypes.bool,
        debrandSite: PropTypes.bool.isRequired,
        eProcurementType: PropTypes.string,
        extrinsic: PropTypes.string,
        isB2B: PropTypes.bool.isRequired,
        token: PropTypes.string,
      }).isRequired,
      email: PropTypes.string.isRequired,
      favoriteLinks: PropTypes.arrayOf(PropTypes.object),
      firstName: PropTypes.string.isRequired,
      isInternalUser: PropTypes.bool.isRequired,
      lastName: PropTypes.string.isRequired,
      permissions: PropTypes.shape({
        enableCountrySelect: PropTypes.bool.isRequired,
        enableFavorites: PropTypes.bool.isRequired,
        enableLogout: PropTypes.bool.isRequired,
        enableNotifications: PropTypes.bool.isRequired,
        enableOrderHistory: PropTypes.bool.isRequired,
        enableSearch: PropTypes.bool.isRequired,
        enableSearchSuggestions: PropTypes.bool.isRequired,
      }).isRequired,
      username: PropTypes.string.isRequired,
      webGroup: PropTypes.shape({
        countryCode: PropTypes.string,
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
          .isRequired,
        name: PropTypes.string.isRequired,
      }),
      webLoginProfileId: PropTypes.number,
    }),
  }).isRequired,
};

IAHeader.defaultProps = {
  cachedAemMenuItems: null,
  cachedFilteredItemMap: null,
};
