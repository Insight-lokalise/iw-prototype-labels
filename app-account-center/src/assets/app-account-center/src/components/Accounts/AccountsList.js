import React, { useState, useEffect, useReducer, Fragment } from "react";
import { t } from "@insight/toolkit-utils/lib/labels";
import Panel from "@insight/toolkit-react/lib/Panel/Panel";
import Loading from "@insight/toolkit-react/lib/Loading/Loading";
import Pagination from "@insight/toolkit-react/lib/Pagination/Pagination";
import { Field } from "@insight/toolkit-react";
import { filterAccounts } from "./../../lib/helpers";
import { updateDefaultAccount, getAllAccounts, switchAccount } from "../../api";
import AccountItem from "./AccountItem";
import { ChangeAccountConfirmation } from "../Modal/ChangeAccountConfirmationModal";

const AccountsList = ({ filterString, addToast }) => {
  const PAGECOUNTOPTIONS = [
    { text: "12", value: 12 },
    { text: "40", value: 40 },
    { text: "100", value: 100 },
  ];
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [pageSize, setPageSize] = useState(12);
  const [changeAccountId, setChangeAccountId] = useState(null);
  const [accountConfirmationModalIsOpen, setConfirmationModalIsOpen] =
    useState(false);

  const initalState = {
    defaultSoldto: null,
    currentSoldto: null,
    accountList: [],
    currentPage: 1,
    totalPages: 1,
  };
  const [
    {
      defaultSoldto,
      currentSoldto,
      accountList,
      isLoading,
      currentPage,
      totalRecords,
      totalPages,
    },
    dispatch,
  ] = useReducer(reducer, initalState);

  useEffect(() => {
    getAccounts({ recordCount: pageSize, startPage: 1, searchByAll: filterString }, true).then(
      () => {
        // filterAccountHandler();
        // accountList is updated which will trigger filterAccountHander anyway
      }
    );
  }, [pageSize, filterString]);

  useEffect(() => {
    filterAccountHandler();
  }, [accountList]);

  const handleAccountSelect = (selection) => {
    setChangeAccountId(selection);
    setConfirmationModalIsOpen(!accountConfirmationModalIsOpen);
  };
  const handleConfirmationCancel = () => {
    setChangeAccountId(null);
    setConfirmationModalIsOpen(false);
  };

  const handleConfirmationSelect = () => {
    setConfirmationModalIsOpen(false);
    if (changeAccountId) {
      switchAccount({ soldtoNumber: changeAccountId });
    }
  };

  const filterAccountHandler = () => {

    const newFilteredAccounts = [...accountList]
    const defaultSoldToNumber = defaultSoldto?.soldtoNumber;
    const defaultIndex = accountList.findIndex(
      (account) => defaultSoldToNumber == account.soldtoNumber
    );
    // move default address to first element if found
    if (defaultIndex > -1) {
      newFilteredAccounts.unshift(
        newFilteredAccounts.splice(defaultIndex, 1)[0]
      );
      newFilteredAccounts[0].default = true;
    }
    setFilteredAccounts(newFilteredAccounts);
  };

  const getAccounts = ({ recordCount, startPage, searchByAll='' }, flushCache = false) => {
    dispatch({ type: "INITIATED" });
    return getAllAccounts({ recordCount, startPage, searchByAll }, flushCache).then(
      (data) => {
        dispatch({ type: "SET_ACCOUNT_INFO", payload: data });
      }
    );
  };

  const updateDefaultAccountHandler = ({ accountNumber }) => {
    dispatch({ type: "INITIATED" });
    updateDefaultAccount(accountNumber)
      .then((data) => {
        if (data.exceptionExist) {
          addToast({
            message: t("Failed to update default account"),
            type: "warning",
          });
          dispatch({ type: "FINISHED" });
        } else {
          getAccounts(
            { recordCount: pageSize, startPage: currentPage, searchByAll: filterString },
            true
          ).then(() => {
            addToast({
              message: t("Default account successfully updated"),
              type: "success",
            });
          });
        }
      })
      .catch(() => {
        addToast({
          message: t("Failed to update default account"),
          type: "warning",
        });
        dispatch({ type: "FINISHED" });
      });
  };

  const onPageChange = (page) => {
    dispatch({ type: "INITIATED" });
    getAccounts({ recordCount: pageSize, startPage: page, searchByAll: filterString }, true).then(() => {
      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    });
  };

  const renderAddresses = () => {
    if (filteredAccounts.length == 0) {
      return <p>{t("No accounts available")}</p>;
    }
    return filteredAccounts.map((account, index) => (
      <AccountItem
        key={index}
        account={account}
        currentSoldToNumber={currentSoldto?.id}
        setDefaultAccount={updateDefaultAccountHandler}
        handleAccountSelect={handleAccountSelect}
      />
    ));
  };

  return (
    <div className="c-account-list c-panel-border">
      <Panel>
        <Panel.Body>
          {!isLoading && filteredAccounts.length > 0 && (
            <div className="o-grid c-account-pagination-top">
              <div className="o-grid__item">
                {`${t("Showing")} `}
                {currentPage ? (
                  <Fragment>
                    {`${
                      totalRecords > 0 ? pageSize * (currentPage - 1) + 1 : 0
                    } - ${
                      totalRecords < pageSize
                        ? totalRecords
                        : currentPage * pageSize
                    } ${t("of")} `}
                  </Fragment>
                ) : null}
                {` ${totalRecords}`}
              </div>
              <div className="o-grid__item o-grid__item--shrink">
                <Field
                  fieldComponent="Select"
                  className="c-account-page-size"
                  type="select"
                  handleChange={(e) => {
                    const pSize = e.currentTarget.value;
                    if (!pSize) return null;
                    setPageSize(pSize);
                  }}
                  aria-label={t("Page Size")}
                  name="pageSize"
                  id="pageSize"
                  options={PAGECOUNTOPTIONS}
                  value={pageSize}
                />
              </div>
            </div>
          )}
          <div className="o-grid">
            <div className="o-grid__item u-1/1">
              {isLoading ? (
                <Loading />
              ) : (
                <div className="o-grid">{renderAddresses()}</div>
              )}
            </div>
          </div>
          {!isLoading && filteredAccounts.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageHandler={onPageChange}
            />
          )}
        </Panel.Body>
      </Panel>
      {accountConfirmationModalIsOpen && (
        <ChangeAccountConfirmation
          isOpen={accountConfirmationModalIsOpen}
          onClose={handleConfirmationCancel}
          onCancel={handleConfirmationCancel}
          onConfirm={handleConfirmationSelect}
          title={"Change Account"}
        />
      )}
    </div>
  );
};

function reducer(state, { type, payload }) {
  switch (type) {
    case "INITIATED":
      return { ...state, isLoading: true };
    case "FINISHED":
      return { ...state, isLoading: false };
    case "SET_ACCOUNT_INFO": {
      const { soldto, soldtoList } = payload;
      const {
        currentPage,
        defaultSoldto,
        soldToList,
        totalRecords,
        totalPages,
      } = soldtoList;

      const nextState = {
        ...state,
        isLoading: false,
        currentSoldto: soldto,
        defaultSoldto,
        accountList: soldToList ? soldToList : [],
        currentPage,
        totalPages,
        totalRecords,
      };
      return nextState;
    }
    default:
      return state;
  }
}

export default AccountsList;
