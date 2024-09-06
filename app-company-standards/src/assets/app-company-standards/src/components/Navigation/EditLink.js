import React from 'react'
import PropTypes from 'prop-types'

import ROUTES from "../Shared/constants";
import Link from '../Navigation/Link'

export default function EditLink({ children, className, disabled, id, categoryId, nestLevel, search }) {
  const pathname = (() => {
    switch (nestLevel) {
      case 0:
        return ROUTES.EDIT_CATEGORY(id)
      case 1:
        return ROUTES.EDIT_PRODUCT_GROUP(id, categoryId)
      case 2:
        return ROUTES.EDIT_PRODUCT_SET(id, categoryId)
      case 3:
        return ROUTES.ADD_EDIT_PRODUCTS(id, categoryId)
      default:
        return ''
    }
  })()

  return (
    <Link 
      className={className + ' u-text-bold'} 
      search={search} 
      to={disabled ? '#' : { pathname }} 
      categoryId={categoryId}
    >
      {children}
    </Link>
  )
}

EditLink.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  nestLevel: PropTypes.number.isRequired,
  search: PropTypes.bool,
}

EditLink.defaultProps = {
  className: '',
  search: false,
}
