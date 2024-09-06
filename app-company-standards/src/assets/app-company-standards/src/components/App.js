import React from 'react'
import PropTypes from 'prop-types'
import { BrowserRouter } from 'react-router-dom'
import { IconSymbols, FlagSymbols, Loading } from '@insight/toolkit-react'
import cn from 'classnames'

import { LanguageProvider } from '../lib'
import { AppTitle, LanguageDropdown, Locked } from './Shared'
import UniversalMessageContextProvider from './UniversalMessages/UniversalMessageContextProvider'
import UniversalMessageRenderer from './UniversalMessages/UniversalMessageRenderer'
import ModalContextProvider from './Modals/ModalContextProvider'
import ModalRenderer from './Modals/ModalRenderer'
import TabNavigation from './Navigation/TabNavigation'
import Routes from './Routes'
import { SearchProvider } from "./Search";
import { SearchBar } from './Search'

export default function App({ isManagerView, loadingState, locked, webGroupId }) {
  return !loadingState.hasFailed && !loadingState.isLoading ? (
    <section className={cn("c-cs-container", isManagerView ? 'c-cs-manager ds-v1' : 'c-cs-admin')}>
      <IconSymbols />
      <FlagSymbols />
      <LanguageProvider>
        <SearchProvider wId={webGroupId}>
          <ModalContextProvider>
            <UniversalMessageContextProvider>
              <ModalRenderer />
              <BrowserRouter basename="insightweb">
                <div className="o-grid c-cs-main wrapper">
                  <div className="o-grid__item u-1/1 c-cs-main__header">
                    <div className="o-grid o-grid--justify-between">
                      <div className="o-grid__item u-3/4 o-grid--item__shrink">
                        <AppTitle />
                        <div className="o-grid__item">
                          <SearchBar />
                        </div>
                      </div>
                      <div className="o-grid__item u-1/4 o-grid--item__shrink">
                        <UniversalMessageRenderer />
                        <LanguageDropdown />
                      </div>
                    </div>
                  </div>
                  <div className="o-grid__item u-1/1 c-cs-main__container">
                    {locked ? (
                      <Locked />
                    ) : (
                      <>
                        <TabNavigation isManagerView={isManagerView} webGroupId={webGroupId} />
                        <Routes isManagerView={isManagerView} webGroupId={webGroupId} />
                      </>
                    )}
                  </div>
                </div>
              </BrowserRouter>
            </UniversalMessageContextProvider>
          </ModalContextProvider>
        </SearchProvider>
      </LanguageProvider>
    </section>
  ) : (
    <Loading />
  );
}

App.propTypes = {
  loadingState: PropTypes.shape({
    hasFailed: PropTypes.bool,
    isLoading: PropTypes.bool,
  }).isRequired,
  locked: PropTypes.bool,
  webGroupId: PropTypes.number.isRequired,
}

App.defaultProps = {
  locked: false
}
