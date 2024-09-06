import React from "react";
import PropTypes from "prop-types";
import { t } from '@insight/toolkit-utils'

import ProductListHeader from "./ProductListHeader";
import ProductListItem from "./ProductListItem/ProductListItem";
import DragAndDropList from '../Catalog/DragAndDropList'
import DragAndDropManager from '../Catalog/DragAndDropManager'

export default function ProductList(props) {
  const {
    dndState,
    dndFunctions,
    droppableId,
    isNonConfig,
    locale,
    toggleRemoveProduct,
    productsState,
    productSetType,
    isShared,
    reorderProducts,
    updateProduct
  } = props;
  return (
    <div className="o-grid u-padding-top u-margin-bot">
      <div className="o-grid__item u-1/1">
        <h2 className="u-h5">{t("Edit products")}</h2>
      </div>
      <div className="o-grid__item u-1/1">
        <ProductListHeader productSetType={productSetType} />
        {productsState.order.length > 0 ? (
          <DragAndDropList 
            droppableId={droppableId} 
            itemOrder={productsState.order} 
            type={'productItem'} 
            isShared={isShared}
            {...dndFunctions}
          >
            {productsState.order.map(productId => {
              const product = productsState.productDictionary[productId];
              return ( 
                <ProductListItem
                  id={productId}
                  isNonConfig={isNonConfig}
                  deleteStatus={productsState.deleteMap[productId]}
                  key={productId}
                  locale={locale}
                  product={product}
                  toggleRemoveProduct={toggleRemoveProduct}
                  updateProduct={updateProduct}
                  productSetType={productSetType}
                  isShared={isShared}
                />
              );
            })}
          </DragAndDropList>
        ) : (
          <div className="u-font-size-tiny">
            {
              t("There are currently no products in this product set. Add products in the section above.")
            }
          </div>
        )}
      </div>
    </div>
  );
}

ProductList.propTypes = {
  draggableProvided: PropTypes.func.isRequired,
  isNonConfig: PropTypes.bool,
  productsState: PropTypes.shape({
    order: PropTypes.arrayOf(PropTypes.string).isRequired,
    productDictionary: PropTypes.shape({}).isRequired
  }).isRequired,
  reorderProducts: PropTypes.func.isRequired,
  toggleRemoveProduct: PropTypes.func.isRequired,
  updateProduct: PropTypes.func.isRequired,
  productSetType: PropTypes.string.isRequired
};
