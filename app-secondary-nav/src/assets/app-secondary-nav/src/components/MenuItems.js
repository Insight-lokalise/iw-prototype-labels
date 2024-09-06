import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import MenuItem from "./MenuItem";
import SubMenuItem from "./SubMenuItem";

export default function MenuItems({menuItems, isSubMenu}) {
  return (
    <Fragment>
      {menuItems.map(menu => {
        return (
          isSubMenu ?
            <SubMenuItem {...menu} isSubMenu={isSubMenu} key={menu.linkText} />
            :
            <MenuItem {...menu} isSubMenu={isSubMenu} key={menu.linkText} />
        )
      })}
    </Fragment>
  )
}

MenuItems.propTypes = {
  menuItems: PropTypes.arrayOf(PropTypes.shape({
    gtmEvent: PropTypes.string,
    linkPath: PropTypes.string.isRequired,
    linkText: PropTypes.string.isRequired,
  })),
  isSubMenu: PropTypes.bool,
}

MenuItems.defaultProps = {
  isSubMenu: false,
}
