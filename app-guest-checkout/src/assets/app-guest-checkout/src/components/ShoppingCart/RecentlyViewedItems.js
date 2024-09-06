import React, {useEffect, useState}  from 'react'
import { useSelector } from 'react-redux'
import {t} from "@insight/toolkit-utils/lib/labels";
import { RecommendedCarousel } from "@insight/toolkit-react/lib/RecommendedCarousel/RecommendedCarousel";
import {fetchRecentlyViewedItems, getRecentlyViewedMaterialIds} from "../../api";
import { selector_cartItems } from './../../state/slices/selectors/ShoppingReqeustSelector'
import {prepareProductTiles} from "../../lib/prepareProductTiles";

const RecentlyViewedItems = (props) => {
  const { openMiniPDP, isLoggedIn, addToCart, isEMEA } = props
  const cartItems = useSelector(selector_cartItems)
  const cartItemsList = cartItems.map(i=>i.materialInfo.materialId)
  const [products, setProducts] = useState([])
  const sliderSettings = { mobile: 1, tablet: 2, desktop: 4 }

  useEffect(() => {
    const materialIds = getRecentlyViewedMaterialIds();
    if(materialIds.length > 0) {
      fetchRecentlyViewedItems(materialIds).then((data)=>{
        setProducts(data?.products || [])
      })
    }
  },[])

  const productList = products?.filter((item) => !item?.price?.callForPrice);

  const productTiles = () => prepareProductTiles({
    products : productList,
    isRecommendedProduct:false,
    addToCart,
    openMiniPDP,
    isLoggedIn,
    isEMEA,
    cartItemsList
  })

  if(productList.length === 0 ) return null
  return (
    <div className="c-recently-viewed-items">
      <h3 className="u-h4">{t('Recently viewed items')}</h3>
      <RecommendedCarousel settings={sliderSettings} productTiles={productTiles}/>
    </div>
  )
}

export default RecentlyViewedItems
