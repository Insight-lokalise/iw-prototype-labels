import React, { useEffect } from "react";

import { jumpToForgotPassword } from "api";

import { t } from "@insight/toolkit-utils/lib/labels";

import Button from "@insight/toolkit-react/lib/Button/Button";

import LoginFooter from "./LoginFooter";

export default function AccountLocked(props) {
  useEffect(() => {
    document.title = t("Account Locked | Insight");
  });

  const { loginAsMessaging } = props;

  const errorMessage = loginAsMessaging ? 
  t("This user's account is currently locked. In order to unlock, send the user a password reset or have the user initiate a password reset from the login page.") : 
  t("Your account has been locked due to too many unsuccessful attempts to login. An email has been sent to you with instructions to unlock your account.")

  return (
    <div className="c-login">
      <main className="c-login__inner">
        <section className="c-login-form-wrapper">
          <div className="c-login-form" aria-labelledby="loginHeading">
            <h1 id="loginHeading" className="u-h2">
              {t("Account locked")}
            </h1>
            <p>{errorMessage}</p>
            <Button
              color="primary"
              fullWidth
              onClick={() => jumpToForgotPassword()}
            >
              {t("Reset password")}
            </Button>
          </div>
        </section>
      </main>
      <LoginFooter />
    </div>
  );
}
