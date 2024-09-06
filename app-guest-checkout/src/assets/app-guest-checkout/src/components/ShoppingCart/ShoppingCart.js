import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'
import { connectToLocale } from '@insight/toolkit-react/lib/Locale/Locale'
import { t, triggerTrackingUrl } from '@insight/toolkit-utils'
import { persistor } from '../../index'
import {
  ShoppingTable,
  WarrantyModal,
  AccessoryModal,
  Summary,
  Loading,
} from '@insight/toolkit-react'
import ShoppingCartBreadcrumb from './ShoppingCartBreadcrumb'
import CartHeader from './CartHeader'
import EmptyCart from './EmptyCart'
import CartMessages from './CartMessages'
import { ShoppingCartMiniPDP } from './ShoppingCartMiniPDP'
import { update as updateItemAction } from '../../state/slices/tentativeQuantitySlice'
import { update as updateDEPAction } from '../../state/slices/DEPSlice'
import { save as saveShoppingRequest } from '../../state/slices/shoppingRequestSlice'
import { save as saveInvalidIds } from '../../state/slices/invalidIdsSlice'
import { clear as clearInvalidIds } from '../../state/slices/invalidIdsSlice'
import { save as saveLineLevelSessionInfos } from '../../state/slices/lineLevelSessionInfosSlice'
import { setUserData } from './../../state/slices/userDataSlice'
import {
  selector_shoppingRequest,
  selector_cartItems,
} from '../../state/slices/selectors/ShoppingReqeustSelector'
import { selector_lineLevelSessionInfos } from '../../state/slices/selectors/lineLevelSessionInfosSelector'
import { selector_userPermissions } from '../../state/slices/selectors/userDataSelector'
import { selector_dep } from '../../state/slices/selectors/depSelector'
import { selector_invalidIds } from '../../state/slices/selectors/invalidIdsSelector'
// import { removeFromCartGAEAction, addToCartGAEAction } from '../../lib/analytic'

import { getAccessories, getWarranties } from '../../api/getRecommendation'
import {
  addToShoppingRequest,
  changeWarrantyToShoppingRequest,
  updateShoppingRequest,
  deleteShoppingRequest,
  split,
  checkoutFn,
} from '../../api/postData'
import { getEnrollmentIDs, getUserData, prepareUIShoppingCart } from '../../api/getData'
import RecentlyViewedItems from './RecentlyViewedItems'
import CheckoutCartItems from './CheckoutCartItems'
import RecommendedItems from './RecommendedItems'
import { updateMiniCart } from '../../lib/Helpers'
import { USER_PERMISSIONS } from '../../constants'
import CartOptions from './CartOptions'

const ShoppingCart = (props) => {
  const { context } = props
  const {
    isLoggedIn,
    sessionId,
    locale,
    account,
    webGroupId,
    salesOrg,
    soldto,
    webLoginProfileId,
    ipsUser,
    isCES,
    currencyCode,
    isIntegration,
    reportingParentId,
  } = context

  const dispatch = useDispatch()
  const [miniPDP, setMiniPDP] = useState('')
  const [accessories, setAccessories] = useState('')
  const [warranty, setWarranty] = useState('')
  const [warrantiesData, setWarrantiesData] = useState('')
  const [thirdPartywarrantiesData, setThirdPartywarrantiesData] = useState('')
  const [selectedProductWarranty, setSelectedProductWarranty] = useState('')
  const [selectedProductWarrantyFlag, setSelectedProductWarrantyFlag] = useState(false)
  const [parentData, setParentData] = useState('')
  const [webProduct, setWebProduct] = useState('')
  const [partners, setPartners] = useState('')
  const [enrollmentParentIds, setEnrollmentParentIds] = useState([])
  const [isCheckoutDisabled, setIsCheckoutDisabled] = useState(true)
  const [copyToAllState, setCopyToAllState] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const shoppingRequest = useSelector(selector_shoppingRequest)
  const lineLevelSessionInfos = useSelector(selector_lineLevelSessionInfos)
  const depState = useSelector(selector_dep)
  const itemsInCart = useSelector(selector_cartItems)
  const invalidIds = useSelector(selector_invalidIds)
  const userPermissions = useSelector(selector_userPermissions)

  const cartItemsList = itemsInCart.map((i) => i.materialInfo.materialId)
  const cartItems = shoppingRequest?.cart?.cartItems || [];

  const {
    ewrFee,
    gstHstTaxCost,
    pstTaxCost,
    shippingCost,
    subTotal,
    taxCost,
    totalCost,
  } = shoppingRequest?.cart?.summary || ''
  const isCanada = salesOrg === '4100'
  const hasQuickCheckoutEnabled = userPermissions.includes(
    USER_PERMISSIONS.ENABLE_QUICK_CHECKOUT
  )
  const quickCheckout = hasQuickCheckoutEnabled

  useEffect(() => {
    persistor.flush().then(() => updateMiniCart())
    dispatch(clearInvalidIds())
    return () => {
      updateMiniCart()
    }
  }, [shoppingRequest])

  useEffect(async () => {
    const cartInSession = window.localStorage.getItem("cartInSession")
    if(cartInSession && isCES) {
      setIsLoading(true)
      const { shoppingRequest, lineLevelSessionInfos, invalidMaterials } = await prepareUIShoppingCart()
      dispatch(saveShoppingRequest(shoppingRequest))
      dispatch(saveLineLevelSessionInfos(lineLevelSessionInfos))
      invalidMaterials && dispatch(saveInvalidIds(invalidMaterials))
      setIsLoading(false)
      window.postMessage({ type: 'cart:updated' }, window.location.origin);
      window.localStorage.removeItem("cartInSession")
    }
  }, [])

  useEffect(() => {
    getUserData().then((user) => {
      dispatch(setUserData(user))
    })
  }, [])

  const updateDEPState = (updateState) => {
    dispatch(updateDEPAction(updateState))
  }

  const updateState = (shoppingRequest, lineLevelSessionInfos, invalidIds) => {
    dispatch(saveShoppingRequest(shoppingRequest))
    dispatch(saveLineLevelSessionInfos(lineLevelSessionInfos))
    invalidIds && dispatch(saveInvalidIds(invalidIds))
  }

  const getAllEnrollmentID = async (soldto, reportingParentId) => {
    //get the enrollment dropdown data from /enrollmentParts
    const data = await getEnrollmentIDs({ soldto, reportingParentId })
    setPartners(data)
  }

  useEffect(() => {
    //get the enrollment dropdown data from /enrollmentParts
    isLoggedIn ? getAllEnrollmentID(soldto, reportingParentId) : ''
  }, [])

  const getAllEnrollableItems = (lineLevelSessionInfos) => {
    //2.get all enrollable parentIdS
    const enrollableParentIds = []
    lineLevelSessionInfos.map((lineLevelSessionInfo) => {
      if (lineLevelSessionInfo.enrollable) {
        enrollableParentIds.push(lineLevelSessionInfo.id)
      }
    })
    setEnrollmentParentIds(enrollableParentIds)
  }

  const calculateCheckoutEnableByDEP = (depState) => {
    const res = enrollmentParentIds.every((enrollableDEP) => {
      return (
        !depState[enrollableDEP].isEnrolled ||
        (depState[enrollableDEP].isEnrolled &&
          depState[enrollableDEP].isValidcustomerId)
      )
    })
    setIsCheckoutDisabled(!res)
  }

  useEffect(() => {
    //1.set initial dep state in Redux
    getAllEnrollableItems(lineLevelSessionInfos)
  }, [lineLevelSessionInfos])

  useEffect(() => {
    //3. calculate checkout status based on depState
    calculateCheckoutEnableByDEP(depState)
  }, [depState])

  const isEmptyCart =
    shoppingRequest && Object.values(shoppingRequest).length > 0
      ? shoppingRequest?.cart?.cartItems &&
        shoppingRequest?.cart?.cartItems?.length === 0
      : true

  const emptyCart = async () => {
    const isEmptyCartDelete = true
    const { shoppingRequest, lineLevelSessionInfos } =
      await deleteShoppingRequest({
        shoppingRequest,
        lineLevelSessionInfos,
        isWarranty: false,
        isEmptyCartDelete,
      })
    updateState(shoppingRequest, lineLevelSessionInfos)
  }

  const handleQuantityChange = (value, id) => {
    const obj = {}
    obj[id] = {
      bundle: 'false',
      quantity: value,
    }
    dispatch(updateItemAction(obj))
  }

  const updateQuantity = async (localQuantity, materialId, id) => {
    const { shoppingRequest, lineLevelSessionInfos } =
      await updateShoppingRequest({
        localQuantity,
        materialId,
        id,
        shoppingRequest,
        lineLevelSessionInfos,
      })
    updateState(shoppingRequest, lineLevelSessionInfos)
    //addToCartGAEAction(shoppingRequest, localQuantity, materialId, id)
  }

  const addWarranty = async (cartItemId) => {
    //open warrantyModal call
    const { warrantiesData, thirdPartywarrantiesData, parentData } =
      await getWarranties({
        webLoginProfileId,
        soldto,
        webGroupId,
        salesOrg,
        locale,
        cartItems,
        cartItemId,
        isIntegration,
        isLoggedIn,
        sessionId
      });
    const warranties = warrantiesData || [];
    const thirdPartyWarranties = thirdPartywarrantiesData || [];
    const parentSKU = parentData?.parentMaterialData?.materialId;
    const selectedItemDetails = cartItems.filter((sku) => sku.materialInfo.materialId === parentSKU)[0]
    const hasWarrantySelected = selectedItemDetails.warranty !== undefined;
    const defaultSelectWarranty = hasWarrantySelected ? 
      selectedItemDetails?.warranty?.materialId : 
      [...warranties, ...thirdPartyWarranties][0]?.materialId;
    setSelectedProductWarrantyFlag(hasWarrantySelected)
    setSelectedProductWarranty(defaultSelectWarranty)
    setWarrantiesData(warranties);
    setThirdPartywarrantiesData(thirdPartyWarranties);
    setParentData(parentData);
    setWarranty([...warranties, ...thirdPartyWarranties]);
  }

  const addAccessories = async (materialId) => {
    //open accessoryModal call
    const { accessories, webProduct } = await getAccessories(
      isLoggedIn,
      locale,
      sessionId,
      materialId,
      cartItems
    )
    setAccessories(accessories)
    setWebProduct(webProduct)
  }

  const handleSplit = async (parentCartitemId) => {
    const postObj = {
      items: [
        {
          id: parentCartitemId,
          bundle: false,
        },
      ],
      shoppingRequest,
      lineLevelSessionInfos,
    }
    const { shoppingRequest, lineLevelSessionInfos } = await split(postObj)
    updateState(shoppingRequest, lineLevelSessionInfos)
  }

  const handleDelete = async (id, isWarranty = false) => {
    // delete action for both product(parentItem, accessory) and warranty
    const { shoppingRequest, lineLevelSessionInfos } =
      await deleteShoppingRequest({
        id,
        shoppingRequest,
        lineLevelSessionInfos,
        isWarranty,
        isEmptyCartDelete: false,
      })
    updateState(shoppingRequest, lineLevelSessionInfos)
  }

  const handleCheckout = async () => {
    const data = await checkoutFn({
      depState,
      locale,
      enrollmentParentIds,
      shoppingRequest,
      lineLevelSessionInfos,
    })
    return data
  }

  const addToCart = async (props) => {
    // add action for product(parentItem, accessory)
    const { shoppingRequest, lineLevelSessionInfos, invalidIds } =
      await addToShoppingRequest({
        materialId: props[0].materialID,
        isLoggedIn,
        locale,
        shoppingRequest,
        lineLevelSessionInfos,
        invalidIds,
      })
    updateState(shoppingRequest, lineLevelSessionInfos, invalidIds)
    //addToCartGAEAction(shoppingRequest, 1, props[0].materialID)
    return { shoppingRequest, lineLevelSessionInfos }
  }

  const copyToAll = async (customerID) => {
    const data = Object.entries(depState)?.reduce((acc, [k, v]) => {
      return {
        ...acc,
        [k]: {
          ...v,
          customerID,
          isValidcustomerId: true,
        },
      }
    }, {})
    setCopyToAllState(customerID)
    dispatch(updateDEPAction(data))
  }

  const toggleWarranty = ({ materialId }) => {
    setSelectedProductWarranty(materialId);
  }

  const getTrackingUrlForWarranty = () => {
    const warranties = warrantiesData || [];
    const thirdPartyWarranties = thirdPartywarrantiesData || [];
    const allWarranties = [...warranties, ...thirdPartyWarranties];
    const selectedWarranty = allWarranties?.find((warranty) => 
      warranty?.materialId === selectedProductWarranty);
    return selectedWarranty?.clickTrackingURL;
  }

  const handleAddWarrantyToCart = async () => {
    const trackingUrl = getTrackingUrlForWarranty();
    triggerTrackingUrl(trackingUrl);
    // add action for warranty
    const { shoppingRequest, lineLevelSessionInfos } =
      await changeWarrantyToShoppingRequest({
        parentId: parentData?.parentCartItemId,
        materialId: selectedProductWarranty,
        locale,
        shoppingRequest,
        lineLevelSessionInfos,
      })
    updateState(shoppingRequest, lineLevelSessionInfos)
    setWarranty('')
  }

  const renderCarousels = () => (
    <>
      <RecentlyViewedItems
        locale={locale}
        isLoggedIn={isLoggedIn}
        openMiniPDP={(materialId) => setMiniPDP(materialId)}
        addToCart={addToCart}
      />
      <RecommendedItems
        addToCart={addToCart}
        salesOrg={salesOrg}
        sessionId={sessionId}
        soldto={soldto}
        locale={locale}
        isIntegration={isIntegration}
        isLoggedIn={isLoggedIn}
        openMiniPDP={(materialId) => setMiniPDP(materialId)}
        cartItemsList={cartItemsList}
      />
    </>
  )

  const isLoggedOutDefaultUser =
    !isLoggedIn && (locale === 'en_US' || locale.split('_')[1] === 'CA')
  return (
    <div className="c-shopping-cart-page">
      <Helmet>
        <title>{t('Cart')}</title>
        <meta name="description" content={t('Cart page')} />
      </Helmet>
      <ShoppingCartBreadcrumb />
      <CartHeader />
      {invalidIds && invalidIds?.length > 0 && (
        <CartMessages invalidMaterialIds={invalidIds} />
      )}
      {isLoading ? <Loading size="large"/> :
          isEmptyCart ? (
              <>
                <EmptyCart locale={locale} />
                {renderCarousels()}
              </>
          ) : (
              <div className="c-shopping-cart-wrapper o-grid">
                <>
                  <div className="c-shopping-cart o-grid__item u-1/1 u-3/4@desktop">
                    <div>
                      <ShoppingTable
                          shoppingRequest={shoppingRequest}
                          lineLevelSessionInfos={lineLevelSessionInfos}
                          currencyCode={currencyCode}
                          showStockInfo={true}
                          addAccessories={addAccessories}
                          setAccessories={setAccessories}
                          addWarranty={addWarranty}
                          setWarranty={setWarranty}
                          openMiniPDP={(materialId) => setMiniPDP(materialId)}
                          updateQuantity={updateQuantity}
                          onQuantityChange={handleQuantityChange}
                          onDelete={handleDelete}
                          emptyCart={emptyCart}
                          partners={partners}
                          enrollmentParentIds={enrollmentParentIds}
                          updateDEPState={updateDEPState}
                          handleSplit={handleSplit}
                          copyToAll={copyToAll}
                          copyToAllState={copyToAllState}
                          isLoggedIn={isLoggedIn}
                      />
                      {renderCarousels()}
                    </div>
                  </div>
                  <div className="c-shopping-cart-summary o-grid__item u-1/1 u-1/4@desktop">
                    <div className="o-grid c-sticky-summary">
                      <div className="o-grid__item">
                        <Summary
                            currencyCode={currencyCode}
                            isCanada={isCanada}
                            locale={locale}
                            showEstimateMessage
                            subtotal={subTotal}
                            estimatedShipping={shippingCost}
                            estimatedTax={taxCost}
                            gstHstTaxCost={gstHstTaxCost}
                            pstTaxCost={pstTaxCost}
                            ewrFee={ewrFee}
                            total={totalCost}
                        >
                          <div className="c-shopping-cart-button">
                            <CheckoutCartItems
                                isLoggedIn={isLoggedIn}
                                shoppingRequest={shoppingRequest}
                                lineLevelSessionInfos={lineLevelSessionInfos}
                                quickCheckout={quickCheckout}
                                isCheckoutDisabled={isCheckoutDisabled}
                                handleCheckout={handleCheckout}
                            />
                            {isLoggedIn && (
                                <CartOptions
                                    shoppingRequest={shoppingRequest}
                                    isCartPage
                                    emptyCart={emptyCart}
                                />
                            )}
                          </div>
                        </Summary>
                      </div>
                    </div>
                  </div>
                </>
              </div>
          )
      }
      {miniPDP && (
        <ShoppingCartMiniPDP
          miniPDP={miniPDP}
          setMiniPDP={setMiniPDP}
          isLoggedIn={isLoggedIn}
        />
      )}
      {accessories?.length > 0 && (
        <AccessoryModal
          accessories={accessories}
          productDetails={webProduct}
          isCES={isCES}
          isLoggedOutDefaultUser={isLoggedOutDefaultUser}
          contractId=""
          context={context}
          showAccessoryDialog={accessories?.length > 0}
          hasAccessories={accessories?.length > 0}
          addToCart={addToCart}
          onHide={() => setAccessories('')}
          itemsInCartByContract={cartItemsList}
        />
      )}
      {warranty?.length > 0 && (
        <WarrantyModal
          warrantiesData={warrantiesData}
          thirdPartywarrantiesData={thirdPartywarrantiesData}
          parentMaterialData={parentData?.parentMaterialData}
          toggleWarranty={toggleWarranty}
          handleAddWarrantyToCart={handleAddWarrantyToCart}
          showWarrantyDialog={warranty?.length > 0}
          onHide={() => setWarranty('')}
          isEMEA={false}
          selectedProductWarranty={selectedProductWarranty}
          selectedProductWarrantyFlag={selectedProductWarrantyFlag}
        />
      )}
    </div>
  )
}

export default connectToLocale(ShoppingCart)
