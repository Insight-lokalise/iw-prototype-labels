import React from 'react'
import PropTypes from 'prop-types'
import Header from '@insight/toolkit-react/lib/Header/Header'

import ChatNow from './ChatNow'
import CloudManagementLink from './Tools/CloudManagementLink'
import RegularDropdownItem from './RegularDropdownItem'
import CompanyStandards from './CompanyStandards'
import MyInsightOnlyLink from './MyInsightOnlyLink'
import ChatWithUs from "./ChatWithUs";
import { t } from 'api'

export default function Dropdown({ id, items, text, title }) {

  return (
    <Header.Top.Dropdown id={id} text={text} title={t(title)}>
      {items.map(item => {
        const props = { key: item.id, wrapper: Header.Top.Dropdown.Item }

        switch (item.type) {
          case 'chat-now':
            return <ChatNow {...props} />
          case 'chat-with-us':
            return <ChatWithUs key={item.id} {...item} chatType="dropdown" />
          case 'cloud-management':
            return <CloudManagementLink {...props} {...item} />
          case 'company-standards':
            return <CompanyStandards {...props} {...item} />
          case 'my-insight-only-link':
            return <MyInsightOnlyLink {...props} {...item} />
          default:
            return <RegularDropdownItem key={item.title} {...item} />
        }
      })}
    </Header.Top.Dropdown>
  )
}

Dropdown.propTypes = {
  id: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    })
  ).isRequired,
  text: PropTypes.string.isRequired,
  title: PropTypes.string,
}
