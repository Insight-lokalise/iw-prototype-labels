import React from "react";
import { IWImage } from "../../../../libs/iw-components";
import PropTypes from "prop-types";
import { t } from "@insight/toolkit-utils/lib/labels";

export default function LineItem({ item }) {
  const {
    materialInfo: { description, imageUrl, materialId, qtyShipped, quantity },
  } = item;

  return (
    <div className="row collapse expanded align-top line-item">
      <div className="columns small-12 medium-7 large-4">
        <div className="row expanded">
          <div className="columns shrink line-item__img-wrapper hide-for-print">
            <IWImage
              className="line-item__img"
              src={imageUrl}
              alt={description}
            />
          </div>
          <div className="columns expand text-left">
            <h3 className="line-item__desc">{description}</h3>
            <span className="line-item__part">
              {t("Insight part #")}:{" "}
              <span className="nowrap line-item__part-number">
                {materialId}
              </span>
            </span>
          </div>
        </div>
      </div>
      <div className="columns small-12 medium-5 large-8">
        <div className="row align-middle line-item__row">
          <div className="columns small-6 large-12">
            <span className="line-item__label">{t("Qty shipped")}</span>
          </div>
          <div className="columns small-6 large-12">
            <span className="line-item__value">{`${qtyShipped} ${t(
              "of"
            )} ${quantity}`}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

LineItem.propTypes = {
  item: PropTypes.shape({
    materialInfo: PropTypes.shape({
      description: PropTypes.string,
      imageUrl: PropTypes.string,
      qtyShipped: PropTypes.number,
      quantity: PropTypes.number,
    }),
  }).isRequired,
};
