import React from 'react'
import { t } from '@insight/toolkit-utils/lib/labels'
import Breadcrumbs from '@insight/toolkit-react/lib/Breadcrumbs/Breadcrumbs'
import { Link } from 'react-router-dom'

const Breadcrumb = ({ breadcrumb, key, match, routeName }) => {
  const crumbRenderer = ({ name, url }) => {
    if (name !== routeName) return <Link to={url}>{t(name)}</Link>
    if (match?.params.id) return `${t(name)} #${match.params.id}`
    return t(name)
  }

  return (
    <div
      className="c-app-stored-carts__breadcrumb hide-for-print"
      data-testid="breadcrumb"
    >
      <Breadcrumbs key={key}>
        <Breadcrumbs.Item href={'/'}>{t('Home')}</Breadcrumbs.Item>
        {breadcrumb.map(({ name, url }, bkey) => (
          <Breadcrumbs.Item key={bkey}>
            {crumbRenderer({ name, url })}
          </Breadcrumbs.Item>
        ))}
      </Breadcrumbs>
    </div>
  )
}

export default Breadcrumb
