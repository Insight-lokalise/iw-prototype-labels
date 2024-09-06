import React from 'react'
import Header from '@insight/toolkit-react/lib/Header/Header'
import SocialIcon from '@insight/toolkit-react/lib/SocialIcon/SocialIcon'
import SocialIconSymbols from '@insight/toolkit-react/lib/SocialIcon/SocialIconSymbols'

import FadeIn from './FadeIn'
import useFilteredItemMap from '../../hooks/useFilteredItemMap'

export default function SocialLinks({ node, delay }) {
  const filteredItemMap = useFilteredItemMap()

  return filteredItemMap[node.id] ? null : (
    <div className="o-grid__item  o-grid__item--bottom  u-1/1  u-show@desktop">
      <FadeIn delay={delay}>
        <SocialIconSymbols />
        <ul className="o-list-inline  u-margin-bot-none">
          <li className="o-list-inline__item">
            <Header.MegaMenu.Menu.Heading>
              {node.title}
            </Header.MegaMenu.Menu.Heading>
          </li>
          {node.nodes.map((child) => (
            <SocialLink key={child.id} {...child} />
          ))}
        </ul>
      </FadeIn>
    </div>
  )
}

function SocialLink({ id, href, targetBlank, title, name }) {
  const filteredItemMap = useFilteredItemMap()

  return filteredItemMap[id] ? null : (
    <li className="o-list-inline__item">
      <Header.MegaMenu.Menu.Button
        color="subtle"
        href={href}
        targetBlank={targetBlank}
        aria-label={title}
      >
        <SocialIcon brandColorOnHover icon={name} title={title} />
      </Header.MegaMenu.Menu.Button>
    </li>
  )
}
