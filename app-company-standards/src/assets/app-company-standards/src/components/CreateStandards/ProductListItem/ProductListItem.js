import React from "react"
import PropTypes from "prop-types"
import cn from 'classnames'
import { Field, Product, QuantitySelector } from "@insight/toolkit-react"
import getInObject from '@insight/toolkit-utils/lib/helpers/getInObject'
import { t } from '@insight/toolkit-utils'
import Icon from "@insight/toolkit-react/lib/Icon/Icon"
import { ChooseImage, CustomDescription, CustomDescriptionText, ShowOnWeb, DiscontinuedProductIcon } from './index'
import DeviceEnroll from "./DeviceEnroll"

export default function ProductListItem(props) {
  const {
    draggableProvided,
    isNonConfig,
    locale,
    toggleRemoveProduct,
    deleteStatus,
    product,
    productSetType,
    updateProduct,
    isShared
  } = props;
  const hasSearchProduct = !!product.searchProduct;
  const hasEnrollment = hasSearchProduct && product.searchProduct.enrollable
  const noneOption = productSetType === 'SINGLEWITHNONE' && product.materialId === 'NONE'
  const isLoggedIn = getInObject(window, ['Insight', 'isLoggedin'], false)
  const userInfo = getInObject(window, ['Insight', 'userInformation'], {})
  const salesOrg = isLoggedIn ? userInfo?.salesOrg : ''
  const isUSSalesOrg = ["2400", "2500"].includes(salesOrg);

  return (
    <div
      className="c-cs-product-list__item o-grid u-margin-bot u-padding-bot"
      ref={draggableProvided.innerRef}
      {...draggableProvided.draggableProps}
    >
      <div
        className="o-grid__item o-grid__item--shrink"
        {...draggableProvided.dragHandleProps}
      >
        <Icon icon="move" className={cn({"c-cs-product-list__draggable-icon": !noneOption})} />
      </div>
      <div className="o-grid__item">
        <div className="o-grid o-grid--justify-between">
          <div className="o-grid__item u-2/3 u-padding-right-small">
            {
              noneOption ?
              (
                <div className="o-grid">
                  <div className="o-grid__item u-1/1 u-margin-left">
                    <div>
                      <Icon icon="forbidden" />
                      {t('Decline all products from this list')}
                    </div>
                  </div>
                </div>
              )
              :(<div>
                <Product className="o-grid">
                  <div className="o-grid__item u-1/5 u-margin-left">
                    <Product.Image
                      alt={hasSearchProduct ? product.searchProduct.name : "NA"}
                      image={
                        product.customImage ||
                        (hasSearchProduct ? product.searchProduct.imageUrl : "NA")
                      }
                    />
                    <div className="o-grid o-grid--justify-center">
                      <ChooseImage
                        hideGallery
                        product={product}
                        isShared={isShared}
                        updateProduct={updateProduct}
                        className="o-grid__item u-1/1"
                      />
                    </div>
                  </div>
                  <div className="o-grid__item">
                    <div className="o-grid">
                      <div className="o-grid__item u-1/1">
                        <Product.Info.Name>
                          {hasSearchProduct
                            ? product.searchProduct.description
                            : t("This part is no longer available for purchase and a description is not available. Please enter a replacement or remove this part.")}
                        </Product.Info.Name>
                      </div>
                      <Product.Info.PartNumbers
                        className="u-font-size-tiny"
                        insightPart={product.materialId}
                        mfrPart={
                          hasSearchProduct
                            ? product.searchProduct.manufacturerId
                            : "NA"
                        }
                      />
                    </div>
                  </div>
                </Product>
                <ShowOnWeb
                  product={product}
                  hasSearchProduct={hasSearchProduct}
                />
                <div className="c-cs-product-list__custom-description o-grid o-grid--justify-between">
                  <CustomDescription
                    product={product}
                    updateProduct={updateProduct}
                    className="o-grid__item u-1/3"
                  />
                  <DeviceEnroll
                    product={product}
                    updateProduct={updateProduct}
                    className="o-grid__item u-1/3"
                    hasEnrollment={hasEnrollment}
                    isUSSalesOrg = {isUSSalesOrg}
                  />
                  <DiscontinuedProductIcon
                    product={product}
                    className="o-grid__item u-1/3"
                  />
                  <CustomDescriptionText
                    product={product}
                    updateProduct={updateProduct}
                    className="o-grid__item u-1/1"
                  />
                </div>
              </div>
            )}
          </div>
          <div className="o-grid__item u-1/3">
            <div className="c-cs-product-list__interactives o-grid o-grid--justify-between">
              <div className="o-grid__item o-grid__item--shrink u-1/4 o-grid o-grid--justify-center">
                {
                  !noneOption && (
                  <Field
                    inputClassName="c-cs-admin__product-list-checkbox"
                    disabled={
                    isNonConfig ||
                    (hasSearchProduct &&
                      product.searchProduct.configurable === false)
                  }
                    checked={product.config}
                    fieldComponent={"Checkbox"}
                    handleChange={() => {
                    updateProduct({ ...product, config: !product.config });
                  }}
                    key={"configuration"}
                    name={"configuration"}
                  />
                )}
              </div>
              <div className="o-grid__item o-grid__item--shrink u-1/4 o-grid o-grid--justify-center">
                <Field
                  inputClassName="c-cs-admin__product-list-checkbox"
                  checked={product.preSelect}
                  disabled={productSetType === "MANDATORY"}
                  fieldComponent={"Checkbox"}
                  handleChange={() => {
                    updateProduct({
                      ...product,
                      preSelect: !product.preSelect
                    });
                  }}
                  key={"preSelected"}
                  name={"preSelected"}
                />
              </div>
              <div className="o-grid__item o-grid__item--shrink u-1/4 o-grid o-grid--justify-center">
                {
                  !noneOption && (
                  <QuantitySelector
                    size="small"
                    id="qty"
                    onChange={val => {
                      updateProduct({ ...product, qty: val });
                    }}
                    value={product.qty}
                  />
                )}
              </div>
              <div className="o-grid__item o-grid__item--shrink u-1/4 o-grid o-grid--justify-center">
                {
                  !noneOption && (
                  <Field
                    inputClassName="c-cs-admin__product-list-checkbox"
                    checked={deleteStatus}
                    fieldComponent={"Checkbox"}
                    handleChange={() => {
                      toggleRemoveProduct(product.id);
                    }}
                    key={"delteItem"}
                    name={"delteItem"}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ProductListItem.propTypes = {
  deleteStatus: PropTypes.bool.isRequired,
  product: PropTypes.shape({
    config: PropTypes.bool.isRequired,
    customDescription: PropTypes.shape({}).isRequired,
    customImage: PropTypes.string,
    discontinued: PropTypes.bool.isRequired,
    // discontinuedOn: PropTypes.number.isRequired,
    hasCustomDescription: PropTypes.bool,
    hideStock: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
    // lastEditedBy: PropTypes.string.isRequired,
    // lastEditedDate: PropTypes.number.isRequired,
    materialId: PropTypes.string.isRequired,
    preSelect: PropTypes.bool.isRequired,
    qty: PropTypes.number.isRequired,
    searchProduct: PropTypes.shape({
      // categoryCode: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      imageUrl: PropTypes.string.isRequired,
      manufacturerId: PropTypes.string.isRequired,
      materialId: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      configurable: PropTypes.bool,
      showOnWeb: PropTypes.bool,
      enrollable: PropTypes.bool,
      // stock: PropTypes.number.isRequired,
      // stockMessage: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  toggleRemoveProduct: PropTypes.func.isRequired,
  updateProduct: PropTypes.func.isRequired,
  productSetType: PropTypes.string.isRequired
};
