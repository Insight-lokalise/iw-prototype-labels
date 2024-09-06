import React from "react";
import PropTypes from "prop-types";
import { Button, Icon } from "@insight/toolkit-react";
import { t } from '@insight/toolkit-utils'

import ROUTES from "../Shared/constants";
import InvisibleSpacer from "./InvisibleSpacer";
import Link from "../Navigation/Link";

export default function CategoryListHeader(props) {
  return (
    <div className="o-grid o-grid--full-height category-list-header">
      <div className="o-grid__item u-1/2">
        <div className="o-grid o-grid--full-height">
          <InvisibleSpacer />
          <div className="o-grid__item">
            <Button
              className="o-grid o-grid--center o-grid--full-height"
              color="inline-link"
              onClick={props.toggleExpandAll}
            >
              <div className="o-grid__item o-grid__item--shrink u-rotate-90">
                <Icon icon="swap" />
              </div>
              <div className="o-grid__item o-grid__item--shrink u-margin-left-tiny u-text-bold">
                <span>
                  {props.expandAll
                    ? t("Collapse all categories")
                    : t("Expand all categories")}
                </span>
              </div>
            </Button>
          </div>
          <div className="o-grid__item o-grid--center">
            <div className="o-grid o-grid--full-height o-grid--center">
              <div className="o-grid__item o-grid__item--shrink c-catalog-list__header">
                <Link
                  to={{ pathname: ROUTES.CREATE_CATEGORY }}
                  color="inline-link"
                >
                  <div className="o-grid u-margin-left-tiny">
                    <div className="o-grid__item o-grid__item--shrink">
                      <Icon icon="add" />
                    </div>
                    <div className="o-grid__item o-grid__item--shrink">
                      <span className="u-margin-left-tiny u-text-bold">
                        {t("Add new category")}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="o-grid__item u-1/2">
        <div className="o-grid o-grid--full-height o-grid--center">
          <div className="o-grid__item u-1/6">
            <span className="u-margin-bot-none">{t("Lab config")}</span>
          </div>
          <div className="o-grid__item u-1/6">
            <span className="u-margin-bot-none u-padding-left-small">{t("Status")}</span>
          </div>
          <div className="o-grid__item u-1/6" />
          <div className="o-grid__item u-2/6">
            <span className="u-margin-bot-none u-padding-left-small">
              {t("Modified")}
            </span>
          </div>
          <div className="o-grid__item u-1/6">
            <div className="o-grid o-grid--justify-right">
              <p className="u-margin-bot-none">{t("Actions")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

CategoryListHeader.propTypes = {
  expandAll: PropTypes.bool.isRequired,
  toggleExpandAll: PropTypes.func.isRequired
};
