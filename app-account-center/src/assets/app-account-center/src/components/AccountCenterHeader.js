import React from "react";
import { t } from "@insight/toolkit-utils/lib/labels";

const AccountCenterHeader = () => (
  <h1 className="u-h3 u-text-bold u-margin-bot-none c-account-header__heading">
    {t("Account settings")}
  </h1>
);

export default AccountCenterHeader;
