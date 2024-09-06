import React, { Fragment, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { t } from "@insight/toolkit-utils";

import {
  LIST_VIEW,
  selector_categories,
  selector_filteredCategories,
  selector_filteredProductGroups,
  selector_userSettings,
  selector_webGroupSettings
} from "../duck";
import RedirectToTarget from './Navigation/RedirectToTarget'
import CatalogListView from "./CatalogListView";
import CatalogTileView from "./CatalogTileView";

export default function CatalogView(props) {
  const { filteredCategories, filteredProductGroups, hasCategories, userSettings, webGroupSettings } = useSelector(state => {
    const { categories: filteredCategories, autoExpanded } =  selector_filteredCategories(state)
    return {
      filteredCategories,
      autoExpanded,
      filteredProductGroups: selector_filteredProductGroups(state),
      hasCategories: selector_categories(state).length > 0,
      userSettings: selector_userSettings(state),
      webGroupSettings: selector_webGroupSettings(state)
    }
  });

  useEffect(() => {
    props.prevLocation === null && hasCategories && redirectTo()
  }, [])

  const categoryPage = filteredCategories.length === 1 && filteredProductGroups.length > 1
  const productGroupsPage = filteredCategories.length === 1 && filteredProductGroups.length === 1

  const redirectTo = () => {
    const targetLevel = (productGroupsPage && 2) || (categoryPage && 1) || 0
    const categoryId = filteredCategories && filteredCategories[0].id
    const productGroupId = filteredProductGroups[0].id
    const redirectPath = RedirectToTarget({ categoryId, productGroupId, targetLevel })
    props.history.location.pathname !== redirectPath && props.history.push(redirectPath)
  }

  const {disableViewChange, defaultView} = webGroupSettings
  const { viewMode } = userSettings
  const viewType = disableViewChange ? defaultView : (viewMode || defaultView)

  return (
    <Fragment>
      {hasCategories ? (viewType === LIST_VIEW ?
        <CatalogListView history={props.history} /> :
        <CatalogTileView history={props.history} />)
        : t('You do not have any Categories created. Please contact your account representative for assistance.')}
    </Fragment>
  )
}
