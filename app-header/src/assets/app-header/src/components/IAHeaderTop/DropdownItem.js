import React from 'react'
import PropTypes from 'prop-types'
import { t } from 'api'

import Header from '@insight/toolkit-react/lib/Header/Header'
import useFilteredItemStatus from '../../hooks/useFilteredItemStatus'

export default function DropdownItem({ id, title, ...rest }) {
  const isFiltered = useFilteredItemStatus(id)

  return !isFiltered
    ? <Header.Top.Dropdown.Item {...rest}>{t(title)}</Header.Top.Dropdown.Item>
    : null
}

DropdownItem.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}
