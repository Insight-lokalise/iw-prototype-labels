import React, { Component } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import { connectToLocale } from "@insight/toolkit-react";
import { IWAnchor } from "../../../../libs/iw-components";
import { Link } from "react-router-dom";
import { t } from "@insight/toolkit-utils/lib/labels";

import { PAGE_ROUTE } from "../../../../config/routes";
import AddTrackingNotification from "../AddTrackingNotification/AddTrackingNotification";
import { DetailsTable } from "./DetailsTable";
import OrderAgainModal from "./OrderAgainModal";
import SendToColleague from "../SendEmail/SendToColleague";
import StatusBar from "../../../../Shared/components/StatusBar/StatusBar";
import HostedLicensing from "../../components/HostedLicensing/HostedLicensing";

export class DetailsHeaderView extends Component {
  constructor() {
    super();
    this.state = {
      showOrderAgainModal: false,
      showSTCModal: false,
      emailMessage: "",
      showEmailMessage: false,
    };

    this.showSuccessEmailMessage = this.showSuccessEmailMessage.bind(this);
  }

  windowPrint = () => {
    window.print();
  };

  toggleOrderAgainModal = () => {
    this.setState({
      showOrderAgainModal: !this.state.showOrderAgainModal,
    });
  };

  toggleSTCModal = () => {
    this.setState({
      showSTCModal: !this.state.showSTCModal,
    });
  };

  showSuccessEmailMessage(message) {
    this.setState({ emailMessage: message, showEmailMessage: true });
  }

  render() {
    const {
      className,
      context,
      createdOn,
      hasShippableItems,
      isAPAC,
      isEMEA,
      isDuplicateOrderEnabled,
      isLab,
      isLoggedIn,
      isSEWP,
      isShipComplete,
      isXD,
      orderStatus,
      poNumber,
      poReleaseNumber,
      salesDocumentNumber,
      serialNumbers,
      userContactEmail,
      webReferenceNumber,
      reportUsage,
    } = this.props;

    const showMessageSection =
      !isLoggedIn ||
      reportUsage ||
      isShipComplete ||
      this.state.showEmailMessage ||
      isXD;

    const { isCES } = context;

    const showTrackingNotification =
      isLoggedIn && !isAPAC && !isEMEA && hasShippableItems;

    return (
      <div
        className={cn(
          className,
          "orders__container order__details order__details--ces"
        )}
      >
        {!isCES && (
          <div className="row orders__row expanded hide-for-print">
            <div className="column">
              <Link
                className="orders__link orders__link--inline-block orders__link--margin-bot"
                to={
                  isLoggedIn
                    ? PAGE_ROUTE.ORDER_HISTORY
                    : PAGE_ROUTE.ORDER_TRACKING
                }
              >
                <div>{t("Back")}</div>
              </Link>
            </div>
          </div>
        )}
        {showMessageSection && (
              <div className="row expanded medium-uncollapse print__display--block">
                <div className="columns orders__spacing--bottom">
                  <HostedLicensing
                    emailMessage={this.state.emailMessage}
                    isLoggedIn={isLoggedIn}
                    isShipComplete={isShipComplete}
                    reportUsage={reportUsage}
                    showEmailMessage={this.state.showEmailMessage}
                    isXD={isXD}
                  />
                </div>
              </div>
        )}
        <div className="row expanded">
          <div className="column small-12 large-8">
            <h1 className="order-details__header-title">
              {t("Order details")}
            </h1>
            <span className="order-details__header-sales-doc-number">
              {salesDocumentNumber}
            </span>
          </div>
          <nav className="column small-12 large-4 hide-for-print">
            <ul className="row expanded collapse small-up-1 orders__list orders__list--no-bullets order-details__list large-text-right">
              {!isCES && (
                <li className="column orders__list-item">
                  <IWAnchor
                    className="orders__link order__link--block  js-gtm-orders__send-email"
                    onClick={this.toggleSTCModal}
                  >
                    <span className="orders__link-text">
                      {t("Send to colleague")}
                    </span>
                    <span className="orders__ion-icon orders__ion-icon--right ion-ios-email-outline" />
                  </IWAnchor>
                  <SendToColleague
                    showSTCModal={this.state.showSTCModal}
                    showSuccessEmailMessage={this.showSuccessEmailMessage}
                    onHide={this.toggleSTCModal}
                  />
                </li>
              )}
              <li className="column orders__list-item show-for-large-only">
                <IWAnchor
                  className="orders__link order__link--block"
                  onClick={this.windowPrint}
                >
                  <span className="orders__link-text">{t("Print")}</span>
                  <span className="orders__ion-icon orders__ion-icon--right ion-ios-printer-outline" />
                </IWAnchor>
              </li>
              {isDuplicateOrderEnabled && (
                <li className="column orders__list-item">
                  <IWAnchor
                    className="orders__link order__link--block js-gtm-orders__order-again"
                    onClick={this.toggleOrderAgainModal}
                  >
                    <span className="orders__link-text">
                      {t("Order again")}
                    </span>
                    <span className="orders__ion-icon orders__ion-icon--right ion-loop" />
                    <OrderAgainModal
                      duplicateOrder={this.props.duplicateOrder}
                      onHide={this.toggleOrderAgainModal}
                      orderNumber={this.props.salesDocumentNumber}
                      showOrderAgainModal={this.state.showOrderAgainModal}
                    />
                  </IWAnchor>
                </li>
              )}
              {showTrackingNotification && (
                <li className="column orders__list-item">
                  <AddTrackingNotification
                    email={userContactEmail}
                    orderNumber={salesDocumentNumber}
                    serialNumbers={serialNumbers}
                  />
                </li>
              )}
            </ul>
          </nav>
        </div>
        <div className="row expanded">
          <div className="column">
            <h2 className="order-details__header-subtitle">
              {t("Order status")}
            </h2>
            <StatusBar status={orderStatus} isLab={isLab} />
          </div>
        </div>
        <DetailsTable
          createdOn={createdOn}
          isLoggedIn={isLoggedIn}
          isSEWP={isSEWP}
          poNumber={poNumber}
          poReleaseNumber={poReleaseNumber}
          webReferenceNumber={webReferenceNumber}
        />
      </div>
    );
  }
}

DetailsHeaderView.propTypes = {
  className: PropTypes.string,
  createdOn: PropTypes.number.isRequired,
  duplicateOrder: PropTypes.func.isRequired,
  hasShippableItems: PropTypes.bool.isRequired,
  isAPAC: PropTypes.bool.isRequired,
  isDuplicateOrderEnabled: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isSEWP: PropTypes.bool.isRequired,
  isShipComplete: PropTypes.bool.isRequired,
  orderStatus: PropTypes.string.isRequired,
  poNumber: PropTypes.string,
  poReleaseNumber: PropTypes.string,
  reportUsage: PropTypes.number,
  salesDocumentNumber: PropTypes.number,
  serialNumbers: PropTypes.arrayOf(PropTypes.string).isRequired,
  userContactEmail: PropTypes.string.isRequired,
  webReferenceNumber: PropTypes.number,
  isLab: PropTypes.bool.isRequired,
  isXD: PropTypes.bool,
};

DetailsHeaderView.defaultProps = {
  className: "",
  poNumber: "",
  poReleaseNumber: "",
  salesDocumentNumber: null,
  webReferenceNumber: null,
  reportUsage: 0,
};

export default connectToLocale(DetailsHeaderView);
