import React from "react";
import { PlacementsProvider } from "../context";
import ProductBetterTogether from './ProductBetterTogether/ProductBetterTogether'
import ProductDetailsCompare from './ProductDetailCompare/ProductDetailCompare'
import ProductDetailsSpecifications from './ProductDetailsSpecifications/ProductDetailsSpecifications'
import ProductDetailTabs from './ProductDetailTab/ProductDetailTabs'
import { ProductGallery } from './ProductGallery'
import ProductPeopleBoughtTogether from './ProductPeopleBoughtTogether/ProductPeopleBoughtTogether'
import { connectToLocale } from "@insight/toolkit-react";


const PlacementsDetailPage = ({context}) => {
    return(
        <PlacementsProvider context={context}>
        <section className="o-grid o-grid--gutters">
          <div className="o-grid__item u-1/1 u-1/3@tablet">
            <ProductGallery />
          </div>
          <div className="o-grid__item u-1/1 u-2/3@tablet">
            <ProductDetailsSpecifications />
          </div>
        </section>
        <ProductBetterTogether />
        <ProductDetailTabs />

          <ProductDetailsCompare />
        <ProductPeopleBoughtTogether />
      </PlacementsProvider>
    )
}

export default connectToLocale(PlacementsDetailPage)