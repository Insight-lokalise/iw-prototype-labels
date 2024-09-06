import React, { Fragment } from 'react'
import PropTypes from 'prop-types';
import { Button, Icon } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils';
import { getSearchResultsURL, getAssortmentInfo, disableContractSelection } from '../../../lib'
import { contactRep, contactSpecialist, enrollmentNumber, enrollmentNameLabel, masterAgreement, viewLevels,
  viewProducts, levels as levelHeader, alertAgreementLabel} from '../../../constants'

export default function ContractHeaderView({agreement, isBrowseBySoftwareAgreementsEnabled, openCloseModal}) {
  const {agreementId, assortments, enrollmentId, enrollmentName, id, name, repEmail, usageReportable} = agreement
  const { assortmentIds, levels } = getAssortmentInfo(assortments)

  const commaSeperatedAssortments = assortmentIds ? assortmentIds.join(',') : ''
  const productsURL = getSearchResultsURL(id, commaSeperatedAssortments)

  return (
    <div className="c-software-license__contract-header">
      <p className='u-hide u-show@print'>
      {disableContractSelection(agreement) &&
        <Icon icon="alert" type="error" title={t(alertAgreementLabel)}/>
      }
      {name}
      </p>
      <div className='c-software-license__margin-left'><span className='c-software-license__cell--agreement-header'>{t(masterAgreement)}{' '}</span>{agreementId}</div>
      <div className='c-software-license__margin-left'><span className='c-software-license__cell--agreement-header'>{t(enrollmentNumber)}{' '}</span>{enrollmentId}</div>
      <div className='c-software-license__margin-left'><span className='c-software-license__cell--agreement-header'>{t(enrollmentNameLabel)}{' '}</span>{enrollmentName}</div>
      <div className="c-software-license__view-links u-hide@print">
        {!disableContractSelection(agreement) ? <Button color='link' className='c-button--inline-link u-show@tablet' onClick={() => openCloseModal(levels, levelHeader)}>{t(viewLevels)}</Button> :
          <a href={`mailto:${repEmail}`} className='c-software-license__rep-links c-software-license__padding-bot u-show@tablet'>
            {usageReportable ? t(contactSpecialist) : t(contactRep)}
          </a>
        }
        {isBrowseBySoftwareAgreementsEnabled && !disableContractSelection(agreement) &&
        <span className='u-show@tablet'>
          <span className="c-software-license__vertical-separator">|</span>
          <a href={productsURL}>{t(viewProducts)}</a>
        </span>
        }
      </div>
    </div>
  )
}

ContractHeaderView.propTypes = {
  agreement: PropTypes.shape({
    active: PropTypes.bool.isRequired,
    agreementId: PropTypes.string.isRequired,
    enrollmentId: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    ipsContractName: PropTypes.string,
    assortments: PropTypes.objectOf(PropTypes.string),
    name: PropTypes.string,
    repEmail: PropTypes.string,
  }),
  isBrowseBySoftwareAgreementsEnabled: PropTypes.bool.isRequired,
  openCloseModal: PropTypes.func.isRequired
}

ContractHeaderView.defaultProps = {
  agreement:{
    assortments: {},
    ipsContractName: null,
    name: null,
    repEmail: ''
  }
}
