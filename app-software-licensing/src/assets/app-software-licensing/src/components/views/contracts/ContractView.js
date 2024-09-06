import React, { Fragment } from 'react'
import { Field, Icon } from '@insight/toolkit-react'
import PropTypes from 'prop-types';
import { t } from '@insight/toolkit-utils';
import ContractIpsHeaderView from './ContractIpsHeaderView'
import ContractHeaderView from './ContractHeaderView'
import { disableContractSelection } from '../../../lib'
import { agreementInfo, alertAgreementLabel } from '../../../constants'

export default function ContractView ({agreement, checkboxes, isBrowseBySoftwareAgreementsEnabled, openCloseModal, updateCheckbox, currentReportingMonth, programId, isEMEA}){
  const { id, ipsContractName, name } = agreement

  const getCheckboxState = () => {
    return checkboxes && checkboxes[id]
  }

  const toggleSelect = () => {
    const checkboxStatus = !checkboxState;
    updateCheckbox(id, checkboxStatus);
  }

  const description = (programId) => {
    const labelKey = isEMEA ? programId+"-EMEA" : programId
    /**
     * only show tooltip content if it is provided in the labels file
     * for NA, programId will be the key
     * for EMEA region, `${programId}-EMEA` will be the key
    **/
    return t(labelKey) === labelKey ? null : t(labelKey)
  }

  const checkboxState = getCheckboxState()

  /* TODO - fix alignment for checkbox */
  return (
    <Fragment>
      { ipsContractName &&
        <div className="o-grid__item  u-1/1  u-1/1@tablet">
          <ContractIpsHeaderView ipsContractName={ipsContractName} />
        </div>
      }
      <div className="o-grid__item  u-1/1  u-1/1@tablet u-1/4@desktop c-software-license__padding-top">
        {disableContractSelection(agreement) ?
          <div className="c-software-license__display-flex c-software-license__padding-bot u-hide@print">
            <span className="c-software-license__margin-right"><Icon icon="alert" type="error" title={t(alertAgreementLabel)} /></span>
            <span className="c-software-license__margin-right">{name}</span>
            {description(programId) &&
              <Icon icon="help-circle" className='c-icon--info c-agreement-selection__col__icon' title={t(agreementInfo)} onClick={() => openCloseModal(description(programId), name, false, currentReportingMonth, programId)} />
            }            
          </div>
        : <div className="c-agreement-selection u-hide@print">
            <div className="c-agreement-selection__col c-software-license__margin-right">
              <Field
                className='u-hide@print'
                name="checkbox"
                fieldComponent="Checkbox"
                type="checkbox"
                handleChange={toggleSelect}
                checked={checkboxState}
                autoComplete="off"
                checkboxLabel={name}
              />
            </div>
            {description(programId) &&
              <div className="c-agreement-selection__col">
                <Icon icon="help-circle" className='c-icon--info c-agreement-selection__col__icon' title={t(agreementInfo)} onClick={() => openCloseModal(description(programId), name, false, currentReportingMonth, programId)} />
              </div>
            }            
          </div>
        }

        <ContractHeaderView
          agreement={agreement}
          isBrowseBySoftwareAgreementsEnabled={isBrowseBySoftwareAgreementsEnabled}
          openCloseModal={openCloseModal}
        />
      </div>
    </Fragment>
  )

}
ContractView.propTypes = {
  agreement: PropTypes.shape({
    active: PropTypes.bool,
    agreementId: PropTypes.string,
    enrollmentId: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    programId: PropTypes.string
  }).isRequired,
  checkboxes: PropTypes.objectOf(PropTypes.bool).isRequired,
  isBrowseBySoftwareAgreementsEnabled: PropTypes.bool.isRequired,
  openCloseModal: PropTypes.func.isRequired,
  updateCheckbox: PropTypes.func.isRequired,
  currentReportingMonth: PropTypes.string.isRequired,
  programId: PropTypes.string.isRequired
}
