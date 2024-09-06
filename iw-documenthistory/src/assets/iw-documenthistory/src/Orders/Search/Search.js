import React from "react";
import { t } from "@insight/toolkit-utils/lib/labels";
import SearchForm from "./components/SearchForm/SearchForm";

export default function OrderHistory() {
  document.title = t("Order history");

  return <SearchForm />;
}
