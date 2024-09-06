import React from 'react'
import PropTypes from 'prop-types'

import DragAndDropManager from './DragAndDropManager'
import CategoryList from './CategoryList'
import ProductGroupList from './ProductGroupList'
import ProductSetList from './ProductSetList'

export default function Catalog({ preselectionState }) {
  return (
    <div className="o-box o-grid u-padding-top-none">
      <div className="o-grid__item u-1/1">
        <DragAndDropManager>
          {(dndState, { ...dndFunctions }) => (
            <CategoryList
              dndState={dndState}
              dndFunctions={dndFunctions}
              preselection={preselectionState.categoryId}
            >
              { category => (
                <ProductGroupList
                  dndState={dndState}
                  dndFunctions={dndFunctions}
                  preselection={preselectionState.productGroupId}
                  droppableId= {`productGroupOfCategory-${category.id}`}
                  category={category}
                >
                  { productGroup => (
                    <ProductSetList
                      dndState={dndState}
                      dndFunctions={dndFunctions}
                      preselection={preselectionState.productSetId}
                      category={category}
                      productGroup={productGroup}
                    />
                  )}
                </ProductGroupList>
              )}
            </CategoryList>
          )}
        </DragAndDropManager>
      </div>
    </div>
  )
}

Catalog.propTypes = {
  navigateOnSearch: PropTypes.func,
  preselectionState: PropTypes.shape({
    categoryId: PropTypes.string,
    productGroupId: PropTypes.string,
    productSetId: PropTypes.string,
  }),
}

Catalog.defaultProps = {
  navigateOnSearch: () => { },
  preselectionState: {
    categoryId: '',
    productGroupId: '',
    productSetId: '',
  },
}
