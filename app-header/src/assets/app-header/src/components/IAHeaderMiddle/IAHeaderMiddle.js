import React from "react";
import PropTypes from "prop-types";
import LoggedInBar from "../LoggedInBar/LoggedInBar";

export default function IAHeaderMiddle({
  isIPSUser,
  isCheckout,
  isCES,
}) {
  return (
    <div className="c-header__middle">
      <LoggedInBar
        isIPSUser={isIPSUser}
        isCheckout={isCheckout}
        isCES={isCES}
      />
    </div>
  );
}

IAHeaderMiddle.propTypes = {
  isIPSUser: PropTypes.bool.isRequired,
  isCheckout: PropTypes.bool.isRequired,
  isCES: PropTypes.bool,
};

IAHeaderMiddle.defaultProps = {
  isCES: false,
};
