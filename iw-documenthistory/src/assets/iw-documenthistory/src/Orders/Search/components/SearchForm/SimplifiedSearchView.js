import React, { useEffect, useState, useReducer } from "react";
import { SearchPane, Field } from "@insight/toolkit-react";
import { t } from "@insight/toolkit-utils/lib/labels";
import {
  statusList,
  productTypes,
  orderTypes,
  TAB_KEY_CODE
} from "../../constants/Constants";
import { handleKeydownListener, getDocumentElement, focusElement } from "../../helpers/helper";

const FILTER_FOCUS_ELEMENT = 'filter_focus_element';
const FILTER_SECTION_ID = 'filterSection';

const SimplifiedSearchView = ({
  onSubmit,
  onClear,
  simplifiedSearchState,
  updateQuery,
}) => {
  const { query, isInit } = simplifiedSearchState;
  const [status, setStatus] = useState(query?.status || "0");
  const [productType, setProductType] = useState(query?.productType || "0");
  const [orderType, setOrderType] = useState(query?.orderType || "0");

  useEffect(() => {
    if (!isInit) {
      onSubmit(query);
    }
  }, [query]);

  useEffect(() => {
    const focusElem = document.querySelector('#filterButton');
    handleKeydownListener(focusElem, handleFilterButtonFocus, true);
    return () => {
      handleKeydownListener(focusElem, handleFilterButtonFocus);
    }
  }, []);

  const handleFilterButtonFocus = (e) => {
    if (e.keyCode === TAB_KEY_CODE) {
      focusElement(getDocumentElement(`#${FILTER_SECTION_ID}`) || getDocumentElement(`.${FILTER_FOCUS_ELEMENT}`), true);
    }

  }

  const getOrderSearch = (values) => {
    const { query, fromDate, toDate } = values;
    const dateRange =
      !fromDate && !toDate ? {} : { startDate: fromDate, endDate: toDate };
    updateQuery({
      searchText: query,
      dateRange,
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    if (name === "status") setStatus(value);
    if (name === "productType") setProductType(value);
    if (name === "orderType") setOrderType(value);

    updateQuery({
      [e.target.name]: Number(e.target.value),
    });
  };

  const handleFilterKeyDown = (e) => {
    if (e.keyCode === TAB_KEY_CODE) {
      focusElement(getDocumentElement(`.${FILTER_FOCUS_ELEMENT}`), true);
    }
  }

  const handleClear = () => {
    onClear();
  };

  //Allow only 3 years prior search
  const minDate = new Date(
    new Date().setFullYear(new Date().getFullYear() - 3)
  );

  const initialValues = isInit
    ? {}
    : {
      query: query?.searchText,
      fromDate: query?.dateRange?.startDate || "",
      toDate: query?.dateRange?.endDate || "",
      showFilters: query?.status || query?.orderType || query?.orderType,
    };

  return (
    <div className="c-simplified-search">
      <h1 className="u-margin-bot u-h3 u-text-bold">{t("Orders")}</h1>
      <SearchPane
        searchTitle={t("Search orders")}
        searchHelperText={t("Search by purchase order, order number, reference number, or PO release number")}
        datePickerHelperText={t("Maximum date range is one year")}
        onSubmit={getOrderSearch}
        onClear={handleClear}
        minDate={minDate}
        initialValues={initialValues}
      >
        <hr />
        <div id={FILTER_SECTION_ID} className="o-grid o-grid--gutters c-adv-options-container c-adv-options-container-enhanced">
          <Field
            name="status"
            id="status"
            className="o-grid__item u-1/1 u-1/3@desktop"
            label={t("Order status")}
            fieldComponent="Select"
            type="text"
            options={statusList.map((option) => ({
              text: t(option.displayName),
              value: option.value,
            }))}
            onChange={handleFilterChange}
            value={status}
          />
          {/* <Field
            name="productType"
            id="productType"
            className="o-grid__item u-1/1 u-1/3@desktop"
            label={t("Shipping type")}
            fieldComponent="Select"
            type="text"
            options={productTypes.map(option => ({
              text: option.displayName,
              value: option.value
            }))}
            onChange={handleFilterChange}
            value={productType}
          /> */}
          <Field
            name="orderType"
            id="orderType"
            className="o-grid__item u-1/1 u-1/3@desktop"
            label={t("Open/invoiced orders")}
            fieldComponent="Select"
            type="text"
            options={orderTypes.map((option) => ({
              text: t(option.displayName),
              value: option.value,
            }))}
            onChange={handleFilterChange}
            value={orderType}
            onKeyDown={handleFilterKeyDown}
          />
        </div>
      </SearchPane>
    </div>
  );
};

export default SimplifiedSearchView;
