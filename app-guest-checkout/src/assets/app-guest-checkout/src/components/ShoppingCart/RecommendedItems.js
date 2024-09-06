import React, {useEffect, useState}  from 'react'
import {t} from "@insight/toolkit-utils/lib/labels";
import { RecommendedCarousel } from "@insight/toolkit-react/lib/RecommendedCarousel/RecommendedCarousel";
import {getRecommendationsByItems} from "../../api/getRecommendation";
import {prepareProductTiles} from "../../lib/prepareProductTiles";


const RecommendedItems = (props) => {
  const { openMiniPDP, isLoggedIn, isIntegration, locale, cartItemsList, addToCart, isEMEA, sessionId} = props
  const [products, setProducts] = useState([])
  const [strategyMessage, setStrategyMessage] = useState("")
  const sliderSettings = { mobile: 1, tablet: 2, desktop: 4 }

  useEffect(() => {
    if(cartItemsList && cartItemsList.length > 0) {
      getRecommendationsByItems({materialIds:cartItemsList , isIntegration, locale, isLoggedIn,sessionId}).then((data)=>{
        setStrategyMessage(data?.strategyMessage || null);
        setProducts(data?.prodList || [])
      })
    }

  },[cartItemsList])

  const productList = products?.filter((item) => !item?.callForPrice);

  const productTiles = () => prepareProductTiles({
    products : productList,
    isRecommendedProduct:true,
    addToCart,
    openMiniPDP,
    isLoggedIn,
    isEMEA,
    cartItemsList
  })


  if(productList.length === 0 ) return null
  return (
    <div className="c-recommended-items">
      <h3 className="u-h4">{t(strategyMessage)}</h3>
      <RecommendedCarousel settings={sliderSettings} productTiles={productTiles}/>
    </div>
  )
}

export default RecommendedItems
