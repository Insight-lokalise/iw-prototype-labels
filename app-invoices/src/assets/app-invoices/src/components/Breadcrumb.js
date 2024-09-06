import React from 'react'
import { t } from '@insight/toolkit-utils/lib/labels'
import Breadcrumbs from '@insight/toolkit-react/lib/Breadcrumbs/Breadcrumbs'
import { Link } from 'react-router-dom'

const Breadcrumb = ({ breadcrumb, key, match, routeName }) => (
  <div className="c-app-invoices__breadcrumb" data-testid="breadcrumb">
    <Breadcrumbs key={key}>
      <Breadcrumbs.Item href={self.origin}>{t('Home')}</Breadcrumbs.Item>
      {breadcrumb.map(({ name, url }, bkey) => (
        <Breadcrumbs.Item key={bkey}>
          {name === routeName ? (
            <>
              {t(name)}
              {name === 'Invoice details' && match.params.id
                ? ` #${match.params.id}`
                : ''}
            </>
          ) : (
            <Link to={name === routeName ? '#' : url}>{t(name)}</Link>
          )}
        </Breadcrumbs.Item>
      ))}
    </Breadcrumbs>
  </div>
)

export default Breadcrumb
