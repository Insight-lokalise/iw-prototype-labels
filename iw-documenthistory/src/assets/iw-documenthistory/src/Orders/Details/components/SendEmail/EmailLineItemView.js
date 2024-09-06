import React from "react";
import PropTypes from "prop-types";
import { t } from "@insight/toolkit-utils/lib/labels";
import { IWImage } from "../../../../libs/iw-components/";
import Currency from "@insight/toolkit-react/lib/Currency/Currency";
import hasValue from "../CustomerDetailsTab/helpers/smartTrackers";

export default function EmailLineItemView(props) {
  const {
    currency,
    index,
    isLoggedIn,
    item,
    isContract,
    isBundle,
    locale,
    getDEPInfo,
  } = props;
  const {
    contractReportingField,
    countryOfUsage,
    diversityPartnerId,
    sellRequirement,
    smartTracker,
  } = item.cartItemMetaData || item.data.cartItemMetaData;
  const hasContractReportingFields =
    isContract && !!contractReportingField.length;
  const hasContractTextLineItem =
    isContract &&
    !!(item.contractTextLineItem && item.contractTextLineItem.length);
  const hasSmartTrackers = !!smartTracker.length;
  const filteredSmartTrackers = smartTracker.filter(hasValue);
  const hasSellRequirements = isContract && !!sellRequirement.length;
  const shouldShowCountryOfUsage =
    countryOfUsage && item.materialInfo.nonShipabble && !isContract;
  const hasLineLevelInformation =
    item.cartItemMetaData &&
    (hasContractReportingFields ||
      countryOfUsage !== "" ||
      diversityPartnerId !== "" ||
      hasSellRequirements ||
      hasSmartTrackers);
  const lineItem = item.data || item;
  const tableStyleObj = {
    borderCollapse: "collapse",
    borderSpacing: 0,
    float: "none",
    textAlign: "left",
    verticalAlign: "top",
    width: "100%",
    color: "#3e332d",
    fontFamily:
      "allumi-2-std,Helvetica Neue,Helvetica,Helvetica,Arial,sans-serif",
    fontSize: 14,
    fontWeight: "normal",
    lineHeight: "1.3",
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 16,
    paddingRight: 8,
    background: "#fff",
    marginTop: "20px",
  };
  const depInfo = getDEPInfo(lineItem.sapLineItemNumber);

  //only render parent items without enrollment prop.  Only child items have enrollment prop.
  return !lineItem.enrollment ? (
    <tr key={index}>
      <td
        colSpan="3"
        style={{ padding: "10px 16px 10px 16px", background: "#fff" }}
      >
        <table style={tableStyleObj}>
          <tbody>
            <tr>
              <td style={{ width: "20%" }}>
                <IWImage
                  src={lineItem.imageURL}
                  alt={lineItem.materialInfo.description}
                  style={{
                    msInterpolationMode: "bicubic",
                    clear: "both",
                    display: "block",
                    maxWidth: "100%",
                    outline: "none",
                    textDecoration: "none",
                    width: "auto",
                  }}
                />
              </td>
              <td>
                <p
                  style={{
                    margin: 0,
                    color: "#ae0a46",
                    fontFamily:
                      "allumi-2-std,Helvetica Neue,Helvetica,Helvetica,Arial,sans-serif",
                    fontWeight: "normal",
                    lineHeight: "1.3",
                    padding: 0,
                    textAlign: "left",
                    textDecoration: "none",
                  }}
                >
                  <strong>{lineItem.materialInfo.description}</strong>
                </p>
                <p style={{ padding: "10px 16px 10px 16px" }}>
                  {t("Insight part #")}: {lineItem.materialInfo.materialId}
                </p>
                <p style={{ padding: "10px 16px 10px 16px" }}>
                  {t("Mfr Part #")}:{" "}
                  {lineItem.materialInfo.manufacturerPartNumber}
                </p>
                <p>{lineItem.taaCompliant && t("TAA Compliant: Yes")}</p>
              </td>
            </tr>
            <tr>
              <td colSpan="2" style={{ padding: "10px 16px 10px 16px" }}>
                <span style={{ color: "#005885" }}>
                  {t(lineItem.shippingStatus)}
                  {lineItem.materialInfo.nonShipabble
                    ? ` ${t("(non-shippable)")}`
                    : ""}
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px 16px 10px 16px" }}>
                <span>
                  {t(
                    (isBundle && "Qty per bundle") ||
                      (lineItem.materialInfo.nonShipabble && "Qty") ||
                      "Qty shipped"
                  )}
                </span>
              </td>
              <td style={{ padding: "10px 16px 10px 16px" }}>
                {!isBundle && lineItem.materialInfo.nonShipabble
                  ? `${lineItem.quantity}`
                  : `${lineItem.qtyShipped} ${t("of")} ${lineItem.quantity}`}
                {shouldShowCountryOfUsage && (
                  <span>{`${t("Country of usage")}: ${
                    lineItem.countryOfUsage
                  }`}</span>
                )}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px 16px 10px 16px" }}>
                <span>{t("Unit price")}</span>
              </td>
              <td style={{ padding: "10px 16px 10px 16px" }}>
                <span style={{ fontWeight: "bold" }}>
                  <Currency
                    className="item-body__value"
                    value={lineItem.materialInfo.unitPrice}
                    currencyCode={currency}
                  />
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px 16px 10px 16px" }}>
                <span> {t("Total price")}</span>
              </td>
              <td style={{ padding: "10px 16px 10px 16px" }}>
                <span style={{ fontWeight: "bold" }}>
                  <Currency
                    className="item-body__value"
                    value={lineItem.totalPrice}
                    currencyCode={currency}
                  />
                </span>
              </td>
            </tr>
            {isLoggedIn && (
              <tr>
                <td style={{ padding: "10px 16px 10px 16px" }}>
                  {lineItem.lineItemInvoiceInfo && (
                    <p>{t("Invoice numbers")}</p>
                  )}
                </td>
                <td style={{ padding: "10px 16px 10px 16px" }}>
                  {lineItem.lineItemInvoiceInfo &&
                    lineItem.lineItemInvoiceInfo.map((number) => (
                      <p key={number}>{number}</p>
                    ))}
                </td>
              </tr>
            )}
            {isLoggedIn && !!lineItem.ewrFee && (
              <tr>
                <td style={{ padding: "10px 16px 10px 16px" }}>
                  <span>{t("EWR fee")} :</span>
                </td>
                <td style={{ padding: "10px 16px 10px 16px" }}>
                  <span style={{ fontWeight: "bold" }}>
                    <Currency
                      className="item-body__value"
                      value={lineItem.ewrFee}
                      currencyCode={currency}
                    />
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {depInfo && depInfo.materialInfo && depInfo.enrollment && (
          <table style={tableStyleObj}>
            <tbody>
              <tr>
                <td colSpan="2">
                  <h4>{t("Device Enrollment Program")}</h4>
                  <div>
                    <div style={{ marginBottom: "15px" }}>
                      <span>{t("Insight Part #")} : </span>
                      <span>{depInfo.materialInfo.materialId}</span>
                      <br />
                    </div>
                    {isLoggedIn && (
                      <div style={{ marginBottom: "20px" }}>
                        <span>{t("DEP Organizational ID #")} : </span>
                        <span>{depInfo.enrollment.number}</span>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        )}
        {hasLineLevelInformation && (
          <table style={tableStyleObj}>
            <tbody>
              <tr>
                <td colSpan="2">
                  <h4>{t("Line level information")}</h4>
                  {countryOfUsage !== "" && (
                    <div>
                      <p>{t("License information")}</p>
                      <span>
                        {t("Country of usage")}: {countryOfUsage}
                      </span>
                    </div>
                  )}
                  {hasSmartTrackers &&
                    filteredSmartTrackers.map(({ id, name, value }) => (
                      <div key={id}>
                        <p>{t("SmartTracker")}</p>
                        <div>
                          <span>{t(name)} : </span>
                          <span>{value}</span>
                          <br />
                        </div>
                      </div>
                    ))}
                  {hasContractReportingFields && (
                    <div>
                      <p>{t("Contract Specific Info")}</p>
                      {contractReportingField.map(({ id, name, value }) => (
                        <div key={id}>
                          <span>{name} : </span>
                          <span>{value}</span>
                          <br />
                        </div>
                      ))}
                    </div>
                  )}
                  {hasContractTextLineItem && (
                    <div>
                      {lineItem.contractTextLineItem.map((textValue) => (
                        <span>{textValue}</span>
                      ))}
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </td>
    </tr>
  ) : null;
}

EmailLineItemView.propTypes = {
  currency: PropTypes.string,
  isLoggedIn: PropTypes.bool.isRequired,
  item: PropTypes.shape({
    type: PropTypes.string,
    data: PropTypes.shape({
      availableStock: PropTypes.number,
      cartItemMetaData: PropTypes.shape({
        countryOfUsage: PropTypes.string,
        smartTracker: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
            value: PropTypes.string,
          })
        ),
      }),
      contractId: PropTypes.string,
      ewrFee: PropTypes.number,
      lineItemInvoiceInfo: PropTypes.arrayOf(PropTypes.string),
      materialInfo: PropTypes.shape({
        description: PropTypes.string,
        materialId: PropTypes.string,
        unitPrice: PropTypes.number,
        manufacturerPartNumber: PropTypes.string,
        manufacturerName: PropTypes.string,
        nonShipabble: PropTypes.bool,
        programId: PropTypes.string,
        softWareContractId: PropTypes.string,
      }),
      shippingStatus: PropTypes.string,
      totalPrice: PropTypes.number,
      enrollment: PropTypes.object,
    }),
  }).isRequired,
  isContract: PropTypes.bool.isRequired,
  isBundle: PropTypes.bool,
  getDEPInfo: PropTypes.func.isRequired,
};

EmailLineItemView.defaultProps = {
  currency: "USD",
  isBundle: false,
};
