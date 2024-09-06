import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import cloneDeep from "lodash/cloneDeep"
import PropTypes from "prop-types";
import { Button, Image, Loading, Panel, ButtonGroup, Message } from "@insight/toolkit-react";
import { t } from '@insight/toolkit-utils';
import cn from 'classnames'

import { TagPinContainer, Toggle, parse } from "./Shared"
import ProductSetView from './ProductSetView'
import AddToCartModal from './AddToCartModal'
import {
  getProductSets,
  selector_isPurchasingPopupEnabled,
  selector_fetchProductSetsPending,
  selector_isViewPriceEnabled,
  selector_language,
  selector_productSets,
  selector_isEMEA,
  selector_userSettings,
  toggleShowPictures,
  selector_isStockAndPriceDisplay
} from "../duck";
import { addProductSetsToCart, getCartItemCount } from "api";
import { getContractLineItems, stripNONE } from './Services/productGroupBundle';

export default function ProductGroupDetailView({ category, productGroup }) {
  const dispatch = useDispatch()
  const { language, defaultProductSets, showAddToCartPopup, isViewPriceEnabled, fetchProductSetsPending, userSettings, isEMEA, isStockAndPriceDisplay } = useSelector(state => ({
    language: selector_language(state),
    defaultProductSets: selector_productSets(state, productGroup.id),
    showAddToCartPopup: selector_isPurchasingPopupEnabled(state),
    isViewPriceEnabled: selector_isViewPriceEnabled(state),
    isStockAndPriceDisplay: selector_isStockAndPriceDisplay(state),
    fetchProductSetsPending: selector_fetchProductSetsPending(state),
    isEMEA: selector_isEMEA(state),
    userSettings: selector_userSettings(state),
  }));

  const [productSets, setProductSets] = useState(null)
  const [cart, setCart] = useState({})
  const [hasItemsInSessionCart, setHasItemsInSessionCart] = useState(false)
  const [isAddPending, setIsAddPending] = useState(false)
  const [cartData, setCartData] = useState(null)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const [bundleQuantity, setBundleQuantity] = useState(1)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (defaultProductSets) {
      const productSetsCopy = cloneDeep(defaultProductSets)
      setProductSets(productSetsCopy)
      setCartSelections(productSetsCopy)
    } else {
      dispatch(getProductSets(productGroup.id))
    }
    window.addEventListener('scroll', scrollHandler)
    return () => {
      window.removeEventListener('scroll', scrollHandler)
    }
  }, [defaultProductSets])

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(
      () => setMessage(''),
      5000
    )
    return () => clearTimeout(timer)
  }, [message])

  const setCartSelections = (pset) => {
    const newCart = pset.reduce((acc, curr) => {
      const setContents = getContractLineItems(curr.contract, curr.items)
      if (setContents) acc[curr.id] = setContents
      return acc
    }, {})
    setCart(newCart)
  }

  useEffect(() => {
    getCartItemCount().then(count => setHasItemsInSessionCart(count > 0))
  }, [])

  const scrollHandler = () => {
    const visible = 0 < window.pageYOffset;
    setVisible(visible)
  }

  const hasValidCartSelections = () => {
    // return value is an map of product set ID with errors. false --> general criteria not met
    // true --> product set criteria not met because of unavailable parts
    const missing = productSets.reduce((acc, pSet) => {
      const { type, id, contract } = pSet
      switch (type) {
        case "MANDATORY": {
          if (id in cart) {
            const cartItems = cart[id]
            contract.map(({ lineitems }) => {
              const missingItems = lineitems.filter(({ materialId }) => !(materialId in cartItems))
              if (missingItems.length > 0) {
                const unavailable = missingItems.some(({ callForPrice, showPriceOnWeb, discontinued, showBuyButton }) => callForPrice || !showPriceOnWeb || discontinued || !showBuyButton)
                acc[id] = unavailable
              }
            })
          } else {
            acc[id] = hasSomeUnavailable(contract)
          }
        }
        case "SINGLE": {
          if (!(id in cart)) {
            contract.map(({ lineitems }) => {
              if (lineitems.length === 1) {
                acc[id] = lineitems.some(({ callForPrice, showPriceOnWeb, discontinued, showBuyButton }) => callForPrice || !showPriceOnWeb || discontinued || !showBuyButton)
              } else {
                acc[id] = false
              }
            });
          }
        }
        case "SINGLEWITHNONE": {
          if (!(id in cart)) {
            contract.map(({ lineitems }) => {
              if (lineitems.length === 1) {
                acc[id] = lineitems.some(({ callForPrice, showPriceOnWeb, discontinued, showBuyButton }) => callForPrice || !showPriceOnWeb || discontinued || !showBuyButton)
              } else {
                acc[id] = false
              }
            });
          }
        }
      }
      return acc
    }, {})
    setErrors(missing)
    return Object.keys(missing).length === 0;
  }

  const fetchData = async () => {
    const contractToUse = (productSets && productSets.length > 0) ? productSets[0].contract[0] : null
    setIsAddPending(true)
    const { data } = await addProductSetsToCart({
      language,
      bundleQuantity,
      cart: stripNONE(cart),
      productGroupId: productGroup.id,
      contractId: !!contractToUse ? contractToUse.id : ""
    })
    setHasItemsInSessionCart(true)
    setCartData(data)
  }
  const resetProductSetSelections = () => {
    const productSetsCopy = cloneDeep(defaultProductSets)
    setProductSets(null)
    setTimeout(() => {
      setProductSets(productSetsCopy)
      setCartSelections(productSetsCopy)
    }, 100)
  }

  const addToCart = () => {
    if (!hasValidCartSelections()) { return false }
    if (Object.keys(cart).length === 0) {
      // no items to add, Add to cart button will be disabled
      return false
    }
    setCartData(null)
    if (showAddToCartPopup) {
      setModalIsOpen(true)
      fetchData().then(() => {
        window.postMessage({ type: 'cart:updated' }, window.location.origin)
        setIsAddPending(false)
      })
    } else {
      fetchData().then(() => {
        window.postMessage({ type: 'cart:updated' }, window.location.origin)
        setIsAddPending(false)
        setMessage(t("Added to cart"))
      })
    }
  }

  const closeModal = () => {
    setModalIsOpen(false)
    resetProductSetSelections()
  }

  const scrollToTop = () => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  function onChange(contract, set) {
    const { id, items } = set;
    const setContents = getContractLineItems(contract, items)
    if (setContents) setCart({ ...cart, [id]: setContents })
    else {
      const { [id]: deadId, ...newCart } = cart
      setCart(newCart)
    }
  }

  const isDisableAddToCart = !isViewPriceEnabled || isAddPending || (Object.keys(stripNONE(cart)).length === 0)
  const addToCartType = isAddPending ? "secondary" : "primary"
  let firstPSetWithError = false // to track first product set with error
  const parsedGroupDescription = (
    productGroup.description[language] || productGroup.description['en']
  ) ? (
    parse(productGroup.description[language] || productGroup.description['en'])
  ) : null
  return (
    <Fragment>
      {(!productSets || fetchProductSetsPending) ?
        <div className="u-text-center"><Loading /></div>
        : (
          <Fragment>
            {visible && (
              <div className="u-text-right u-margin-top c-cs-backtotop--button">
                <Button size="large" icon="arrow-up-circled--sharp" color="secondary-link-turqouise" iconPosition="top" onClick={() => scrollToTop()}>{t('Top')}</Button>
              </div>
            )}
            {modalIsOpen && <AddToCartModal closeModal={closeModal} modalIsOpen={modalIsOpen} cartData={cartData} isEMEA={isEMEA} isStockAndPriceDisplay={isStockAndPriceDisplay} />}
            <Panel className='c-container c-product-set__header u-margin-bot--small u-padding-top-small u-padding-bot-small'>
              <div className={cn("o-grid c-cs-client__productgrp-header", { "u-border-bot": !productGroup.hideInfo })}>
                <div className="o-grid__item u-3/4">
                  {!productGroup.hideInfo &&
                    <h4 className="u-padding-bot-tiny u-padding-top-tiny u-text-bold u-margin-bot-none">{category && (category.name[language] || category.name['en'])}</h4>
                  }
                </div>
                <div className="o-grid__item u-1/4 u-show@tablet">
                  <Toggle label={t("Show images")} isToggled={userSettings.showPictures} onClick={() => dispatch(toggleShowPictures())} ariaLabel={t(`Click to toggle product images. Current state is ${userSettings.showPictures ? "on" : "off"}.`)} />
                </div>
              </div>
              {!productGroup.hideInfo &&
                <div className="o-grid o-grid--justify-center">
                  {productGroup.imageUrl && (
                    <div className="o-grid__item u-1/2 u-1/4@desktop u-1/4@tablet">
                      <Image className='c-cs-product__image' image={productGroup.imageUrl} alt={productGroup.name[language]} />
                    </div>
                  )}
                  <div className={cn("o-grid__item u-1/1 c-cs-client__productgrp-header--description", { "u-3/4@desktop u-3/4@tablet": productGroup.imageUrl })}>
                    <div className="u-padding-top-small u-padding-bot-small">
                      <h4 className="u-margin-none u-text-bold">{productGroup.name[language] || productGroup.name['en']}</h4>
                    </div>
                    <div className="u-margin-bot-small">
                      <TagPinContainer showTags={productGroup.tags} tagOptions={{ justification: 'left', layout: 'horizontal', tagOrder: productGroup.tags }} />
                    </div>
                    {parsedGroupDescription && <div className='c-cs-pg-detail__parsed'>{parsedGroupDescription}</div>}
                  </div>
                </div>
              }
            </Panel>
            <div className="o-grid c-product-set__container">
              {productSets.map(set => {
                const setHasError = set.id in errors
                firstPSetWithError = !firstPSetWithError && setHasError
                return (
                  <Panel className='o-grid__item c-container u-1/1 c-product-set__item c-cs-product-set__item-panel u-margin-bot-small' key={set.id}>
                    <ProductSetView
                      onChange={contract => onChange(contract, set)}
                      hasErrors={setHasError}
                      firstPSetWithError={firstPSetWithError}
                      hasSomeUnavailableParts={errors[set.id]}
                      {...set}
                      key={set.id}
                    />
                  </Panel>
                )
              })}
            </div>
            {productSets &&
              <div className="o-grid">
                <div className="o-grid__item u-2/5 u-text-right u-padding-none">
                  { /*
                    not needed for pilot, we will enable once backend supports bundle quantity update
                  <Tooltip content="This will apply only to items that are part of a bundle.">
                    <span>
                      <Icon icon="help-circle" className="c-cs-help">{t('Bundle qty')}></Icon>
                    </span>
                  </Tooltip>
                  <QuantitySelector id="bundleqty" onChange={val => { setBundleQuantity(val) }} value={bundleQuantity} size='small' />
                  */ }
                </div>
                <div className="o-grid__item u-3/5 u-text-right u-padding-none">
                  <ButtonGroup align="right">
                    {hasItemsInSessionCart && <Button color="secondary" isDisabled={isAddPending} href="/insightweb/viewCart" >
                      {t('Continue to checkout')}
                    </Button>
                    }
                    <Button color={addToCartType} isDisabled={isDisableAddToCart}
                      isLoading={isAddPending}
                      onClick={addToCart}>
                      {t('Add to cart')}
                    </Button>
                  </ButtonGroup>
                  {message && <Message type="success">{message}</Message>}
                </div>
              </div>
            }
          </Fragment>
        )}
    </Fragment>
  )
}

function hasSomeUnavailable(contract) {
  /* Note: need to check how it need to be updated as multiple contracts show up (IPS) */
  let hasUnavailable = false;
  contract.map(({ lineitems }) => {
    hasUnavailable = lineitems.some(({ callForPrice, showPriceOnWeb, discontinued, showBuyButton }) => callForPrice || !showPriceOnWeb || discontinued || !showBuyButton)
  })
  return hasUnavailable;
}

ProductGroupDetailView.propTypes = {
  category: PropTypes.shape({
    name: PropTypes.objectOf(PropTypes.string).isRequired,
  }).isRequired,
  productGroup: PropTypes.shape({
    description: PropTypes.objectOf(PropTypes.string).isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.objectOf(PropTypes.string).isRequired,
    tags: PropTypes.arrayOf(PropTypes.string)
  }).isRequired
}
