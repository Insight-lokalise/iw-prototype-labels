import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { t } from "@insight/toolkit-utils/lib/labels";

import { IWLoading } from "../../libs/iw-components";
import { currentLocale } from "../../libs/iw-components/IWUser/model/User/locale";
import DetailsHeader from "./containers/DetailsHeader/DetailsHeader";
import OrderDetailsTabs from "./components/OrderDetailsTabs/OrderDetailsTabs";
import OrderSummary from "./containers/OrderSummary/OrderSummary";
import HostedLicensing from "./components/HostedLicensing/HostedLicensing";

export default class DetailsView extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
    };

    document.title = t("Order details");
  }

  componentDidMount() {
    moment.locale(currentLocale());
    const { params } = this.props.match;
    const { orderNumber, soldTo } = params;
    const detailURL = this.props.isLoggedIn
      ? "report/order"
      : "report/genericOrder";
    this.props
      .getOrderDetails(detailURL, orderNumber, soldTo)
      .then(() => {
        this.setState({ isLoading: false });
      })
      .catch();
  }

  render() {
    const { 
      hasShippableItems, 
      isLoggedIn,
    } = this.props;

    return (
      <div>
        {this.state.isLoading ? (
          <div className="text-center">
            <IWLoading />
          </div>
        ) : (
          <div>
            <div className="row expanded small-collapse medium-uncollapse u-padding-top-small">
              <div className="columns small-12 medium-7 large-9 orders__spacing--bottom u-padding-right-none">
                <DetailsHeader/>
              </div>
              <div className="columns small-12 medium-5 large-3 orders__spacing--bottom">
                <OrderSummary />
              </div>
            </div>
            <div className="row expanded small-collapse medium-uncollapse print__display--block">
              <div className="columns orders__spacing--bottom print__spacing--reset">
                <OrderDetailsTabs
                  hasShippableItems={hasShippableItems}
                  isLoggedIn={isLoggedIn}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

DetailsView.propTypes = {
  getOrderDetails: PropTypes.func.isRequired,
  hasShippableItems: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      orderNumber: PropTypes.string,
      soldTo: PropTypes.string,
    }),
  }).isRequired,
  carrierOption: PropTypes.string,
};
