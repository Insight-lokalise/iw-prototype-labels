import React, { Component, Fragment } from 'react'
import { Panel, Loading } from '@insight/toolkit-react'
import { fetchRunCount, fetchClientInfo, fetchSetupDeliveryData } from 'api'
import Header from './Header'
import RunCountMessage from './RunCountMessage'
import NavBar from './NavBar'
import Pages from './Pages'
import AppContext from '../context/AppProvider'
import { checkRunCount, appendContractType } from '../helpers'
import { RUN_COUNT_LIMIT } from '../constants'


class App extends Component {

  state = {
    runCount: 0,
    clientInfo: {},
    contractInfo: {},
    isLoading: true
  }

  componentDidMount() {
    fetchClientInfo().then(({data}) => {      
      const {
        catalogId,
        contracts,
        commodityVersions,
        consortiaAgreement,
        consortiaContracts,
        contractExists,
        eComServiceUrl,
        filesTypes,
        languages,
        region,
        salesOrg,
        soldTo,
        unspsc,
        userEmail,
        webGroupId } = data
       

      const appendedContracts = appendContractType(contracts)
      const consortiaExists = !!consortiaContracts && Array.isArray(consortiaContracts) && consortiaContracts.length > 0
      
      this.context.updateClientInfo({
        catalogId: catalogId ? catalogId.trim() : "",
        commodityVersions,
        consortiaAgreement,
        consortiaContracts,
        consortiaExists,
        contractExists,
        contracts: appendedContracts,
        eComServiceUrl,
        filesTypes,
        languages,
        region,
        salesOrg,
        soldTo,
        unspsc,
        userEmail,
        webGroupId,
      })

      this.fetchPageData(data);
    })
  }

  fetchPageData({ catalogId, contracts, contractExists: hasContracts, consortiaAgreement, consortiaContracts, salesOrg, soldto: soldTo, webGroupId }) {
    const hasConsortiaContracts = Array.isArray(consortiaContracts) && consortiaContracts.length > 0
    const appendedContracts = appendContractType(contracts)
    const contractInfo = { hasContracts, contracts: appendedContracts, hasConsortiaContracts, consortiaAgreement, consortiaContracts }
    this.context.updateContractInfoData(contractInfo)
    const clientInfo = { soldTo, salesOrg, catalogId: catalogId ? catalogId.trim() : "", webGroupId }
    if (catalogId) {
       Promise.all([fetchSetupDeliveryData(catalogId), fetchRunCount(clientInfo)]).then((result) => {
          const response = result[0].data || {};
          const contractList = (response.contractList || []).filter(contract => contractInfo.contracts.includes(contract))
          response.contractList = contractList;
          this.context.updateDeliveryFields(response);
          this.context.onSelectedTabChange("contracts");
          this.setState({ contractInfo, isLoading: false, clientInfo, runCount: result[1].data });
        }).catch(err => {
          console.error(err.message);
        })
    } else {
      this.setState({runCount: 0 });
    }
  }

  runCountRender = () => {
    const { runCount, clientInfo} = this.state
    const { updateDeliveryFields, contractInfo } = this.context

    if(!clientInfo.catalogId)
      return (
        <RunCountMessage message='Please create a Custom Catalog to use this feature.' />
      )

    if(checkRunCount(runCount, RUN_COUNT_LIMIT))
      return (
        <RunCountMessage message={`Sorry, your run count currently exceeds ${RUN_COUNT_LIMIT} products, so you cannot access this page. Please pick a different catalog ID with products less than ${RUN_COUNT_LIMIT}.`} />
      )

    return (   
      <Fragment>        
        <Header
          info={clientInfo}
          runCount={runCount}
          updateDeliveryFields={updateDeliveryFields}
        />
        <Panel>
          <Panel.Body>
            <NavBar contractInfo={contractInfo} />            
            <Pages contractInfo={contractInfo} clientInfo={clientInfo}/>
          </Panel.Body>
        </Panel>
      </Fragment>    
    )
  }

	render() {
    const {isLoading} = this.state
    return (
      <div className="c-container c-app-obc">
        { isLoading ? <div className="u-text-center"><Loading size='large' /></div> : this.runCountRender() }        
      </div>
    )
	}
}

App.contextType = AppContext
export default App
