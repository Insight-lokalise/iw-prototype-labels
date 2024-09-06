import React, {useState} from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import Button from "@insight/toolkit-react/lib/Button/Button";
import Icon from "@insight/toolkit-react/lib/Icon/Icon";
import MenuItems from './MenuItems'
import { linkTransformer } from './../lib/linkTransformer'

export default function SubMenuItem({accessibleLinkText, gtmEvent, linkPath, linkText, menuList, isSubMenu}) {
  const [enableSubMenu, setEnableSubMenu] = useState(false);

  const hasSubMenu = menuList && menuList.length > 0
  const subNavItemClasses = cn("o-list-inline__item", {"c-subnav__item" : !isSubMenu}, {"c-subnav-dropdown__item" : isSubMenu} )
  const buttonClasses = isSubMenu ? "c-subnav-dropdown__link" : "c-subnav__link"
  const buttonColor = isSubMenu ? "subtle" : "none"
  const arrowIcon = enableSubMenu ? "arrow-dropup" : "arrow-dropdown"
  const buttonAction = hasSubMenu ? {onClick: () => setEnableSubMenu(!enableSubMenu)} : {href: linkTransformer(linkPath)}
  return (
    <li className={subNavItemClasses}>
      <Button color={buttonColor} fullWidth={isSubMenu} {...buttonAction} className={buttonClasses}>
        {linkText}
        {hasSubMenu && <Icon icon={arrowIcon} className="c-subnav__icon  c-subnav__icon--right" /> }
      </Button>

      {hasSubMenu && enableSubMenu &&
      <ul className="o-list-bare  c-subnav-dropdown__list  c-subnav-dropdown__list--nested">
        <SubMenuItem linkPath={linkPath} gtmEvent={gtmEvent} linkText={accessibleLinkText || linkText} isSubMenu />
        <MenuItems menuItems={menuList} isSubMenu />
      </ul>
      }
    </li>
  )
}

SubMenuItem.propTypes = {
  gtmEvent: PropTypes.string,
  linkPath: PropTypes.string.isRequired,
  linkText: PropTypes.string.isRequired,
  accessibleLinkText: PropTypes.string,
  menuList: PropTypes.arrayOf(PropTypes.shape({
    gtmEvent: PropTypes.string,
    linkPath: PropTypes.string.isRequired,
    linkText: PropTypes.string.isRequired,
  })),
  isSubMenu: PropTypes.bool,
}

SubMenuItem.defaultProps = {
  isSubMenu: false,
}
