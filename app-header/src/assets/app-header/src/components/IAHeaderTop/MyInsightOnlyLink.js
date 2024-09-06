import React from 'react'
import PropTypes from 'prop-types'
import Header from '@insight/toolkit-react/lib/Header/Header'

import usePermissions from '../../hooks/usePermissions'
import useFilteredItemStatus from '../../hooks/useFilteredItemStatus'

export default function MyInsightOnlyLink({ wrapper, id, title, href }) {
  const { enableMyInsightLinks } = usePermissions()
  const isFiltered = useFilteredItemStatus(id)
  const Wrapper = wrapper

  return !isFiltered && enableMyInsightLinks
    ? <Wrapper href={href}>{title}</Wrapper>
    : null
}

MyInsightOnlyLink.propTypes = {
  wrapper: PropTypes.func,
}

MyInsightOnlyLink.defaultProps = {
  wrapper: Header.Top.Item,
}
