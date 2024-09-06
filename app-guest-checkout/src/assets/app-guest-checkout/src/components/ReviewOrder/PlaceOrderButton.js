import React from 'react';
import PropTypes from 'prop-types';
import {t} from "@insight/toolkit-utils/lib/labels";
import {Button} from "@insight/toolkit-react";

const PlaceOrderButton = ({ handlePlaceOrder, isPaymetricReady, isPaymentInProgress }) => {

  let placeOrderText = t('Place order')
  return (
      <div className="o-grid u-1/1">
        <Button
            className="o-grid__item c-place-order-btn"
            type="submit"
            color="primary"
            isDisabled={!isPaymetricReady || isPaymentInProgress}
            onClick={handlePlaceOrder}
            data-testid="place-order-button"
        >
          {placeOrderText}
        </Button>
      </div>
  );
};

PlaceOrderButton.propTypes = {
  handlePlaceOrder: PropTypes.func.isRequired,
  isPaymetricReady: PropTypes.bool.isRequired,
  isPaymentInProgress: PropTypes.bool.isRequired,
};

export default PlaceOrderButton;
