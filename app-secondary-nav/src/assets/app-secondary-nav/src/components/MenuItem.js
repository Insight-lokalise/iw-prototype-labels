import React from 'react'
import PropTypes from 'prop-types'

import Button from "@insight/toolkit-react/lib/Button/Button";
import Dropdown from "@insight/toolkit-react/lib/Dropdown/Dropdown";

import MenuItems from './MenuItems'
import SubMenuItem from './SubMenuItem'
import { linkTransformer } from './../lib/linkTransformer'

export default function MenuItem({accessibleLinkText, gtmEvent, linkPath, linkText, menuList}) {
  const hasSubMenu = menuList && menuList.length > 0
  return (
    <li className="o-list-inline__item c-subnav__item">
      {hasSubMenu ?
        <Dropdown
          position="right"
          text={linkText}
          color="none"
          id={`${linkText}Dropdown`}
          className="c-subnav-dropdown"
          btnClassName="c-subnav__link"
          closeOnDropdownClick={false}
          dropdownMenuClassName="c-subnav-dropdown__menu"
        >
          <ul className="o-list-bare  c-subnav-dropdown__list  u-margin-bot-none">
            <SubMenuItem linkPath={linkPath} gtmEvent={gtmEvent} linkText={accessibleLinkText || linkText} isSubMenu />
            <MenuItems menuItems={menuList} isSubMenu />
          </ul>
        </Dropdown>
        :
        <Button color="none" href={linkTransformer(linkPath)} className="c-subnav__link">
          {linkText}
        </Button>
      }
    </li>
  )
}

MenuItem.propTypes = {
  accessibleLinkText: PropTypes.string,
  gtmEvent: PropTypes.string,
  linkPath: PropTypes.string.isRequired,
  linkText: PropTypes.string.isRequired,
  menuList: PropTypes.arrayOf(PropTypes.shape({
    gtmEvent: PropTypes.string,
    linkPath: PropTypes.string.isRequired,
    linkText: PropTypes.string.isRequired,
  })),
}
