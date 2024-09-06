import React, { useState, useEffect, useReducer, Fragment } from "react";
import { t } from "@insight/toolkit-utils/lib/labels";
import { SearchFilter } from "@insight/toolkit-react";
import Panel from "@insight/toolkit-react/lib/Panel/Panel";
import Lozenge from "@insight/toolkit-react/lib/Lozenge/Lozenge";
import { fetchPersonalInformation, getAllAccounts } from "../../api";

const AccountsHeader = ({ setFilterString }) => {
  const [soldToNumber, setSoldToNumber] = useState(null);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    fetchInfo();
  });

  const fetchInfo = async () => {
    const tempInfo = await fetchPersonalInformation().then((response) => {
      setSoldToNumber(response.accountNumber);
    });
    const accountInfo = await getAllAccounts(soldToNumber).then((data) => {
      setAccounts(data);
    });
  };

  return (
    <>
      <div className="o-grid o-grid--bottom">
        <div className="o-grid__item u-1/2@tablet">
          <div className="o-grid o-grid--bottom">
            <div className="o-grid__item u-1/2@tablet">
              <h1 className="u-h3 u-text-bold u-margin-bot-none c-account-header__heading">
                {t("Accounts")}
              </h1>
            </div>
            <div
              className="o-grid__item u-2/3@tablet u-margin-bot"
              data-private="true"
            >
              <SearchFilter
                name={"accountsFilter"}
                label={t("Search accounts")}
                setValue={setFilterString}
              />
            </div>
          </div>
        </div>
        <div className="o-grid__item u-1/2@tablet">
          <div className="o-grid o-grid--bottom">
            <div className="o-grid__item u-1/2@tablet">
              {accounts?.soldto ? (
                <Panel className={`c-account-tiles`}>
                  <Panel.Body>
                    {accounts?.soldto?.name1}
                    <br />
                    {accounts?.soldto?.id}
                    <br />
                    <div className="c-account-tiles__buttons">
                      <div className="o-grid">
                        <div className="o-grid__item o-grid__item--shrink">
                          <Fragment>
                            <Lozenge
                              className="c-account-tiles__default-lozenge"
                              color="info"
                            >
                              {t("Current")}
                            </Lozenge>
                          </Fragment>
                        </div>
                      </div>
                    </div>
                  </Panel.Body>
                </Panel>
              ) : (
                " "
              )}
            </div>
            <div className="o-grid__item u-1/2@tablet">
              {accounts?.defaultSoldto ? (
                <Panel className={`c-account-tiles`}>
                  <Panel.Body>
                    {accounts?.defaultSoldto?.companyName}
                    <br />
                    {accounts?.defaultSoldto?.soldToId}
                    <br />
                    <div className="c-account-tiles__buttons">
                      <div className="o-grid">
                        <div className="o-grid__item o-grid__item--shrink">
                          <Fragment>
                            <Lozenge
                              className="c-account-tiles__default-lozenge"
                              color="info"
                            >
                              {t("Default")}
                            </Lozenge>
                          </Fragment>
                        </div>
                      </div>
                    </div>
                  </Panel.Body>
                </Panel>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default AccountsHeader;
