import React, { useState, useEffect } from 'react'
import { ProductHeader } from './ProductHeader'
import ProductDetailsSpecifications from './ProductDetailsSpecifications/ProductDetailsSpecifications'
import { ProductDetailTabs } from './ProductDetailTab/ProductDetailTabs'
import { ProductGallery } from './ProductGallery'
import { PDPProvider } from '../context'
import { UIProvider } from '../shared/UIContext/UIContext'
import { isMobile, throttle } from '@insight/toolkit-utils';
import {  HeaderLogo } from '@insight/toolkit-react'

export const LimitPDPPage = () => {
  const [isOnMobile, setIsOnMobile] = useState(isMobile())

  useEffect(() => {
	const onResize = throttle(() => {
	  setIsOnMobile(isMobile())
	}, 250)
	window.addEventListener('resize', onResize)
	  return () => {
		window.removeEventListener('resize', onResize)
	}
  }, [])

	return(
		<div className="c-pdp-page row" itemScope itemType="https://schema.org/Product" >
			<HeaderLogo href="/"/>
			<UIProvider>
			<PDPProvider>
				<section className="o-grid o-grid--gutters">
				<div className="o-grid__item u-1/1 u-1/3@tablet">
					{isOnMobile && <ProductHeader />}
					<ProductGallery />
				</div>
				<div className="o-grid__item u-1/1 u-2/3@tablet">
					{!isOnMobile && <ProductHeader />}
					<ProductDetailsSpecifications />
				</div>
				</section>
				<ProductDetailTabs />
			</PDPProvider>
			</UIProvider>
		</div>
	)
}

export default LimitPDPPage
