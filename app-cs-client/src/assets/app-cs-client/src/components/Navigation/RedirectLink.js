import React from 'react'
import PropTypes from 'prop-types'

import { ROUTES } from '../Routes'
import { Link } from 'react-router-dom'

/* Added default routes, will update later when we work on */
export default function RedirectLink({ children, categoryId, className, nestLevel, productGroupId }) {
  const pathname = (() => {
    switch (nestLevel) {
      case 1:
        return ROUTES.REDIRECT_CATEGORY(categoryId)
      case 2:
        return ROUTES.REDIRECT_PRODUCT_GROUP(categoryId, productGroupId)
      default:
        return ROUTES.REDIRECT_CATALOG
    }
  })()

  return (
    <Link className={className} to={{ pathname }}>
      {children}
    </Link>
  )
}

RedirectLink.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  categoryId: PropTypes.string.isRequired,
  nestLevel: PropTypes.number.isRequired,
  productGroupId: PropTypes.string,
}

RedirectLink.defaultProps = {
  className: '',
}
