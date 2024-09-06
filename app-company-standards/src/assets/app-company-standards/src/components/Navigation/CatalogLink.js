import React from 'react'
import PropTypes from 'prop-types'

import ROUTES from "../Shared/constants";
import Link from '../Navigation/Link'

export default function CatalogLink({ children, className, categoryId, productGroupId, productSetId }) {
  return (
    <Link
      className={className}
      to={{ pathname: ROUTES.STANDARDS, state: { categoryId, productGroupId, productSetId } }}
    >
      {children}
    </Link>
  )
}

CatalogLink.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  categoryId: PropTypes.string,
  productGroupId: PropTypes.string,
  productSetId: PropTypes.string,
}

CatalogLink.defaultProps = {
  className: '',
  categoryId: '',
  productGroupId: '',
  productSetId: '',
}
