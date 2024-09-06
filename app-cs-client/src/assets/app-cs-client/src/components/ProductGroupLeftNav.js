import React from 'react'
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Button, Icon } from "@insight/toolkit-react";
import { t } from "@insight/toolkit-utils";
import CatalogListView from "./CatalogListView";
import FilterView from "./FilterView";
import { selector_categories } from "../duck";

export default function ProductGroupLeftNav({ categoryId, productGrpId, toggleView }) {

  const { categories } = useSelector(state => ({
    categories: selector_categories(state)
  }));

  return (
    <div className="c-cs-client__productgrp-leftnav u-margin-right-small">
      <div className="o-grid o-grid--center">
        <h4 className="o-grid__item o-grid__item--shrink u-margin-bot-small u-1/2 u-text-bold u-padding-small">{t('Catalog')}</h4>
        <div className="o-grid__item o-grid__item--shrink u-margin-bot-small u-1/2 u-text-right">
          <Button color="link" onClick={() => toggleView()}>
            <Icon icon='remove' />{t('Collapse')}
          </Button>
        </div>
      </div>
      <div className="o-grid c-minilist__filter-container u-padding-small">
        <FilterView isMiniListView />
      </div>
      <CatalogListView
        categories={categories}
        isMiniListView
        initiallyExpanded={[categoryId]}
        productGrpId={productGrpId}
        category={categoryId}
        autoScroll={false}
        hideQty={true}
      />
    </div>
  )
}

ProductGroupLeftNav.propTypes = {
  categoryId: PropTypes.string.isRequired,
  productGrpId: PropTypes.string.isRequired,
}
