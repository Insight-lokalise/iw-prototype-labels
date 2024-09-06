import React, { Component, Fragment } from 'react'
import { Accordion, Icon, Loading } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils/lib/labels';
import { getRegion } from '@insight/toolkit-utils/lib/helpers/localeHelpers';
import HeaderView from './header/HeaderView'
import AgreementView from './AgreementView'
import { getSoftwareLicenseAgreements } from '../../api/us'
import { filterByContractStatus, generateInitiallyExpandedIds, generateCheckboxes, getUserPermissions, getLogoUrl } from '../helpers'
import { noContractsMsg, slaText, alertHeaderLabel } from '../../constants'

export default class SoftwareLicensingView extends Component {
  state = {
    allContracts: [],
    assortmentIds: '',
    contractAndAssortments: {},
    checkboxes: {},
    contractStatuses: [],
    filterBy: 'all',
    isLoading: true,
    licenseAgreements: [],
    parentCheckedState: false,
    isExpandClicked: false,
    initiallyExpandedIds: []
  }

  async componentDidMount() {
    const { data } = await getSoftwareLicenseAgreements()    
    if(data) {
      const checkboxData = generateCheckboxes(data.manufacturerInfos)
      this.getStateFromManufacturers(data.manufacturerInfos, checkboxData)
    }
    else {
      //show no contracts message
      this.showLoading(false)
    }
  }

  getStateFromManufacturers = (manufacturers, checkboxData) => {
    const {checkboxes, contractAndAssortments, assortmentIds} = checkboxData
    this.setState ({
      allContracts: manufacturers,
      contractStatuses: filterByContractStatus(manufacturers),
      isLoading: false,
      licenseAgreements: manufacturers,
      initiallyExpandedIds: [generateInitiallyExpandedIds(manufacturers)],
      checkboxes,
      contractAndAssortments,
      assortmentIds
    })
  }

  showLoading = (show) => {
    this.setState ({
      isLoading: show,
    })
    window.scrollTo(0, 0)
  }
 
  checkIfAllChildrenSelected = (checkboxes, parentIsChecked) => {
    const allSelected = Object.keys(checkboxes).every((key) => checkboxes[key] === true)
    // scenario 1: if parent selectAll is CHECKED && one child is UNCHECKED -> parentAll needs to be unselected
    // scenario 2: if all children checkboxes are CHECKED && parent selectAll is UNCHECKED -> parentAll needs to be selected
    if(!allSelected && parentIsChecked) {
      this.setState({parentCheckedState: false})
    } else if(allSelected && !parentIsChecked){
      this.setState({parentCheckedState: true})
    }
  }

  filterByOptions = ({ target: { value } }) => {
    //small workaround to trigger accordion prop change when the expand id stays the same on filter change
    //allows collapsing of all panels except the first one on filter change
    this.setState({initiallyExpandedIds: []},
      () => {
        this.setState(({ allContracts, contractStatuses }) => {
          const valueToStateMap = {
            'active': contractStatuses.activeContracts,
            'pending': contractStatuses.pendingContracts,
            'expired': contractStatuses.expiredContracts
          }
          const licenseAgreements = valueToStateMap[value] || allContracts
          return {
            filterBy: value,
            initiallyExpandedIds: [generateInitiallyExpandedIds(licenseAgreements)],
            licenseAgreements,
            isExpandClicked: licenseAgreements.length == 1
          }
        });
      }  
    )
    
  }

  updateCheckboxValue = (id, status) => {
    const { assortmentIds } = this.state
    this.setState(({checkboxes, contractAndAssortments}) => ({ checkboxes: { ...checkboxes, [id]: status}, contractAndAssortments: { ...checkboxes, ...contractAndAssortments, [id]: status ? assortmentIds[id] : status} }),
      () => this.checkIfAllChildrenSelected(this.state.checkboxes, this.state.parentCheckedState)
    )
  }

  updateChildren = (bool) => {
    const { assortmentIds } = this.state
    this.setState(({ checkboxes, contractAndAssortments }) => ({
      checkboxes: Object.keys(checkboxes).reduce((prev, id) => ({...prev, [id]: bool}), {}),
      contractAndAssortments: Object.keys(contractAndAssortments).reduce((prev, id) => ({...prev, [id]: bool ? assortmentIds[id] : bool}), {}),
      parentCheckedState: bool
    }));
  }

  setCallbackRefs = (context) => {    
    this.savedCallbacks = context
  }

  savedCallbacks = null

  expandAll = () => {
    this.savedCallbacks.expandAll()
  }

  collapseAll = () => {
    this.savedCallbacks.collapseAll()
  }

  checkIfExpanded = () => {
    if(this.state.isExpandClicked) {
      this.expandAll()
    } else {
      this.collapseAll()
    }
  }

  toggleExpanded  = () => {
    this.setState(({isExpandClicked}) =>  ({
        isExpandClicked: !this.state.isExpandClicked
      }), this.checkIfExpanded)
  }

  updateExpanded = () => {
    const { filterBy, allContracts, contractStatuses } = this.state

    const accordionSize = (() => {
      switch(filterBy) {
        case 'all':
          return allContracts.length          
        case 'active':
          return contractStatuses.activeContracts.length          
        case 'pending':
          return contractStatuses.pendingContracts.length
        case 'expired':
          return contractStatuses.expiredContracts.length
        default:
          return allContracts.length
      }
    })();

    const expandedIds = Object.keys(this.savedCallbacks.expanded).reduce((acc, curr) => {
      if (!!this.savedCallbacks.expanded[curr]) {
        acc.push(curr)
      }
      return acc
    }, [])

    //show collapse all only when all accordion panels are exapnded
    const isExpandClicked = (expandedIds.length === accordionSize) ? true : false
    this.setState({ isExpandClicked })
  }

  manufacturerLogo = (manufacturer) => {
        
    return (<Fragment>
      <img src={getLogoUrl(manufacturer)} alt={manufacturer.name} className="c-software-license__manufaturer-logo" /> {manufacturer.expiredAgreement && <Icon icon="alert" type="error" title={t(alertHeaderLabel)} />}
    </Fragment>)
  }

  renderNoContracts = (filterBy) => {
    const msg = (filterBy != 'all') ? t(`There are currently no ${filterBy} agreements`) : t(`There are currently no agreements`) 
    return <div className="c-software-license__padding-top">{msg}</div>
  }

  renderAccordionItems = (licenseAgreements, isBrowseBySoftwareAgreementsEnabled, getItemProps) => {
    const { checkboxes } = this.state
    const arr = licenseAgreements.map(manufacturer => {
    const manufacturerImg = this.manufacturerLogo(manufacturer)
    const isEMEA = getRegion('insight_current_locale') == "EMEA"
      return (
        <Accordion.Item
          {...getItemProps()}
          key={manufacturer.name}
          content={
            <AgreementView
              checkboxes={checkboxes}
              isBrowseBySoftwareAgreementsEnabled={isBrowseBySoftwareAgreementsEnabled}
              manufacturer={manufacturer}
              updateCheckbox={this.updateCheckboxValue}
              showLoading={this.showLoading}
              isEMEA={isEMEA}
            />
          }
          id={manufacturer.name}
          label={manufacturerImg}
        />
      )
    })
    return arr
  }

  render() {
    const {
      allContracts,
      checkboxes,
      contractAndAssortments,
      filterBy,
      isLoading,
      licenseAgreements,
      parentCheckedState,
      isExpandClicked,
      initiallyExpandedIds
    } = this.state
    const isAgreementSelected = Object.keys(checkboxes).some(contractId => checkboxes[contractId])
    const isSelectAllEnabled = Object.keys(checkboxes).length > 0
    const isBrowseBySoftwareAgreementsEnabled = getUserPermissions()
    const agreementSize = licenseAgreements.length
    return (
      <Fragment>        <div className='c-container c-software-license'>
          <div className='o-box c-panel c-software-license__panel'>
            <h1 className='u-h2'>{t(slaText)}</h1>
            {isLoading ? <div className='u-text-center'><Loading size="large" /></div> :
              (allContracts.length > 0 &&
              <Fragment>
                <HeaderView
                  contractAndAssortments={contractAndAssortments}
                  enableSelect={isSelectAllEnabled}
                  isBrowseBySoftwareAgreementsEnabled={isBrowseBySoftwareAgreementsEnabled}
                  hasActiveContracts={isAgreementSelected}
                  updateChildSelect={this.updateChildren}
                  updatedParentState={parentCheckedState}
                  filterBy={filterBy}
                  filterByOptions={this.filterByOptions}
                  toggleExpanded={this.toggleExpanded}
                  isExpandClicked={isExpandClicked}
                  agreementSize={agreementSize}
                />
                {agreementSize> 0 ? (
                  <Accordion allowMultiple contextRef={this.setCallbackRefs} initiallyExpanded={initiallyExpandedIds} onToggle={this.updateExpanded}>
                    {({getItemProps}) => (
                      <div>
                        {this.renderAccordionItems(licenseAgreements, isBrowseBySoftwareAgreementsEnabled, getItemProps)}
                      </div>
                    )}
                  </Accordion>
                )
                 : this.renderNoContracts(filterBy)}
              </Fragment>) || <div className="c-software-license__padding-top">{t(noContractsMsg)}</div>
            }
          </div>
        </div>
      </Fragment>
    )
  }
}
