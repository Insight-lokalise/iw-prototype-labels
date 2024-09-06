import React, { useState, useEffect, cloneElement, useMemo } from 'react'
import { isMobile, throttle } from '@insight/toolkit-utils'
import { Header } from './Header'
import { Tab } from './Tab'
import './Tabs.scss'

export const Tabs = ({ children, columns, selected }) => {
  // Generate a memoized list of tabs
  const tabComponents = useMemo(() => {
    // Convert all children into an array
    const childrenArray = React.Children.toArray(children)
    // Filter children array for tab components
    return (
      childrenArray
        .filter((child) => child.type === Tab)
        // Set default tab id
        .map((tab, index) =>
          cloneElement(tab, {
            id: tab.props.id ? `tab-${tab.props.id}` : `tab-${index}`,
            onClick: tab.props.onClick ? tab.props.onClick : () => {},
          })
        )
    )
  }, [children])

  const [selectedTab, setSelectedTab] = useState(() => {
    if (!selected) return tabComponents[0]
    // Filter tab components for selected tab
    const defaultTabSelection = tabComponents.find(
      (tab) => tab.props.id === selected
    )
    // Return first tab if default tab selection is not found
    if (!defaultTabSelection) return tabComponents[0]
    return defaultTabSelection
  })

  // Used to show mobile view
  const [isOnMobile, setIsOnMobile] = useState(isMobile())

  useEffect(() => {
    const onResize = throttle(() => {
      setIsOnMobile(isMobile())
    }, 250)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  const headerColumns = columns || tabComponents.length

  // Select new tab on selected prop change
  useEffect(() => {
    if (!tabComponents?.length || !selected) return
    // Filter tab components for selected tab
    const newTabSelection = tabComponents.find(
      (tab) => tab.props.id === selected
    )
    // Set selected tab to new tab selection
    if (newTabSelection) setSelectedTab(newTabSelection)
  }, [children, selected])
  // Return if no tabs are present
  if (!tabComponents?.length) return null

  const renderBody = () => {
    // Default view
    if (!isOnMobile) return cloneElement(selectedTab)
    // Mobile view
    return tabComponents.map((tab, index) => {
      return (
        <section key={index} id={tab.props.id}>
          <header className="c-responsive-tabs__content__section-header">
            {tab.props.label ? tab.props.label : tab.props.id}
          </header>
          <div>{cloneElement(tab)}</div>
        </section>
      )
    })
  }
  return (
    <div
      id="tabs"
      className="c-responsive-tabs"
      data-selected={selectedTab.props.id}
      data-testid="tabs"
    >
      <Header
        headerColumns={headerColumns}
        isMobile={isOnMobile}
        selectedTabId={selectedTab.props.id}
        setSelectedTab={setSelectedTab}
        tabComponents={tabComponents}
      />
      <section
        aria-labelledby={selectedTab.props.id}
        className="c-responsive-tabs__content"
        role="tabpanel"
      >
        {renderBody()}
      </section>
    </div>
  )
}
export default Tabs
