import React, { Fragment } from 'react'
import {useSelector} from "react-redux";
import { Tile } from './Shared'
import CategoryHeaderView from './CategoryHeaderView'
import {
  selector_filteredCategories,
} from "../duck";
import RedirectToTarget from "./Navigation/RedirectToTarget";
import { filterCategoriesByTags, chunkArr, chunkSize } from "../lib/helpers";

export default function CatalogTileView({history}) {
  const { filteredCategories, autoExpanded } = useSelector(state => {
    const {categories:filteredCategories, autoExpanded} =  selector_filteredCategories(state)
    return ({
      filteredCategories,
      autoExpanded
    })
  });

  const backToCatalog = () => {
    const target = RedirectToTarget({ targetLevel: 0 })
    history.push(target)
  }

  return (
    <Fragment>
      <CategoryHeaderView backToCatalog={backToCatalog} />
      <div className="o-grid u-1/1">
        {filteredCategories.length > 0 &&
          chunkArr(filteredCategories, chunkSize()).map(chunk => (
            <div className="o-grid__item u-1/1 c-cs-tile__row">
              <div className="o-grid">
                {chunk.map(category => (
                  <Tile
                    categoryId={category.id}
                    key={category.id}
                    nestLevel={1}
                    showQty={false}
                    tile={category}
                  />
                ))}
              </div>
            </div>
          ))}
      </div>
    </Fragment>
  );
}

