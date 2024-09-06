import React, { useEffect, useState } from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import Header from "@insight/toolkit-react/lib/Header/Header";
import Overlay from "@insight/toolkit-react/lib/Header/Overlay";
import { Locale } from "@insight/toolkit-react/lib/Locale/Locale";
import isDesktop from "@insight/toolkit-utils/lib/media/isDesktop";
import listen from "@insight/toolkit-utils/lib/events/listen";

import {
  getAemMenuItems,
  getFilteredItemsMap,
  getAccountToolsSimple,
  isCheckoutFlow,
} from "api";

import { SearchSimpleContextProvider } from "../../context/SearchSimpleContext";
import IAHeaderContext from "../../context/IAHeaderContext";
import IAHeaderFlyouts from "../IAHeaderFlyouts/IAHeaderFlyouts";
import IAHeaderMiddle from "../IAHeaderMiddle/IAHeaderMiddle";
import ModalContextProvider from "../Modal/ModalContextProvider";
import ModalRenderer from "../Modal/ModalRenderer";
import SkipLinkTarget from "../IAHeaderMegaMenu/SkipLinkTarget";
import HeaderTop from "./HeaderTop";
import HeaderBottom from "./HeaderBottom";
import EndIESupportMessage from "../EndIESupportMessage/EndIESupportMessage";

export default function HeaderSimple({
  cachedAemMenuItems,
  cachedFilteredItemMap,
  headerInfo,
}) {
  const { locale, currencyCode, userInformation } = headerInfo;

  const [filteredItemMap, setFilteredItemMap] = useState(cachedFilteredItemMap);
  const [aemMenuItems, setAemMenuItems] = useState(cachedAemMenuItems);
  const [isDesktopView, setIsDesktopView] = useState(isDesktop());
  const [isCheckout, setIsCheckout] = useState(isCheckoutFlow());
  const [accountTools, setAccountTools] = useState([]);
  /*
    defaultOverlay=true -> used the overlay to cover the entire page except for the header tag
    defaultOverlay=false -> used the overlay to cover the entire page except for the HeaderTop component
   */
  const [defaultOverlay, setDefaultOverlay] = useState(true);

  useEffect(() => {
    getAemMenuItems().then((menuData) => {
      setAemMenuItems(menuData);
    });
    getAccountToolsSimple(userInformation).then((tools) => {
      setAccountTools(tools);
    });
    const resize = () => {
      setIsDesktopView(isDesktop());
    };
    window.addEventListener("resize", resize);
    // listen for custom event from checkout app to show checkout header
    const unlisten = listen("location", () => {
      setIsCheckout(isCheckoutFlow());
    });
    return () => {
      window.removeEventListener("resize", resize);
      unlisten();
    };
  }, []);

  useEffect(() => {
    if (aemMenuItems) {
      getFilteredItemsMap({ aemMenuItems, headerInfo }).then(
        setFilteredItemMap
      );
    }
  }, [aemMenuItems, headerInfo]);

  const shouldRender = aemMenuItems && filteredItemMap;

  return shouldRender ? (
    <div
      className={cn("ds-v1  app-header c-simple-header", {
        "c-checkout-header": isCheckout,
        "c-overlay-top": !defaultOverlay,
      })}
    >
      <Locale value={{ locale, currencyCode }}>
        <IAHeaderContext.Provider
          value={{
            filteredItemMap,
            headerInfo,
            menuItems: aemMenuItems,
            accountSimpleMenu: accountTools,
            setDefaultOverlay
          }}
        >
          <SearchSimpleContextProvider>
            <ModalContextProvider>
              <ModalRenderer />
              <Header defaultOverlay={defaultOverlay} >
                {!defaultOverlay && <Overlay />}
                <HeaderTop isDesktop={isDesktopView} isCheckout={isCheckout} />
                <IAHeaderMiddle
                  isHeaderSimple
                  isCheckout={isCheckout}
                  isCES={true}
                />
                {!isCheckout && <HeaderBottom isDesktop={isDesktopView} />}
                <IAHeaderFlyouts isCES />
                <SkipLinkTarget />
              </Header>
              <EndIESupportMessage isCheckout={isCheckout} />
            </ModalContextProvider>
          </SearchSimpleContextProvider>
        </IAHeaderContext.Provider>
      </Locale>
    </div>
  ) : null;
}

HeaderSimple.propTypes = {
  cachedAemMenuItems: PropTypes.shape({}),
  cachedFilteredItemMap: PropTypes.shape({}),
  headerInfo: PropTypes.shape({
    customContactNumber: PropTypes.string.isRequired,
    isCES: PropTypes.bool.isRequired,
    isAccountToolsEnabled: PropTypes.bool.isRequired,
    isCreateAccountEnabled: PropTypes.bool.isRequired,
    isIPSUser: PropTypes.bool.isRequired,
    isLimitedBuyer: PropTypes.bool.isRequired,
    isLiveChatEnabled: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isPhoneNumberEnabled: PropTypes.bool.isRequired,
    isSEWPUser: PropTypes.bool.isRequired,
    locale: PropTypes.string.isRequired,
  }).isRequired,
};

HeaderSimple.defaultProps = {
  cachedAemMenuItems: null,
  cachedFilteredItemMap: null,
};
