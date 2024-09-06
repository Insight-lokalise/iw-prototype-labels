import React from "react";
import ReactDOM from "react-dom";
import {
  getCachedAemMenuItems,
  getCachedFilteredItemsMap,
  getSessionInformation,
} from "./api";
import Footer from "./components/Footer";
import "./scss/index.scss";

getSessionInformation()
  .then((sessionInfo) =>
    Promise.all([
      sessionInfo,
      getCachedAemMenuItems(),
      getCachedFilteredItemsMap(sessionInfo.isLoggedIn),
    ])
  )
  .then(([sessionInfo, cachedAemMenuItems, cachedFilteredItemMap]) => {
    const element = document.getElementById("app-footer");
    ReactDOM.render(
      <Footer
        sessionInfo={sessionInfo}
        cachedAemMenuItems={cachedAemMenuItems}
        cachedFilteredItemMap={cachedFilteredItemMap}
      />,
      element
    );
  });
