import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import Contracts from './Contracts'
import {Occurrences} from './Occurrences'
import SetupDelivery from './SetupDelivery'
import CatalogFieldInfo from './CatalogFieldInfo'
import AppContext from '../context/AppProvider'
import { PAGES } from '../constants'

export default function Pages({contractInfo, clientInfo}) {

  const { selectedTabId  } = useContext(AppContext)      

  function renderPage() {    

    let component = "";
    switch(selectedTabId) {
      case PAGES.CONTRACTS:        
        component = <Contracts {...{contractInfo, clientInfo} }/>
        break;
      case PAGES.OCCURRENCES:
        component = <Occurrences />
        break;
      case PAGES.DELIVERY:        
        component = <SetupDelivery clientInfo={clientInfo}/>
        break;
      case PAGES.CATALOG:
        component = <CatalogFieldInfo hasContracts={contractInfo.hasContracts} />
        break;

      default:         
        component = <Contracts {...{contractInfo, clientInfo} }/>

    }
    return component
  }

  

  return renderPage()
}

Pages.propTypes = {
  contractInfo: PropTypes.shape({
    hasContracts: PropTypes.bool,
    contracts: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  clientInfo: PropTypes.object
}
