import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import cn from "classnames";
import { selector_language, selector_productGroups } from "../duck";
import { TagPinContainer, parse } from "./Shared";
import RedirectLink from "./Navigation/RedirectLink";

export default function CatalogListViewBody({
  category,
  productGrpId,
  isMiniListView,
  hideQty
}) {
  const { language, productGroups } = useSelector(state => ({
    language: selector_language(state),
    productGroups: selector_productGroups(state, category.order)
  }));
  const pgArr = Object.values(productGroups);
  const categoryString = (category.description[language] || category.description.en)
  const parsedCategory = parse(category.description[language] || category.description.en)

  const stripHTML = (string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = string;
    return tmp.textContent || tmp.innerText || "";
  }

  const showParsedElement = (string) => stripHTML(string).length > 0 && stripHTML(string) !== "undefined";

  return (
    <Fragment>
      {!isMiniListView && showParsedElement(categoryString) && (
        <div className="o-grid u-1/1 u-border-bot c-cs-accordion__category">
          <div className="o-grid__item u-1/1 u-margin-bot-tiny">
            <div className="o-grid__item">{parsedCategory}</div>
          </div>
        </div>
      )}
      <div
        className={cn("o-grid u-1/1", {
          "c-cs-accordion--content": !isMiniListView,
          "c-cs-accordion--productgrp": isMiniListView
        })}
      >
        {pgArr.map(
          (productGroup, i) =>
            productGroup && (
              <div
                className={cn(
                  "o-grid__item u-1/1",
                  {
                    "c-cs-accordion--prodgrp_highlight":
                      productGroup.id === productGrpId
                  },
                  { "u-border-bot": pgArr.length !== i + 1 }
                )}
                key={productGroup.id}
              >
                <div
                  className={cn("o-grid u-1/1 u-margin-top-tiny u-margin-bot-tiny", {
                    "c-cs-accordion--prodgrp": isMiniListView
                  })}
                >
                  <div className="o-grid__item u-1/1 u-hide@tablet">
                    <TagPinContainer
                      showPin={productGroup.id}
                      pinOptions={{ id: productGroup.id }}
                    />
                  </div>
                  <div className="c-cs-accordion__pg-link o-grid__item o-grid__item--center u-1/1 u-3/4@tablet">
                    <RedirectLink
                      categoryId={category.id}
                      productGroupId={productGroup.id}
                      nestLevel={2}
                    >
                      <span className="u-text-bold">
                        {productGroup.name[language] || productGroup.name.en}
                      </span>
                    </RedirectLink>
                  </div>
                  <div className="o-grid__item o-grid o-grid--center o-grid--justify-right u-1/1 u-1/4@tablet u-show@tablet">
                    <TagPinContainer
                      showPin
                      showTags={productGroup.tags}
                      routine={productGroup?.routine}
                      productGroupId={productGroup?.id}
                      showQuantity={!hideQty}
                      pinOptions={{
                        id: productGroup.id,
                        className: {
                          "c-product-group-mini__pin": isMiniListView
                        }
                      }}
                      tagOptions={{
                        iconContainerClassName: "c-cs-mini-list__tags",
                        layout: "horizontal",
                        tagOrder: productGroup.tags,
                        isMiniListView,
                        className: {
                          "c-product-group-mini__taglist": isMiniListView
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            )
        )}
      </div>
    </Fragment>
  );
}

CatalogListViewBody.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.string.isRequired,
    description: PropTypes.shape({
      /* key value pairs with locale as key & name as value */
    }).isRequired
  }).isRequired,
  productGrpId: PropTypes.string.isRequired,
  isMiniListView: PropTypes.bool.isRequired
};
