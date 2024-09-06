import React , { Fragment, useEffect, useRef }from 'react'
import { Route } from 'react-router-dom'
import CatalogView from '../components/CatalogView'
import CategoryView from '../components/CategoryView'
import ProductGroupView from '../components/ProductGroupView'
import { Search }  from '../components/Search'

const RouteWrapper = () => {
  const prevLocation = useRef(null)

  useEffect(() => {
    prevLocation.current = location
  }, [location])

  return(
    <Fragment>
      <Route exact path="/companyStandards" render={routerProps => <CatalogView {...routerProps} prevLocation={prevLocation.current} />} />
      <Route exact path="/companyStandards/:catId" component={CategoryView} />
      <Route exact path="/companyStandards/:catId/:productGrpId" component={ProductGroupView} />
      <Route exact path="/companyStandards/search" component={Search} />
    </Fragment>
  )
}

export default RouteWrapper;
