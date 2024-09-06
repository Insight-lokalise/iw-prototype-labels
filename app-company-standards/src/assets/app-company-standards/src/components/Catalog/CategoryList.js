import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux';

import { t } from '@insight/toolkit-utils'
import CatalogList from './CatalogList'
import CategoryListHeader from './CategoryListHeader'
import { selector_categories, selector_categoryOrder } from '../../duck'

export default function CategoryList(props) {
  const droppableId = 'categories'
  const { children, dndFunctions, dndState, preselection } = props
  const itemDictionary = useSelector(selector_categories)
  const itemOrder = useSelector(selector_categoryOrder)

  const [expandAll, setExpandAll] = useState(false)

  return (
    <div className="o-grid ">
      <div className="o-grid__item u-1/1">
        <CategoryListHeader
          expandAll={expandAll}
          toggleExpandAll={() => {
            setExpandAll(!expandAll)
          }}
        />
      </div>
      <div className="o-grid__item u-1/1">
        {Object.keys(itemDictionary).length > 0 ?
            <CatalogList
              currentItemOrder={dndState[droppableId] || itemOrder}
              dndFunctions={dndFunctions}
              droppableId={droppableId}
              expandAll={expandAll}
              initialItemOrder={itemOrder}
              itemDictionary={itemDictionary}
              nestLevel={0}
              preselection={preselection}
            >
              {children}
            </CatalogList>
          :
            <div className="c-category-empty">
              <p className="u-text-bold">{t("There are no categories yet. Click Add new category to begin.")}</p>
            </div>

        }

      </div>
    </div>
  )
}

CategoryList.propTypes = {
  children: PropTypes.node.isRequired,
  dndState: PropTypes.shape({}).isRequired,
  dndFunctions: PropTypes.shape({}).isRequired,
  preselection: PropTypes.string.isRequired,
}
