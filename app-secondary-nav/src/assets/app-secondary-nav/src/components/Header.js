import React, {Fragment, useState, useEffect} from 'react'
import PropTypes from 'prop-types'

import Button from "@insight/toolkit-react/lib/Button/Button"
import Icon from "@insight/toolkit-react/lib/Icon/Icon"
import isDesktop from '@insight/toolkit-utils/lib/media/isDesktop'
import debounce from '@insight/toolkit-utils/lib/timing/debounce'
import { linkTransformer } from './../lib/linkTransformer'

export default function Header({children, link, theme, title, mobileTitle}) {
  const desktopScreen = isDesktop()
  // Note showTopLevelMenu, isDesktopScreen state variables seems like same as initialized same and updated on same
  // event handler. but showTopLevelMenu is also controlled by button when interacted on mobile (check line 30)
  const [showTopLevelMenu, setShowTopLevelMenu] = useState(desktopScreen);
  const [isDesktopScreen, setDesktopScreen] = useState(desktopScreen);

  useEffect(() => {
    const handleResize = () => {
      const isItDesktop = isDesktop()
      setShowTopLevelMenu(isItDesktop)
      setDesktopScreen(isItDesktop)
    };
    const debouncedResize = debounce(handleResize);
    window.addEventListener('resize', debouncedResize)
    return () => {
      window.removeEventListener('resize', debouncedResize)
    };
  });

  const subNavClasses = `c-subnav  c-subnav--${theme}`
  const HeaderButtonAction = isDesktopScreen ? {href: linkTransformer(link)} : {onClick: ()=>setShowTopLevelMenu(!showTopLevelMenu)}
  return (
    <nav className={subNavClasses}>
      <div className="o-wrapper">
        <ul className="o-list-inline  o-list-inline--flush  c-subnav__list  u-margin-bot-none">
          <li className="o-list-inline__item  c-subnav__item  c-subnav__item--heading">
            <Button color="none" {...HeaderButtonAction} className="c-subnav__link  c-subnav__link--heading">
              <h3 className="c-subnav__heading">
                {title}
                <Icon icon="arrow-down" className="c-subnav__icon  c-subnav__icon--heading  u-hide@desktop" />
              </h3>
            </Button>
          </li>
          {showTopLevelMenu &&
            <Fragment>
              <li className="o-list-inline__item  c-subnav__item  u-hide@desktop">
                <Button color="none" href={linkTransformer(link)} className="c-subnav__link  c-subnav__link--view-all">
                  {mobileTitle}
                </Button>
              </li>
              {children}
            </Fragment>
          }
        </ul>
      </div>
    </nav>
  )
}

Header.propTypes = {
  children: PropTypes.node.isRequired,
  link: PropTypes.string.isRequired,
  theme: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  mobileTitle: PropTypes.string.isRequired,
}
