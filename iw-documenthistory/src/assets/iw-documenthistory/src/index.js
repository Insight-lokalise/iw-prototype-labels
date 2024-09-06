/**
 *  This is the entry point of the app. Top level configuration and
 *  setup belongs here, such as additional polyfills or global styles.
 */
import React from "react";
import ReactDOM from "react-dom";
import "./config/polyfills";
import "./config/axiosConfig";

// Import shared global styles from the iw-styles project
import "iw-styles";

// Import the App
import App from "./App";

ReactDOM.render(<App />, document.getElementById("react-document-history-app"));
