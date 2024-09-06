import React, { useState, useEffect } from 'react'
import { useSelector } from "react-redux";
import { Loading, Panel, Button, Icon } from '@insight/toolkit-react'
import { t, l, getCookie, setCookie } from '@insight/toolkit-utils'

import { SearchBar, SearchProvider } from "./components/Search";
import Routes from './components/Routes'
import { parse } from './components/Shared'
import { getLanguage } from './lib'
import { selector_isLoaded, selector_webGroupSettings } from "./duck"

export default function App() {
  const [showSearch, setShowSearch] = useState(true)

  useEffect(() => {
    let searchCookie = getCookie('csSearch')
    if(searchCookie === '' || searchCookie === null) {
      setShowSearch(true)
    } else {
      setShowSearch(searchCookie)
    } 
  }, [])

  const locale = l()
  const language = getLanguage(locale)
  const { isLoaded, webGroupSettings } = useSelector(state => ({
    isLoaded: selector_isLoaded(state),
    webGroupSettings: selector_webGroupSettings(state),
  }))

  const toggleSearch = () => {
    setCookie('csSearch', !showSearch)
    setShowSearch(!showSearch)
  }

  return isLoaded ? (
    <div className="c-cs-container">
      <SearchProvider locale={locale} >
        <Panel className="c-cs-searchPanel u-padding-small">
          <Panel.Body className="c-cs-panel__body">
            <h1 className="u-h2 u-text-bold u-margin-bot-small">{webGroupSettings.header[language] || t("Company Standards")}</h1>
            <Button color="link" className='u-padding-left-none' size='small' onClick={toggleSearch}>
              {showSearch ? t('Collapse') : t('Expand')} <Icon icon="swap" className="c-icon--swap" />
            </Button>
            {showSearch && (
              <>
                <div className='c-cs-search__welcome-text'>{parse(webGroupSettings.welcomeText[language] || webGroupSettings.welcomeText['en'])}</div>
                <div className="o-grid">
                  <div className="o-grid__item u-1/1 u-1/2@tablet">
                    <SearchBar />
                  </div>
                </div>
              </>
            )}
          </Panel.Body>
        </Panel>
        <Panel className="u-padding">
          <Panel.Body>
            <Routes />
          </Panel.Body>
        </Panel>
      </SearchProvider>
    </div>
  ) : (<Loading />)
}

