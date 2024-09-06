import React from 'react'
import PropTypes from 'prop-types'
import Header from '@insight/toolkit-react/lib/Header/Header'
import SearchBar from './Search/SearchBar'
import CartLink from './Navigation/CartLink'
import PersonLink from './Navigation/PersonLink'
import LocaleLink from './Navigation/LocaleLink'
import ClientAdmin from '../IAHeaderTop/ClientAdmin'
import SkipLink from '../IAHeaderTop/SkipLink'
import { MASTHEAD_ICON_TITLES_HOMEPAGE } from '../../api/common/constants'
import { t } from "@insight/toolkit-utils/lib/labels";

export default function HeaderTop({ isDesktop, isCheckout }) {
  return (
    <div className="c-header-simple__top">
      <Header.Logo href="/" title={t(MASTHEAD_ICON_TITLES_HOMEPAGE)}/>
      <ul className="o-list-inline  o-list-inline--flush">
        <SkipLink isCES />
      </ul>
      {isDesktop && !isCheckout && <SearchBar isDesktop={isDesktop} />}
      <nav>
        <ul className="o-list-inline  o-list-inline--flush  c-header-simple-nav">
          {isDesktop && <ClientAdmin />}
          <PersonLink isDesktop={isDesktop} />
          <LocaleLink isDesktop={isDesktop} />
          <CartLink />
        </ul>
      </nav>
    </div>
  )
}

HeaderTop.propTypes = {
  isDesktop: PropTypes.bool.isRequired,
  isCheckout: PropTypes.bool.isRequired,
}
