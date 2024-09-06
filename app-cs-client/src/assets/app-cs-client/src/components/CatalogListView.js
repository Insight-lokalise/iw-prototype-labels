import React, { Fragment, useRef, useState } from 'react'
import PropTypes from "prop-types";
import { Accordion, Button, Icon, Tooltip } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import { selector_filteredCategories, selector_language } from "../duck";
import CatalogListViewHeaders from './CatalogListViewHeaders'
import CatalogListViewBody from './CatalogListViewBody'
import CategoryHeaderView from './CategoryHeaderView'
import RedirectToTarget from "./Navigation/RedirectToTarget";
import CatalogTileView from "./CatalogTileView";
import CategoryTileView from "./CategoryTileView";

export default function CatalogListView(props) {
  const { autoScroll, category, initiallyExpanded, history, productGrpId, productGroups, isMiniListView, hideQty } = props

  const { filteredCategories, autoExpanded } = useSelector(state => {
    const {categories:filteredCategories, autoExpanded} =  selector_filteredCategories(state)
    return ({
      filteredCategories,
      autoExpanded,
    })
  });

  const backToCatalog = () => {
    const target = RedirectToTarget({ targetLevel: 0 })
    history && history.push(target)
  }

  const [isExpandClicked, setIsExpandClicked] = useState(false)

  const { language } = useSelector(state => ({
    language: selector_language(state),
  }));

  const contextRef = useRef(null)

  const setCallbackRefs = context => {
    contextRef.current = context
  }

  const toggleExpanded = () => {
    setIsExpandClicked(!isExpandClicked)
    isExpandClicked ? contextRef.current.collapseAll() : contextRef.current.expandAll();
  }

  const updateExpanded = () => {
    const categoryIds = contextRef.current.getExpanded()
    const expandedIds = Object.keys(categoryIds).reduce((acc, curr) => {
      if (!!categoryIds[curr]) {
        acc.push(curr)
      }
      return acc
    }, [])
    const isExpandClicked = (expandedIds.length === filteredCategories.length)
    setIsExpandClicked(isExpandClicked)
  }

  const renderAccordionItems = (categories, getItemProps) => {
    const arr = categories.map(listCategory => {
      const fallbackLabel = listCategory.name['en']
      const label = listCategory.name[language] || fallbackLabel

      return (
        <Accordion.Item
          {...getItemProps()}
          autoScroll={autoScroll && filteredCategories.length > 1}
          height={160}
          key={listCategory.id}
          extraAction={
            <CatalogListViewHeaders
              category={listCategory}
              isMiniListView={isMiniListView}
            />
          }
          id={listCategory.id}
          label={
            <Tooltip position="bottom" content={label}>
              <span>{label}</span>
            </Tooltip>
          }
          className={{
            action: "c-cs-list-view__action o-grid__item u-1/6",
            control: cn(
              `o-grid o-grid--justify-between o-grid--center c-cs-accordion__item--${
                isMiniListView ? "huge" : "large"
              }`,
              {
                "c-cs-accordion__category-highlight":
                  listCategory.id === category
              },
              { "c-cs-accordion__category-mini-list": isMiniListView }
            ),
            trigger: "o-grid__item u-5/6",
            button: cn("u-margin-right-small", {
              "u-truncate": !isMiniListView
            })
          }}
        >
          <CatalogListViewBody
            category={listCategory}
            productGrpId={productGrpId}
            isMiniListView={isMiniListView}
            hideQty={hideQty}
          />
        </Accordion.Item>
      );
    })
    return arr
  }


  return (
    <div className="o-grid">
      <div className="o-grid__item c-cs-showtileview">
        {productGroups ? (
          <CategoryTileView
            category={category}
            history={history}
            productGroups={productGroups}
          />
        ) : (
          <CatalogTileView history={history} />
        )}
      </div>
      <div className="o-grid__item c-cs-showlistview">
        {!isMiniListView && (
          <CategoryHeaderView backToCatalog={backToCatalog} />
        )}
        <div className="u-width-shrink@tablet u-margin-bot c-cs-product-set__expand-all">
          <Button
            color="link"
            className="c-button--inline-link"
            onClick={toggleExpanded}
          >
            {isExpandClicked ? t("Collapse all") : t("Expand all")}
            <Icon icon="swap" className="c-icon--swap" />
          </Button>
        </div>
        <Accordion
          allowMultiple
          autoScroll={autoScroll && filteredCategories.length > 1}
          contextRef={setCallbackRefs}
          initiallyExpanded={[...initiallyExpanded, ...autoExpanded]}
          onToggle={updateExpanded}
        >
          {({ getItemProps }) =>
            renderAccordionItems(filteredCategories, getItemProps)
          }
        </Accordion>
      </div>
    </div>
  );
}

CatalogListView.propTypes = {
  autoScroll: PropTypes.bool,
  category: PropTypes.shape({ /* key value pairs */ }).isRequired,
  initiallyExpanded: PropTypes.arrayOf(PropTypes.string),
  productGrpId: PropTypes.string,
  isMiniListView: PropTypes.bool,
}

CatalogListView.defaultProps = {
  initiallyExpanded: [],
  productGrpId: '',
  isMiniListView: false,
  autoScroll: true,
}
