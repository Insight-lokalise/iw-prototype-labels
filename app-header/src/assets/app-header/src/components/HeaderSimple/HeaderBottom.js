import React from 'react'
import PropTypes from "prop-types";
import Header from '@insight/toolkit-react/lib/Header/Header'
import DesktopNav from '../IAHeaderBottom/DesktopNav'
import SearchBar from './Search/SearchBar';
import MenuLink from './Navigation/MenuLink';

/* The bottom part of the header (logo, main nav, and search) */
export default function HeaderBottom({isDesktop}) {

  return (
    <div className="c-header-simple__bottom">
      {isDesktop &&
        <Header.Nav>
          <DesktopNav isCES />
        </Header.Nav>
      }
      {!isDesktop &&
        <nav className="c-header-simple-mob">
          <ul className="o-list-inline  o-list-inline--flush  c-header-simple-mob__list">
            <MenuLink />
            <SearchBar isDesktop={isDesktop} />
          </ul>
        </nav>        
      }
    </div>
  )
}

HeaderBottom.propTypes = {
  isDesktop: PropTypes.bool.isRequired,
}
