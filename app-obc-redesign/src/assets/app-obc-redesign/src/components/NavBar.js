import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import {Tab, Tabs} from '@insight/toolkit-react'
import AppContext from '../context/AppProvider'
import { PAGES } from '../constants'

export default function NavBar({contractInfo}) {

  const { stepCompleted, selectedTabId, onSelectedTabChange } = useContext(AppContext)

  return (    
    <Tabs className="o-grid__item u-margin-bot">
      <Tab
        isSelected={PAGES.CONTRACTS === selectedTabId}
        key={1}
        onClick={() => onSelectedTabChange(PAGES.CONTRACTS)}
      >
        Contracts
      </Tab>
      <Tab
        isSelected={PAGES.OCCURRENCES === selectedTabId}
        key={2}
        onClick={() => onSelectedTabChange(PAGES.OCCURRENCES)}
        disabled={stepCompleted < 1}
      >
        Occurrences
      </Tab>
      <Tab
        isSelected={PAGES.DELIVERY === selectedTabId}
        key={3}
        onClick={() => onSelectedTabChange(PAGES.DELIVERY)}
        disabled={stepCompleted < 2}
      >
        Setup Delivery
      </Tab>
      <Tab
        isSelected={PAGES.CATALOG === selectedTabId}
        key={4}
        onClick={() => onSelectedTabChange(PAGES.CATALOG)}
        disabled={stepCompleted < 3}
      >
        Catalog Information
      </Tab>     
    </Tabs>      
  )
}

NavBar.propTypes = {
  contractInfo: PropTypes.shape({
    contracts: PropTypes.array,
    consortiaContracts: PropTypes.array,
  }).isRequired
}
