import React , { Fragment, useEffect, useRef }from 'react'
import { Route } from 'react-router-dom'
import PowerBi from './PowerBi'
import { t } from '@insight/toolkit-utils/lib/labels'

const Routes = () => {
    return(
      <Fragment>
        <Route exact path="/businessReview" render={() => <PowerBi reportName='businessReview' heading={t('Business Review')} />} />
        <Route exact path="/spendingAnalysis" render={() => <PowerBi reportName='spendingAnalysis' heading={t('Spending Analysis')} showFilters={false} showPageNavigation={false} />} />
      </Fragment>
    )
  }
  
  export default Routes;
  