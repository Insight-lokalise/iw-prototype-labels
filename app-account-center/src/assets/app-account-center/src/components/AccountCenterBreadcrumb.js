import React from 'react'
import {t} from "@insight/toolkit-utils/lib/labels";
import Breadcrumbs from "@insight/toolkit-react/lib/Breadcrumbs/Breadcrumbs";

const AccountCenterBreadcrumb = ({breadcrumb, key, routeName}) => {
  return(
    <div className='c-account-breadcrumb' data-testid='breadcrumb'>
      <Breadcrumbs key={key}>
        <Breadcrumbs.Item href={self.origin}>{t('Home')}</Breadcrumbs.Item>
        {breadcrumb.map(({ name, url }, bkey) =>(
          <Breadcrumbs.Item key={bkey} href={ name === routeName ? '' :`/insightweb${url}`}>{t(name)}</Breadcrumbs.Item>
        ))}
      </Breadcrumbs>
    </div>
  )
}

export default AccountCenterBreadcrumb
