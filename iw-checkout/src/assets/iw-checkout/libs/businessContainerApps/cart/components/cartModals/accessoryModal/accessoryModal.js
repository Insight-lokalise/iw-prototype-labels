import React from 'react'
import { connectToLocale, Image, Modal } from '@insight/toolkit-react'
import {
  makeProductDetailURL,
  getAppropriateProductPrice,
  productImageToRender,
} from '../../../../../models/Products/'

import { t } from '@insight/toolkit-utils'
import ProductTile from './ProductTile'
import { RecommendedCarousel } from '@insight/toolkit-react/lib/RecommendedCarousel/RecommendedCarousel'
import PartNumbers from '@insight/toolkit-react/lib/PartNumbers/PartNumbers'

export function AccessoryModal(props) {
  const webProduct = props.productDetails
  const { accessories } = props
  const sliderSettings = { mobile: 1, tablet: 2, desktop: 4 }
  const productTiles = () =>
    accessories.slice(0, 4).map((item, key) => {
      // need contract id
      const onAddToCart = props.addToCart.bind(null, [
        {
          contractID: props.contractId,
          isCES: props.isCES,
          materialID: item.materialId,
          materialIDKey: props.materialIDKey,
          quantity: 1,
          softwareContractId: props.softwareContractId,
          isLoggedOutDefaultUser: props.isLoggedOutDefaultUser,
        },
      ])
      const itemURL = makeProductDetailURL({
        materialId: item.materialId,
        mfrName: item.manufacturerName,
        mfrId: item.manufacturerPartNumber,
        description: item.description,
      })
      const itemImage =
        typeof item.image === 'string'
          ? item.image
          : productImageToRender(item.image)
      const accessoryPrice =
        props.isCES || props.isLoggedOutDefaultUser
          ? item.price
          : getAppropriateProductPrice(item.prices, item.contractDisplayInfo)
      const product = {
        currency: accessoryPrice.currency,
        href: itemURL,
        imgURL: itemImage,
        materialId: item.materialId,
        mfrId: item.manufacturerPartNumber,
        name: item.description,
        price: accessoryPrice.price,
        priceInclVat: accessoryPrice.priceInclVat,
        clickTrackingURL: item.clickTrackingURL,
      }

      return (
        <div key={item.materialId}>
          {/* <ProductTile className='Carousel__ProductTile'
                parentComponent='Accessories'
                name={{ description: item.description, href: itemURL }}
                price={getAppropriateProductPrice(item.prices, item.contractDisplayInfo)}
                isInCart={props.itemsInCartByContract.includes(item.materialId)}
                imageSRC={itemImage}
                materialId={item.materialId}
                onClick={onAddToCart} 
                isEMEA={props.isEMEA}    
            /> */}
          <ProductTile
            color={'primary'}
            fullWidth
            href={itemURL}
            parentComponent="Accessories"
            product={product}
            materialId={item.materialId}
            showVAT={props.isEMEA}
            isInCart={props.itemsInCartByContract.includes(item.materialId)}
            onClick={onAddToCart}
            key={key}
            isStockAndPriceDisabled={props.isStockAndPriceDisplayDisabled}
          />
        </div>
      )
    })

  const accessoryImage = productImageToRender(webProduct.image)
  return (
    <Modal
      size="medium"
      isOpen={props.showAccessoryDialog}
      onClose={props.onHide}
      overlayclassname="c-modal-overlay"
      className="c-accessory-modal"
    >
      <Modal.Header onClick={props.onHide}>
        <h3>{t('Add accessories')}</h3>
      </Modal.Header>
      <Modal.Body>
        <section>
          {props.hasAccessories ? (
            <div className="o-grid">
              {/* <div className="row parent-product parent-product__border">
                    <div className="columns shrink">
                      <IWImage className='parent-product__img' src={accessoryImage} alt={`${webProduct.description}`} />
                    </div>
                    <div className="columns">
                      <h4 className="parent-product__name">{webProduct.description}</h4>
                      <div className="parent-product__desc">{webProduct.longDescription}</div>
                    </div>
                  </div> */}
              <div className="o-grid__item u-1/1">
                <div className="o-grid">
                  <div
                    className="o-grid__item u-2/6 u-1/6@desktop"
                    data-testid="item-image"
                  >
                    {accessoryImage && (
                      <Image
                        className="c-accessory-modal__image"
                        alt={`${webProduct.description}`}
                        image={accessoryImage}
                      />
                    )}
                  </div>
                  <div className="o-grid__item u-4/6 u-5/6@desktop">
                    <div className="o-grid">
                      <div
                        className="o-grid__item u-1/1 c-accessory-modal__description"
                        data-testid="item-description"
                      >
                        <div className="u-text-bold u-margin-bot-tiny">
                          {webProduct.description}
                        </div>
                        <div className="o-grid u-3/5@desktop u-1/1 c-accessory-modal__partNumbers u-margin-bot">
                          <PartNumbers
                            inline
                            insightPart={webProduct.materialId}
                            mfrPart={webProduct.manufacturerPartNumber}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div  className="o-grid__item u-1/1 c-accessory-modal__recommendation">
                <div className="o-grid__item u-1/1 c-accessory-modal__sub-header">
                  {t('Recommended items')}
                </div>
                <RecommendedCarousel
                  settings={sliderSettings}
                  productTiles={productTiles}
                />
              </div>
              
            </div>
          ) : (
            <div className="o-grid">
              <div className="o-grid__item parent-product">
                <p>{t('Accessories not available for this product.')}</p>
              </div>
            </div>
          )}
        </section>
      </Modal.Body>
    </Modal>
  )
}

export default connectToLocale(AccessoryModal)
