import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils/lib/labels'

import Dashlet from '../Dashlet'
import Icon from '../../icons/Icon'
import { fetchELDJumpUrl } from '../../../../services'
import { IWAnchor, IWLoading, IWSelect } from '../../../../iw-components'

export default class EnterpriseAgreementDetails extends Component {
  componentDidMount() {
      if (!this.props.hasData) {
          this.props.getData()
      }
  }

  render() {
    const {
      data: {
        agreement_number,
        contract_term,
        dial_value,
        end_date,
        program,
        publisher,
        start_date,
        time_remaining,
      },
      handlePublisherDropdown,
      hasData,
      options,
      selection,
      title,
      toggleThisDashlet,
    } = this.props

    const batteryIcon = generateIconFromTimeRemaining(dial_value, contract_term)
    return (
      <Dashlet
        headerLink={{ linkFunction: () => redirect(), text: 'View all' }}
        title={title}
        toggleThisDashlet={toggleThisDashlet}
      >
        {
          !hasData && (
            <IWLoading />
          ) || (
            options.length === 0 && <p className="dashlet__no-data-message">{t('No records found')}</p>
          ) || (
            <div className="enterprise-agreement__body">
              <IWSelect
                className="dashlet__select"
                disabled={options.length < 2}
                onChange={handlePublisherDropdown}
                options={options}
                value={selection}
              />
              <div>
                <div className="enterprise-agreement__table">
                  <IWAnchor onClick={() => redirect(publisher)} >{agreement_number}</IWAnchor>
                  <table>
                    <tr>
                      <td>{`${t('Program')}:`}</td>
                      <td>{program}</td>
                    </tr>
                    <tr>
                      <td>{`${t('Started Date')}:`}</td>
                      <td>{start_date}</td>
                    </tr>
                    <tr>
                      <td>{`${t('End Date')}:`}</td>
                      <td>{end_date}</td>
                    </tr>
                    <tr>
                      <td>{`${t('Contract Term')}:`}</td>
                      <td>{t(contract_term)}</td>
                    </tr>
                  </table>
                </div>
                <div className="enterprise-agreement__icon">
                  {batteryIcon}
                  <p>{`${dial_value} ${t(`${time_remaining} remaining`)}`}</p>
                </div>
              </div>
            </div>
          )
        }
      </Dashlet>
    )
  }
}

EnterpriseAgreementDetails.propTypes = {
  data: PropTypes.shape({
    agreement_number: PropTypes.string.isRequired,
    contract_term: PropTypes.number.isRequired,
    dial_value: PropTypes.number.isRequired,
    end_date: PropTypes.string.isRequired,
    program: PropTypes.string.isRequired,
    publisher: PropTypes.string.isRequired,
    start_date: PropTypes.string.isRequired,
    time_remaining: PropTypes.string.isRequired,
  }),
  getData: PropTypes.func.isRequired,
  handlePublisherDropdown: PropTypes.func.isRequired,
  hasData: PropTypes.bool.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
  })).isRequired,
  selection: PropTypes.number.isRequired,
  title: PropTypes.string,
  toggleThisDashlet: PropTypes.func.isRequired,
}

EnterpriseAgreementDetails.defaultProps = {
  data: undefined,
  title: 'Enterprise Agreement Details',
}

function redirect(publisher) {
  fetchELDJumpUrl('agreement', publisher).then(response => {
    window.location.assign(response.data)
  })
}

function generateIconFromTimeRemaining(monthsRemaining, contract_term) {
  const warningBreakpoint = contract_term > 72 ? contract_term/12 : 6
  const criticalBreakpoint = contract_term > 72 ? contract_term/24 : 3
  if (monthsRemaining > warningBreakpoint) {
    return <Icon type="batteryFull" className="safe" />
  } else if (monthsRemaining <= warningBreakpoint && monthsRemaining > criticalBreakpoint) {
    return  <Icon type="batteryHigh" className="warning" />
  } else if (monthsRemaining <= criticalBreakpoint && monthsRemaining > 0) {
    return <Icon type="batteryLow" className="danger" />
  }
  return <Icon type="batteryEmpty" className="danger" />
}
