import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { t } from '@insight/toolkit-utils'
import cn from "classnames";

export default function ShowOnWeb({ hasSearchProduct, product, className }) {
  if (!hasSearchProduct) return null;
  const {
    searchProduct: { showOnWeb, showPriceOnWeb, showBuyButton }
  } = product;
  
  const classes = cn(
    "o-grid o-grid--justify-between u-font-size-tiny u-padding-side-small u-padding-top-small",
    className
  );

  return (
    <Fragment>
      {hasSearchProduct && (
        <div className={classes}>
          <span className="o-grid__item o-grid__item--shrink">
            {t("Show on web:")} {showOnWeb ? t("Yes") : t("No")}
          </span>
          <span className="o-grid__item o-grid__item--shrink">
            {t("Show price on web:")} {showPriceOnWeb ? t("Yes") : t("No")}
          </span>
          <span className="o-grid__item o-grid__item--shrink">
            {t("Show buy button on web:")} {showBuyButton ? t("Yes") : t("No")}
          </span>
        </div>
      )}
    </Fragment>
  );
}

ShowOnWeb.propTypes = {
  product: PropTypes.shape({
    searchProduct: PropTypes.shape({
      showOnWeb: PropTypes.bool,
      showPriceOnWeb: PropTypes.bool,
      showBuyButton: PropTypes.bool,
    })
  }),
  hasSearchProduct: PropTypes.bool,
  className: PropTypes.string
};

ShowOnWeb.defaultProps = {
  product: {},
  hasSearchProduct: false,
  className: ""
};
