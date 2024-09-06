import React from 'react'
import PropTypes from 'prop-types'
import Header from '@insight/toolkit-react/lib/Header/Header'

import ChatNow from '../IAHeaderTop/ChatNow'
import ChatWithUs from "../IAHeaderTop/ChatWithUs";
import PhoneNumber from '../IAHeaderTop/PhoneNumber'
import SubmenuItemLink from './SubmenuItemLink'
import useFilteredItemMap from '../../hooks/useFilteredItemMap'
import EngagePlacement from './EngagePlacement'

export default function SubmenuItems({ items, isMobile, showMeta }) {
  const filteredItemMap = useFilteredItemMap()

  return items
    ? items.map(({ assetName, color, date, href, icon, id, image, targetBlank, title, type, html }) => {
        if (filteredItemMap[id]) {
          return null
        }
        switch (type) {
          case 'button':
            return isMobile ? (
              <SubmenuItemLink {...{ id, href, targetBlank, title }} />
            ) : (
              <li className="c-header-nav__item" key={id}>
                <Header.MegaMenu.Menu.Button
                  className="u-margin-bot-small  c-header-nav__link"
                  color={color}
                  href={href}
                  icon={icon}
                  size="small"
                  targetBlank={targetBlank}
                >
                  {title}
                </Header.MegaMenu.Menu.Button>
              </li>
            )
          case 'chat-now':
            return <ChatNow key={id} wrapper={Header.MegaMenu.Menu.Item} />
          case 'chat-with-us':
            return <ChatWithUs key={id} id={id} chatType="nav" />
          case 'content':
            return (
              <Header.MegaMenu.Menu.Article
                key={id}
                date={date}
                href={href}
                img={image}
                location={assetName}
                showMeta={showMeta}
                targetBlank={targetBlank}
              >
                {title}
              </Header.MegaMenu.Menu.Article>
            )
          case 'favorite-links':
            return null
          case 'phone-number':
            return <PhoneNumber key={id} wrapper={Header.MegaMenu.Menu.Item} />
          case 'view-all':
            return isMobile ? <SubmenuItemLink {...{ id, href, targetBlank, title }} /> : null
          case 'engage-content':
            return isMobile ? null : <EngagePlacement markup={html} id={id} />
          default:
            return <SubmenuItemLink {...{ id, href, targetBlank, title }} />
        }
      })
    : null
}

SubmenuItems.propTypes = {
  isMobile: PropTypes.bool,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string,
      icon: PropTypes.string,
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['basic', 'button', 'chat-now', 'chat-with-us', 'content', 'engage-content',
        'favorite-links', 'phone-number', 'order-tracking', 'link', 'view-all'
      ]),
    })
  ).isRequired,
}

SubmenuItems.defaultProps = {
  isMobile: false,
}
