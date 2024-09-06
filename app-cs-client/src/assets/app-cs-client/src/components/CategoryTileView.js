import React, { Fragment } from 'react'
import { Button, Icon } from "@insight/toolkit-react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { t } from "@insight/toolkit-utils";
import { Tile, ToggleView, TagPinContainer, parse } from './Shared'
import { chunkArr, chunkSize } from '../lib/helpers'
import {
  selector_language,
} from "../duck";
import FilterView from "./FilterView";
import RedirectToTarget from "./Navigation/RedirectToTarget";

export default function CategoryTileView({ category, history, productGroups }) {
  const { language } = useSelector(state => ({
    language: selector_language(state)
  }));

  const backToCatalog = () => {
    const target = RedirectToTarget({ targetLevel: 0 })
    history.push(target)
  }

  return (
    <Fragment>
      <div className="o-grid">
        <div className="o-grid__item u-1/1">
          <Button
            className="c-cs-back--button u-font-size-small"
            color="link"
            onClick={backToCatalog}
          >
            <Icon icon="arrow-dropdown" className="c-cs-back--icon" />{" "}
            {t("Back to catalog")}
          </Button>
        </div>
      </div>
      <div className="o-grid">
        <div className="o-grid__item u-1/1">
          <div className="o-grid o-grid--justify-between">
            <div className="o-grid__item u-3/4">
              <h2 className="u-margin-bot-small u-h4">
                {category && (category.name[language] || category.name["en"])}
              </h2>
            </div>
            <div className="o-grid__item u-1/4">
              <div className="o-grid o-grid--justify-right">
                <div className="o-grid__item u-1/2">
                  <div className="o-grid u-show@tablet o-grid--full-height o-grid--justify-center o-grid--center">
                    <FilterView rightJustify />
                  </div>
                </div>
                <ToggleView backToCatalog={backToCatalog} />
              </div>
            </div>
            <div className="o-grid__item u-1/1 u-hide@tablet">
              <div className="o-grid">
                <FilterView />
              </div>
            </div>
          </div>
        </div>
        <div className="o-grid__item u-1/1 u-margin-bot-small">
          <TagPinContainer
            showTags={category && category.tags}
            tagOptions={{
              justification: "left",
              layout: "horizontal",
              tagOrder: category && category.tags
            }}
          />
        </div>
        <div className="o-grid__item u-1/1 u-border-bot">
          {category &&
            parse(category.description[language] || category.description["en"])}
        </div>
      </div>
      <div className="o-grid">
        {Object.values(productGroups).length > 0 &&
          chunkArr(Object.values(productGroups), chunkSize()).map(chunk => (
            <div className="o-grid__item u-1/1 c-cs-tile__row">
              <div className="o-grid">
                {chunk.map(productGroup => (
                  <Tile
                    categoryId={category.id}
                    key={productGroup.id}
                    nestLevel={2}
                    productGroupId={productGroup.id}
                    showQty={productGroup.routine}
                    tile={productGroup}
                  />
                ))}
              </div>
            </div>
          ))}
      </div>
    </Fragment>
  );
}

CategoryTileView.propTypes = {
  category: PropTypes.shape({
    description: PropTypes.shape({
      /* key value pairs with locale as key & name as value */
    }).isRequired,
    name: PropTypes.shape({
      /* key value pairs with locale as key & name as value */
    }).isRequired,
    tags: PropTypes.arrayOf(PropTypes.string)
  }).isRequired
}

