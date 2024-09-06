/* eslint-disable jsx-a11y/label-has-for */
import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Button, Panel } from '@insight/toolkit-react'
import {Label} from "@insight/toolkit-react/lib/Form/Components/Decorators"

import AppContext from '../context/AppProvider'
import { clickedClass, unclickedClass, PAGES } from '../constants'
import { transformContractsArray } from '../helpers'
import { fetchContracts } from "../api/us"

class Contracts extends Component {
  constructor(props, context) {
    super(props, context)  

    const { contractList = [], partnerNumber, consortiaAgreement } = context.setupDeliveryInfo
    const contractValues = transformContractsArray(props.contractInfo.contracts, contractList)      
    const myConsortiaAgreement = consortiaAgreement || props.consortiaAgreement    

    this.state = {
      contractValues,
      consortiaContracts: props.contractInfo.consortiaContracts,
      consortiaAgreement: myConsortiaAgreement,
      count: contractList ? contractList.length : 0,
      hasError: false,
      isEditable: false,
      isLoading: false,
      soldTo: partnerNumber || props.clientInfo.soldTo,
    }
  }
  
  onConfirm = () => {    
    const { soldTo } = this.state
    const { setupDeliveryInfo: { partnerNumber }, updateClientInfo, updateDeliveryFields, webGroupId, contractInfo, updateContractInfoData } = this.context
    this.setState({ isLoading: true })
    fetchContracts(soldTo, webGroupId)
      .then(({ data: { contracts, validSoldto} }) => {
        if (validSoldto) {
          updateDeliveryFields({ contractList: null, partnerNumber: soldTo })
          updateClientInfo({ contracts })
          const newContractInfoData = {...contractInfo, contracts: contracts}
          updateContractInfoData(newContractInfoData)
          const contractValues = transformContractsArray(contracts)
          this.setState({ contractValues, count: 0 })
        } else {          
          this.setState({ soldTo: partnerNumber, hasError: true })
        }
        this.setState({ isEditable: false, isLoading: false })
      })
  }

  handleClick = ({currentTarget}) => {
    const { value } = currentTarget
    this.setState(({count, contractValues}) => ({
        count: contractValues[value] ? count-1 : count+1,
        contractValues: {...contractValues, [value]: !contractValues[value] }
      }))
  }

  handleSelect = ({currentTarget}) => {
    const { value } = currentTarget
    this.setState(() => ({
        consortiaAgreement: value
      }))
  }

  viewNextStep = (contractValues, consortiaAgreement) => {
    const values = Object.keys(contractValues).filter(contractId => contractValues[contractId])
    
    this.context.updateSelectedContracts({contracts: values, consortiaAgreement})
    this.context.onSelectedTabChange(PAGES.OCCURRENCES)
  }

  render() {
    const {count, contractValues, hasError, isEditable, isLoading, soldTo, consortiaContracts, consortiaAgreement} = this.state
    const hasConsortiaContracts = Array.isArray(consortiaContracts) && consortiaContracts.length > 0

    const renderContracts = Object.keys(contractValues).map((contract) => (
      <div key={contract} className="o-grid__item  u-1/5 u-margin-bot-tiny">
        <button
          className={(contractValues[contract]) ? clickedClass : unclickedClass}
          type="button"
          onClick={this.handleClick}
          value={contract}
        >
          {contract}
        </button>
      </div>
    ))
    
    
    return (
      <div className="o-grid c-contracts">
        <div className="o-grid__item u-1/1">
          { isEditable ? (
            <div className='c-form__element'>
              <Label id="port-label" required htmlFor="soldTo">Sold To: </Label>
              <div className="c-form__control">
                <input className="c-input" id="soldTo" type="text" onChange={e => this.setState({soldTo: e.target.value})} value={soldTo} />
              </div>
              <Button color='primary' onClick={this.onConfirm} isLoading={isLoading} className="c-confirm-button">
                Confirm
              </Button>
            </div>
          ) : (
            <Fragment>
              <span className="u-bold">Sold To: </span>
              {soldTo}
              <Button
                color='primary'
                onClick={() => this.setState({ hasError: false, isEditable: true })}
                className="c-soldto-button"
              >
                Edit
              </Button>
              { hasError && (
                <span className='c-soldto-error'>Must enter a valid soldTo.</span>
              )}
            </Fragment>
          )}
        </div>
        <div className="o-grid__item u-1/1">
          <h4 className="u-margin-bot">You can select contract(s) you want to save.  If this is not required, continue to next step.</h4>
          <div className="o-grid u-margin-bot">
            { renderContracts }   
          </div>

          <Fragment>
            <label className="c-form__label">Number of selected contracts:{count}</label>

            { hasConsortiaContracts && (
              <div className="o-grid__item u-1/1">
                Consortia Agreement:
                <select className="c-consortia-select" value={consortiaAgreement} onChange={this.handleSelect}>
                  <option key={-1} value={-1}>Select a Consortia Contract...</option>
                  {consortiaContracts.map((consortia) => (
                    <option key={consortia.id} value={consortia.id}>{consortia.name}</option>
                    ))}
                </select>
              </div>
            ) }

            <Panel className="u-text-right">
              <Panel.Body>
                <Button
                  color="primary"
                  onClick={() => this.viewNextStep(contractValues, consortiaAgreement)}
                  isDisabled={isEditable}
                >
                  Continue
                </Button>
              </Panel.Body>
            </Panel>
          </Fragment>
        </div>
      </div>
    )
  }
}

Contracts.contextType = AppContext

Contracts.defaultProps = {
  consortiaAgreement: null,
  soldTo: null,
}

Contracts.propTypes = {
  contractInfo: PropTypes.shape({
    contracts: PropTypes.arrayOf(PropTypes.string).isRequired,
    consortiaContracts: PropTypes.arrayOf(PropTypes.string).isRequired,    
  }),
  consortiaAgreement: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  soldTo: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
}



export default Contracts

