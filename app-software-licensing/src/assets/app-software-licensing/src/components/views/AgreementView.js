import React, { Component } from 'react'
import { Button } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils';
import PropTypes from 'prop-types';
import AgreementModal from '../AgreementModal'
import ContractView from './contracts/ContractView'
import ContractDetailsView from './contracts/ContractDetailsView'
import ReportUsageView from './ReportUsageView'
import { getAssortmentInfo, getSearchResultsURL, disableContractSelection } from '../../lib'
import {contactRep, contactSpecialist, viewLevels, viewProducts, levels as levelHeader} from '../../constants'

export default class AgreementView extends Component {
  state = {
    isUsageReportableModal: false,
    modalIsOpen: false,
    modalBodyContent: '',
    modalHeaderContent: '',
    currentReportingMonth: '',
    programId: ''
  }

  openCloseModal = (description, header, isUsageReportableModal, currentReportingMonth, programId) => {
    this.setState({
      isUsageReportableModal,
      modalBodyContent: description,
      modalHeaderContent: header,
      modalIsOpen: !this.state.modalIsOpen,
      currentReportingMonth,
      programId
    })
  }

  render (){
    const {
      checkboxes,
      updateCheckbox,
      manufacturer,
      isEMEA,
    } = this.props

    const { isUsageReportableModal, modalBodyContent, modalHeaderContent, modalIsOpen, currentReportingMonth, programId } = this.state
    const { isBrowseBySoftwareAgreementsEnabled, showLoading }= this.props

    return (
      <div className="o-grid  o-grid--center  c-software-license__row" key={manufacturer.name}>
        {manufacturer.agreements.map(agreement => {
          const { active, assortments, usageReportable } = agreement
          const { assortmentIds, levels } =  getAssortmentInfo(assortments)
          const commaSeperatedAssortments = assortmentIds ? assortmentIds.join(',') : ''
          const productsURL = getSearchResultsURL(agreement.id, commaSeperatedAssortments)

          return (
            <div key={agreement.id} className="o-grid__item  u-1/1  c-software-license__cell  c-software-license__cell--agreement">
              <div className="o-grid o-grid--gutters-medium">
                <ContractView
                  agreement={agreement}
                  checkboxes={checkboxes}
                  isBrowseBySoftwareAgreementsEnabled={isBrowseBySoftwareAgreementsEnabled}
                  openCloseModal={this.openCloseModal}
                  updateCheckbox={updateCheckbox}
                  currentReportingMonth={agreement.currentReportingMonth}
                  programId={agreement.programId}
                  isEMEA={isEMEA}
                />
                <ContractDetailsView agreement={agreement} />                
                {isBrowseBySoftwareAgreementsEnabled && !disableContractSelection(agreement) &&
                  <div className='o-grid__item  u-1/1  u-hide@tablet c-software-license__view-products c-software-license__padding-bot u-hide@print'>
                    <Button color="secondary" isDisabled={!agreement.active} className="c-button--block" onClick={() => window.location.href = productsURL}>{t(viewProducts)}</Button>
                  </div>
                }
                { !disableContractSelection(agreement) ?
                  <div className='o-grid__item  u-1/1  u-hide@tablet c-software-license__view-products u-hide@print'>
                    <Button color='secondary' className='c-button--block' onClick={() => this.openCloseModal(levels, levelHeader)}>{t(viewLevels)}</Button>
                  </div>
                :
                  <a href={`mailto:${agreement.repEmail}`} className='c-software-license__padding-bot u-hide@tablet'>
                    {agreement.usageReportable ? t(contactSpecialist) : t(contactRep)}
                    </a>
                }
              </div>
              { !disableContractSelection(agreement) && usageReportable &&
                <ReportUsageView
                  agreement={agreement}
                  openCloseModal={this.openCloseModal}
                  name={manufacturer.name}
                  showLoading={showLoading}
                />
              }
            </div>
          )
        })}
        {modalIsOpen && <AgreementModal
          currentReportingMonth={currentReportingMonth}
          isUsageReportableModal={isUsageReportableModal}
          openCloseModal={this.openCloseModal}
          modalBodyContent={modalBodyContent}
          modalHeaderContent={modalHeaderContent}
          modalIsOpen={modalIsOpen}
          programId={programId}
        />
        }
      </div>
    )
  }
}

AgreementView.propTypes = {
  checkboxes: PropTypes.objectOf(PropTypes.bool).isRequired,
  isBrowseBySoftwareAgreementsEnabled: PropTypes.bool.isRequired,
  manufacturer: PropTypes.shape({
    agreements: PropTypes.arrayOf(PropTypes.shape({
      active: PropTypes.bool,
      agreementId: PropTypes.string,
      currentReportingMonth: PropTypes.string,
      enrollmentId: PropTypes.string,
      id: PropTypes.string,
      assortments: PropTypes.objectOf(PropTypes.string),
      name: PropTypes.string,
      programId: PropTypes.string
    })),
    expiredAgreement: PropTypes.bool,
    name: PropTypes.string
  }).isRequired,
  updateCheckbox: PropTypes.func.isRequired,
  showLoading: PropTypes.func.isRequired,
}
