import React from 'react'
import PropTypes from 'prop-types';
import { t } from '@insight/toolkit-utils';
import { Button, Field, Icon } from '@insight/toolkit-react'
import { effectiveDate, expirationDate, enrollmentCountry, anniversaryMonth, collapseAll, expandAll, selectAll } from '../../../constants'

export default function AgreementHeader(props){

  const {
    enableSelect,
    isBrowseBySoftwareAgreementsEnabled,
    isExpandClicked,
    toggleExpanded, 
    selectAllState,
    toggleSelectAll,
    agreementSize,
  } = props

  return (
    <div className="o-grid__item  u-1/1">
      <div className="o-grid o-grid--gutters-medium c-software-license__padding-top">
        <div className="o-grid__item  u-1/1 u-1/4@desktop">    
            <div className='o-grid o-grid--gutters u-hide@print c-software-license__padding-bot'>              
                {isBrowseBySoftwareAgreementsEnabled &&
                  <div className='o-grid__item u-1/2'>
                    <Field
                      disabled={!enableSelect}
                      name="selectAll"
                      fieldComponent="Checkbox"
                      type="checkbox"
                      checked={selectAllState}
                      checkboxLabel={t(selectAll)}
                      handleChange={toggleSelectAll}
                      autoComplete="off"
                    />
                  </div>
                }
                {isBrowseBySoftwareAgreementsEnabled &&
                  <div className='o-grid__item u-1/2 u-1/2@tablet c-software-license__toggle'>
                    <Button color="link" className='c-button--inline-link' isDisabled={agreementSize==0}  onClick={toggleExpanded}>{isExpandClicked ? t(collapseAll) : t(expandAll)}<Icon icon='swap' className='c-icon--swap' /></Button>
                  </div>
                }              
            </div>
        </div>
        <div className="o-grid__item u-1/1 u-3/4@desktop u-show@desktop">
          <div className="o-grid o-grid--gutters c-software-license__cell--header c-software-license__padding-bot">
            <div className="o-grid__item  u-1/4">{t(effectiveDate)}</div>
            <div className="o-grid__item  u-1/4">{t(expirationDate)}</div>
            <div className="o-grid__item  u-1/4">{t(anniversaryMonth)}</div>
            <div className="o-grid__item  u-1/4">{t(enrollmentCountry)}</div>            
          </div>
        </div>
      </div>
    </div>
  )
}

AgreementHeader.propTypes = {
  isBrowseBySoftwareAgreementsEnabled: PropTypes.bool.isRequired,
  hasActiveContracts: PropTypes.bool.isRequired,
  isExpandClicked: PropTypes.bool.isRequired,
  toggleExpanded: PropTypes.func.isRequired,  
  selectAllState: PropTypes.bool.isRequired,
  toggleSelectAll: PropTypes.func.isRequired,
  agreementSize: PropTypes.number.isRequired,
}
