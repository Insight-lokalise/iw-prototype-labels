import React, { Fragment } from 'react'
import { t } from "@insight/toolkit-utils";
import FilterView from './FilterView'
import { ToggleView } from './Shared'
import PropTypes from "prop-types";

export default function CategoryHeaderView({ backToCatalog }) {
  return (
    <Fragment>
      <div className="o-grid o-grid__justify--between u-margin-bot">
        <div className="o-grid__item o-grid__item--shrink u-3/4 u-1/2@tablet u-4/6@desktop">
          <h4 className="u-margin-bot-none u-text-bold">{t('Categories')}</h4>
        </div>
        <div className="o-grid__item u-1/4 u-1/2@tablet u-2/6@desktop">
          <div className="o-grid o-grid--justify-right">
            <div className="o-grid__item u-1/2">
              <div className="o-grid u-show@tablet o-grid--full-height o-grid--justify-center o-grid--center">
                <FilterView rightJustify />
              </div>
            </div>
            <div className="o-grid__item o-grid__item--shrink c-cs-toggleview-container">
              <ToggleView backToCatalog={backToCatalog} />
            </div>
          </div>
        </div>
        <div className="o-grid__item u-1/1 u-hide@tablet">
          <div className="o-grid">
            <FilterView />
          </div>
        </div>
      </div>
    </Fragment>
  )
}

CategoryHeaderView.propTypes = {
  backToCatalog: PropTypes.func.isRequired
}
