import React from 'react'
import { withRouter } from 'react-router-dom'
import {t} from "@insight/toolkit-utils/lib/labels";
import Breadcrumbs from "@insight/toolkit-react/lib/Breadcrumbs/Breadcrumbs";
import ROUTES from '../../libs/routes'

const Breadcrumb = (props) => {
  const { pathname } = props.location

  return(
    ROUTES.VIEW_CART === pathname ? 
      <div data-testid='breadcrumb'>
        <Breadcrumbs>
          <Breadcrumbs.Item href={self.origin}>{t('Home')}</Breadcrumbs.Item>
          <Breadcrumbs.Item href=''>{t('Cart')}</Breadcrumbs.Item>
        </Breadcrumbs>
      </div> : null
  )
}

export default withRouter(Breadcrumb)
