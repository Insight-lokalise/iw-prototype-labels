import React from 'react'
import {t} from "@insight/toolkit-utils/lib/labels";
import Breadcrumbs from "@insight/toolkit-react/lib/Breadcrumbs/Breadcrumbs";

const ShoppingCartBreadcrumb = () => {
  return(
    <div className='c-shopping-cart-breadcrumb' data-testid='breadcrumb'>
      <Breadcrumbs>
        <Breadcrumbs.Item href={self.origin}>{t('Home')}</Breadcrumbs.Item>
        <Breadcrumbs.Item>{t('Cart')}</Breadcrumbs.Item>
      </Breadcrumbs>
    </div>
  )
}

export default ShoppingCartBreadcrumb
