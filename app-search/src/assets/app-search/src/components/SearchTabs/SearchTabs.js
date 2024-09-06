import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Tabs } from '@insight/toolkit-react'
import RoundedTab from './Components/RoundedTab'

const SearchTabs = ({ tabs, onTabClick, initialSelectedTab, expand }) => {
  const [selectedTab, setSelectedTab] = useState(tabs[0])
  const onTabPress = (selected) => {
    if (onTabClick) {
      onTabClick(selected)
      setSelectedTab(selected)
    }
  }

  useEffect(() => {
    if (initialSelectedTab >= 0) {
      setSelectedTab(tabs[initialSelectedTab])
    }
  }, [initialSelectedTab, tabs, onTabClick])

  return (
    <div className="o-grid">
      <Tabs expand={expand}>
        {tabs.map((tab, index) => {
          const {
            content,
            contentClassName,
            id,
            name,
            tabClassName,
            ...tabProps
          } = tab
          const props = {
            'aria-controls': `${id}`,
            id,
            isSelected: id === selectedTab?.id,
            key: id,
            onClick: () => onTabPress(tab),
            ...tabProps,
          }

          return (
            <RoundedTab {...props} key={index * 2}>
              {name}
            </RoundedTab>
          )
        })}
      </Tabs>

      <div aria-labelledby={selectedTab?.id} role="tabpanel" className='c-search-page__search__tabpanel'>
        {selectedTab?.content}
      </div>
    </div>
  )
}

SearchTabs.propTypes = {
  expand: PropTypes.bool,
  initialSelectedTab: PropTypes.object,
  onTabClick: PropTypes.func,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.node.isRequired,
      contentClassName: PropTypes.string,
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      tabClassName: PropTypes.string,
    })
  ).isRequired,
}

export default SearchTabs
