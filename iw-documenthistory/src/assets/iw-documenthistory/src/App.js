/**
 * This is the beginning of the meat of your app. It can be helpful to coordinate
 * things such as translation and routing here.
 */
import React, { Component } from "react";
import { Provider } from "react-redux";
import { Locale } from "@insight/toolkit-react";
import { getInObject } from "@insight/toolkit-utils";

import { IWLoading } from "./libs/iw-components";
import "./App.scss";
import { store } from "./config/storeConfig";
import Routes from "./config/routerConfig";
import { reduxInit } from "./config/reduxInit";
import { getCurrentLocale } from "@insight/toolkit-utils/lib/helpers/localeHelpers";
import { getTranslations } from "./models/getTranslations";

reduxInit();

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
    };
  }

  componentDidMount() {
    getTranslations()
      .then(() => this.setState({ isLoading: false }))
      .catch(() => this.setState({ isLoading: false }));
  }

  render() {
    const localeValue = getCurrentLocale(
      "insight_current_locale",
      "insight_locale"
    );
    const isLoggedIn = getInObject(window, ["Insight", "isLoggedin"], false);
    const userInfo = getInObject(window, ["Insight", "userInformation"], {});
    const isCES = isLoggedIn ? userInfo.isCES : false;
    const webGroupId = isLoggedIn ? userInfo.webGroupId : null

    if ("scrollRestoration" in history) {
      //scrolls to top of pages on navigation
      history.scrollRestoration = "manual";
    }

    return this.state.isLoading ? (
      <IWLoading />
    ) : (
      <Provider store={store}>
        <Locale value={{ locale: localeValue, isCES, webGroupId }}>
          <Routes isCES={isCES} />
        </Locale>
      </Provider>
    );
  }
}
