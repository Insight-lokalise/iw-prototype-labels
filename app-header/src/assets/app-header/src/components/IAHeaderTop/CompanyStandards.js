import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import Header from '@insight/toolkit-react/lib/Header/Header'

import useFilteredItemStatus from '../../hooks/useFilteredItemStatus'
import usePermissions from '../../hooks/usePermissions'
import IAHeaderContext from '../../context/IAHeaderContext'

export default function CompanyStandards({ wrapper, id, title, href }) {
  const { headerInfo: { userInformation: { companyStandardsTitle } } } = useContext(IAHeaderContext)
  const isFiltered = useFilteredItemStatus(id)
  const { enableMyProductsLink } = usePermissions()
  const displayTitle = companyStandardsTitle || title
  const Wrapper = wrapper

  return !isFiltered && enableMyProductsLink
    ? <Wrapper href={href}>{displayTitle}</Wrapper>
    : null
}

CompanyStandards.propTypes = {
  wrapper: PropTypes.func,
}

CompanyStandards.defaultProps = {
  wrapper: Header.Top.Item,
}
