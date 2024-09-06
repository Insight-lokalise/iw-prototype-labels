import React from 'react'
import PropTypes from 'prop-types'

import { ROUTES } from '../Routes'

/* Based on categories & product groups count, redirect to that particular page */
export default function RedirectToTarget({ categoryId, productGroupId, targetLevel }) {
  const targetname = (() => {
    switch (targetLevel) {
      case 1:
        return ROUTES.REDIRECT_CATEGORY(categoryId)
      case 2:
        return ROUTES.REDIRECT_PRODUCT_GROUP(categoryId, productGroupId)
      default:
        return ROUTES.REDIRECT_CATALOG
    }
  })()

  return targetname
}

RedirectToTarget.propTypes = {
  categoryId: PropTypes.string.isRequired,
  targetLevel: PropTypes.number.isRequired
}
