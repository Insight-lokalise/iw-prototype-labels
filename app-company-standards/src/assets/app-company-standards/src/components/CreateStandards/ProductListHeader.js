import React from "react";
import { t } from '@insight/toolkit-utils'

export default function ProductListHeader({ productSetType }) {
  return (
    <div className="c-cs-product__list-header o-grid o-grid--justify-between u-font-size-tiny u-margin-bot">
      <div className="o-grid__item o-grid__item--shrink">{t("Item")}</div>
      <div className="o-grid__item u-1/3">
        <div className="o-grid o-grid--justify-between">
          <div className="o-grid__item u-1/4">
            <div className="o-grid o-grid--justify-center">
              {t("Configuration")}
            </div>
          </div>
          <div className="o-grid__item u-1/4">
            <div className="o-grid o-grid--justify-center">
              {t("Pre-selected")}
            </div>
          </div>
          <div className="o-grid__item u-1/4">
            <div className="o-grid o-grid--justify-center">{t("Qty")}</div>
          </div>
          <div className="o-grid__item u-1/4">
            <div className="o-grid o-grid--justify-center">{t("Delete")}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
