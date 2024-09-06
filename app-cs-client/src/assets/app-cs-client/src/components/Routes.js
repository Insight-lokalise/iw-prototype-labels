import React , { Fragment }from 'react'
import { Route } from 'react-router-dom'
import RouteWrapper from './RouteWrapper'
import {ScrollToTop} from "./Shared";

export const ROUTES = {
  REDIRECT_CATALOG: `/companyStandards`,
  REDIRECT_CATEGORY: categoryId => `/companyStandards/${categoryId || ':catId'}`,
  REDIRECT_PRODUCT_GROUP: (categoryId, productGroupId)=> `/companyStandards/${categoryId || ':catId'}/${productGroupId || ':productGrpId'}`,
}

const Routes = () => {
  return(
    <ScrollToTop>
      <Route component={RouteWrapper} />
    </ScrollToTop>
  )
}

export default Routes;
