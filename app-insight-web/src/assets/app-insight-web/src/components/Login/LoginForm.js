import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { sanitize } from 'dompurify';

import {
  jumpToForgotPassword,
  getLocaleFromCookie,
  getCartItemsCount,
  getSessionInformation
} from "api";

import { t } from "@insight/toolkit-utils/lib/labels";
import Button from "@insight/toolkit-react/lib/Button/Button";
import Form from "@insight/toolkit-react/lib/Form/Form";
import Field from "@insight/toolkit-react/lib/Form/Field/Field";
import { getItemCountFromShoppingRequest } from "@insight/toolkit-utils/lib/helpers/cartHelpers"
import { setCookie } from "@insight/toolkit-utils/lib/helpers/cookieHelpers";


export default function LoginForm(props) {
  const { isLoading, loginName, onSubmit, loginFormRef } = props;
  const [showLoginAsGuest, setShowLoginAsGuest] = useState(false);
  const usernameErrorMessage = t("Please enter a valid email or username.");
  const passwordErrorMessage = t("Please enter a valid password.");
  const isShoppingCartEnabled = window.flags && window.flags['GNA-10394-SHOPPING-CART'];

  useEffect(() => {
    getShowGuest().then((res) => {
      if (res) {
        setShowLoginAsGuest(true);
      }
    });
  }, []);

  const getShowGuest = async () => {
    const locale = getLocaleFromCookie();
    const cartItemsCount = isShoppingCartEnabled ? getItemCountFromShoppingRequest() : await getCartItemsCount();
    const sessionData = await getSessionInformation()
    const { isIpsUser, isSEWPUser } = sessionData
    return window.flags && window.flags['CES-26-GUEST-CHECKOUT'] && locale === "en_US" && cartItemsCount !== undefined && cartItemsCount > 0 && !isIpsUser && !isSEWPUser
  };

  const guestCheckoutCookieHandler = () => {
    setCookie('guest-checkout-enabled', true)
    window.location ='/insightweb/customerInfo'
  }

  function validateLoginForm(formData) {
    let errors = {};

    const password = formData.password;
    const passwordLen = password.length;
    let username = formData.username;
    if(username) {
      username = sanitize(username);
    }
    if (username === "" || username === undefined) {
      errors.username = usernameErrorMessage;
    } else if (
      password === "" || password === undefined ||
      passwordLen < 8 || passwordLen > 16
    ) {
      errors.password = passwordErrorMessage;
    }

    return errors;
  }

  return (
    <Form
      initialValues={{ username: loginName }}
      onSubmit={onSubmit}
      validate={validateLoginForm}
      skipValidateOnMount
      render={({ handleSubmit }) => (
        <form
          onSubmit={handleSubmit}
          className="c-login-form u-margin-bot"
          aria-labelledby="loginHeading"
          ref={loginFormRef}
        >
          <h1 id="loginHeading" className="u-h2">
            {t("Login")}
          </h1>
          <fieldset className="c-form__group">
            <Field
              fieldComponent="Text"
              name="username"
              label={t("Email or username")}
              type="text"
              aria-required="true"
              autoFocus
              showErrorIcon
            />
            <Field
              fieldComponent="Password"
              name="password"
              label={t("Password")}
              aria-required="true"
              showErrorIcon
            />
            <Button color="inline-link" onClick={() => jumpToForgotPassword()}>
              {t("Forgot password?")}
            </Button>
          </fieldset>
          <Button color="primary" isLoading={isLoading} fullWidth type="submit">
            {isLoading ? t("Logging in") : t("Login")}
          </Button>
          {showLoginAsGuest &&
            <Button
              color="secondary"
              fullWidth
              className="u-margin-top c-login-form__guest-button"
              onClick={() => guestCheckoutCookieHandler()}
            >
              {t("Checkout as guest")}
            </Button>
          }
        </form>
      )}
    />
  );
}

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
