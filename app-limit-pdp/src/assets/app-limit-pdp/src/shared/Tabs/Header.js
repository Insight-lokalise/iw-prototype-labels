import React from 'react'
import cn from 'classnames'

// Get header content value
const headerContent = ({ props }) => {
  return props.header ? props.header() : props.label ? props.label : props.id
}

export const Header = ({
  headerColumns,
  isMobile,
  selectedTabId,
  setSelectedTab,
  tabComponents,
}) => {
  if (isMobile || !tabComponents?.length) return null
  // Render headers
  const renderHeader = () => {
    return tabComponents.map((tab, index) => {
      return (<button
        key={index}
        data-tab={tab.props.id}
        className={cn('c-responsive-tabs__header__tab o-grid o-grid--justify-center o-grid--center', {
          selected: tab.props.id === selectedTabId,
        })}
        tabIndex="0"
        onClick={() => {
          tab.props.onClick()
          setSelectedTab(tab)
        }}
      >
        <strong className='c-responsive-tabs__header__tab--name'>{headerContent(tab)}</strong>
      </button>)
    })
  }
  return (
    <header
      className="c-responsive-tabs__header"
      columns={headerColumns}
      style={{ gridTemplateColumns: `repeat(${headerColumns}, 1fr)` }}
    >
      {renderHeader()}
    </header>
  )
}

export default Header
