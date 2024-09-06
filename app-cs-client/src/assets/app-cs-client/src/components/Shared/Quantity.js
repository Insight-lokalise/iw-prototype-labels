import React, {Fragment, useState} from 'react'
import {Button, AddItemToCartModal} from "@insight/toolkit-react";
import {l, t, getInObject} from "@insight/toolkit-utils";
import {useSelector} from "react-redux";
import {fetchProductSets, addProductSetsToCart} from '../../api';
import {selector_isPurchasingPopupEnabled, selector_language, selector_isEMEA} from "../../duck";
import {getCurrentLocale} from '@insight/toolkit-utils'
import {ToastList} from '@insight/toolkit-react'
import QuantitySelector from '../../lib/toolkit/QuantitySelector'
import { getContractLineItems, stripNONE } from '../Services/productGroupBundle';
export default function Quantity({productGroupId, quantityContainerClass, showAddToCartPopup}) {
  const currencyCode = getInObject(window, ['Insight', 'userInformation', 'currencyCode'], 'USD')
  const {language, isEMEA} = useSelector(state => ({
    language: selector_language(state),
    isEMEA: selector_isEMEA(state)
  }));

  const TOAST_DISPLAY_DURATION = 3000;
  const TOAST_FADE_DURATION = 250

  const locale = getCurrentLocale('insight_locale')
  const [cartData, setCartData] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [toasts, setToasts] = useState([]);
  const addBundleToCartHandler = async (bundle) => {
    try {
      const contractLineItems = getContractLineItems(bundle[0]?.contract, bundle[0]?.items, true);
      const items = getItemsToAdd(bundle[0]?.id, contractLineItems);
      if(Object.keys(items).length > 0) {
        const {data} = await addProductSetsToCart({
          bundleQuantity: quantity,
          cart: stripNONE(items),
          language: locale,
          productGroupId,
          contractId: bundle[0]?.contract[0]?.id,
        })
        setCartData(data);
        setIsLoading(false);
        if (data?.items.length > 0 && showAddToCartPopup) {
          setModalIsOpen(true);   //this change is done so that incase there are no product sets we should not open add to cart modal
        }
        window.postMessage({type: 'cart:updated'}, window.location.origin)
      } else {
        setIsLoading(false);
        showToaster('There are no items available at the moment. Please try again later.');
      }
    } catch(e) {
      console.log(e);
      showToaster('Something went wrong please try after some time!.');
      setIsLoading(false);
      setModalIsOpen(false);
    }
  }

  const showToaster = (text) => {
    setToasts(
      [{
        id: 'danger-toast',
        text: <div>{t(text)}</div>,
        title: '',
        type: 'danger'
      }]);
  }

  const getItemsToAdd = (productSetsId, contractLineItems) => {
    let items = {};
    items[productSetsId] = contractLineItems;
    return contractLineItems ? items : {}
  }

  const getProducts = () => {
    let products = cartData?.items;
    products.map(item => {
      item['image'] = item.imageUrl;
      item['manufacturerPartNumber'] = item.manufacturerId;
      item['insightPrice'] = item?.unitPrice ? item?.unitPrice : '0'
    })

    return products;
  }

  const addToCart = async () => {
    try {
      setIsLoading(true);
      const {data} = await fetchProductSets({
        locale, productGroupId
      })
      addBundleToCartHandler(data);
    } catch (error) {
      showToaster('There are no product sets associated with the product group!');
      setIsLoading(false);
    }
  }

  const closeModal = () => {
    setModalIsOpen(false)
  }

  return (
    <Fragment>
      {modalIsOpen && <AddItemToCartModal
        currencyCode={currencyCode}
        isLoggedIn={true}
        isShoppingReqWGEnabled={false}
        isDefaultLoggedOut={true}
        isOpen={modalIsOpen}
        products={getProducts()}
        onClose={closeModal}
        enabledWarranty={false}
        quantity={quantity}
        accessories={{}}
        protection={[]}
        thirdPartyProtection={[]}
        showDividers

      />}
      <span className="u-margin-sides-small u-font-bold">{t('Qty')}</span>
      <QuantitySelector id="quantity" onChange={val => {
        setQuantity(val)
      }} value={quantity} size='small'/>
      <Button isLoading={isLoading} color="primary" onClick={addToCart} size="small" className={"addToCart-gap"}>Add to
        cart</Button>
      <div className="toast-display">
        <ToastList
          className="c-toast__sample"
          dismissToast={() => setToasts([])}
          toastDisplayDuration={TOAST_DISPLAY_DURATION}
          toastFadeDuration={TOAST_FADE_DURATION}
          toasts={toasts}
        />
      </div>

    </Fragment>
  )
}
