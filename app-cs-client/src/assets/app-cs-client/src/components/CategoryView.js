import React from 'react'
import { useSelector } from "react-redux";

import {
  TILE_VIEW,
  selector_category,
  selector_filteredProductGroups,
  selector_userSettings
} from "../duck";
import CatalogListView from "./CatalogListView";
import CategoryTileView from './CategoryTileView'

const CategoryView = props => {
  const searchPathMatch = props.match.params.catId === "search"
  const { category, filteredProductGroups, userSettings } = useSelector(state => ({
    category: selector_category(state, props.match.params.catId),
    filteredProductGroups: searchPathMatch ? {} : selector_filteredProductGroups(state, selector_category(state, props.match.params.catId).order),
    userSettings: selector_userSettings(state)
  }));

  return (
    !searchPathMatch &&
    (userSettings.viewMode === TILE_VIEW ?
      <CategoryTileView category={category} history={props.history} productGroups={filteredProductGroups} />
      : <CatalogListView category={category} history={props.history} initiallyExpanded={[category.id]} productGroups={filteredProductGroups} />)
  )
}

export default CategoryView;
