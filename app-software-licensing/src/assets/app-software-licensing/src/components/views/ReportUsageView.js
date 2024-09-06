import React, { Component } from 'react'
import cn from 'classnames'
import { Button, Icon } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils';
import PropTypes from 'prop-types';
import { getMonthAndYear, getReportingMonths } from 'lib'
import { recreateUsageCartData, retrieveLastUsage, reportZeroUsage } from 'api'
import { getUsageFlag, retrieveLastUsagePeriod } from '../helpers'
import { contractTermination1, contractTermination2, usageDataCollection1, usageDataCollection2, usageReporting} from '../../constants'
import {
  allReportingCurrent,
  hldText,
  hldUsage,
  downloadUsageReport,
  pastDueText,
  reportUsageFor,
  retrieveLastMonth,  
  reportUsage,
  reportZeroUsageText,
  submitText,
  usageReport,
  usageDataInfomation,
  whyAmIReporting
} from '../../constants'

export default class ReportUsageView extends Component {
  state = {
    hldLink: "/insightweb/sso/jump?target=NA-HLD",
  }

  retrieveLastMonthUsage = async () => {
    const { agreement, openCloseModal, showLoading } = this.props
    const { currentReportingMonth, enrollmentId, hld, name, programId } = agreement
    const usageTerminationTxt = `${t(contractTermination1)} ${name} ${t(contractTermination2)}`

    showLoading(true)

    if (hld) {
      const lastUsageResponse = await retrieveLastUsage(programId, currentReportingMonth)
      if(getUsageFlag(lastUsageResponse.data)){
        retrieveLastUsagePeriod(openCloseModal, usageTerminationTxt)
      }else{
        await recreateUsageCartData(programId, currentReportingMonth, enrollmentId);
      }
    } else {
      await recreateUsageCartData(programId, currentReportingMonth, enrollmentId);
    }
    window.location.href = '/insightweb/viewCart'
  }

  reportZeroUsagePeriod = async () => {
    const { agreement, name, openCloseModal, showLoading } = this.props
    const { currentReportingMonth, enrollmentId, hld, programId } = agreement    
    const usageTerminationTxt = `${t(contractTermination1)} ${name} ${t(contractTermination2)}`
    const usageReportingTxt = `${t(usageDataCollection1)} ${name} ${t(usageDataCollection2)}`

    showLoading(true)

    if (hld) {
      const lastUsageResponse = await retrieveLastUsage(programId, currentReportingMonth)
      const reportUsageText = getUsageFlag(lastUsageResponse) ? usageTerminationTxt : usageReportingTxt
      retrieveLastUsagePeriod(openCloseModal, reportUsageText)
    }
    await reportZeroUsage(programId, enrollmentId)
    window.location.href = '/insightweb/viewCart'
  }

  render() {
    const { agreement, openCloseModal } = this.props
    const {
      currentReportingMonth,      
      hld,
      reportingMonthsDue,
      usageReportable,
      enrollmentId,  
    } = agreement
    const { hldLink } = this.state

    return (
      <div className="c-software-license__report-usage u-hide@print">
        <div className="o-grid o-grid--gutters">
          <div className="o-grid__item u-1/1 u-1/2@tablet u-width-auto@tablet">
            <h3 className="u-h4">{t(reportUsage)}</h3>
          </div>
          {usageReportable &&
            <div className="o-grid__item u-1/1 u-1/2@tablet c-software-license__padding-bot u-text-right u-show@tablet">
              <Button color='inline-link' className='c-software-license__retrieve-btn' href={`/insightweb/exportPreviousUsage/${enrollmentId}`}>{t(downloadUsageReport)} <Icon icon='download' className='c-icon' /></Button>
            </div>
          }
          {hld &&
            <div className="o-grid__item u-1/1 u-width-shrink@tablet u-margin-bot-small">
              <a href={hldLink}>{t(hldText)}</a>
            </div>
          }
        </div>
        {reportingMonthsDue.length > 0 && (
          <p>
            {t(pastDueText)} <strong>{getReportingMonths(reportingMonthsDue)}{'.'}</strong> {t(submitText)}
          </p>
        )}
        <div className="o-grid o-grid--gutters o-grid--bottom">
          <div className="o-grid__item u-1/1 u-width-auto@desktop">
            <div className="o-grid o-grid--gutters">
              <div className={cn('o-grid__item u-1/1 u-width-shrink@tablet', {'u-margin-bot-small': currentReportingMonth})}>
                {t(reportUsageFor)}&nbsp;
                <span className="c-software-license__report-period">
                  {usageReportable && currentReportingMonth ? getMonthAndYear(currentReportingMonth) : (<span className="c-software-license__reporting_current">{t(allReportingCurrent)}</span>)}
                </span>
              </div>
              <div className="o-grid__item u-1/1 u-width-shrink@tablet u-margin-bot-small">
                {!hld && currentReportingMonth &&
                  <Button color='inline-link' onClick={() => openCloseModal(usageReport, usageReporting)}>{t(whyAmIReporting)}</Button>
                }
                {hld &&
                  <Button color='inline-link' onClick={() => openCloseModal(hldUsage)}>{t(usageDataInfomation)}</Button>
                }
              </div>
            </div>
            {currentReportingMonth &&
            <div className="o-grid  u-margin-bot-small u-margin-bot-none@desktop">
              <div className="o-grid__item u-1/1 u-width-shrink@tablet c-software-license__retrieve-lastMonth">
                <Button color='inline-link' onClick={this.retrieveLastMonthUsage}>{t(retrieveLastMonth)}</Button>
              </div>
              <span className="o-grid__item u-1/1 u-hide@tablet">
                <hr className="c-software-license__horizontal-seperator" />
              </span>
              <div className="o-grid__item u-1/1 u-width-shrink@tablet">
                <span className="c-software-license__vertical-separator u-show@tablet">|</span>
                <Button color='inline-link' onClick={this.reportZeroUsagePeriod}>{t(reportZeroUsageText)}</Button>
              </div>
            </div>
            }
          </div>
        </div>
      </div>
    )
  }
}

ReportUsageView.propTypes = {
  agreement: PropTypes.shape({
    currentReportingMonth: PropTypes.string,    
    enrollmentId: PropTypes.string,
    programId: PropTypes.string,
    reportingMonthsDue: PropTypes.array,
    hld: PropTypes.bool,
    usageReportable: PropTypes.bool.isRequired,    
  }),
  name: PropTypes.string.isRequired,
  openCloseModal: PropTypes.func.isRequired,
  showLoading: PropTypes.func.isRequired,
}

ReportUsageView.defaultProps = {
  agreement:{
    currentReportingMonth: '',
    enrollmentId:'',
    programId: '',
    reportingMonthsDue: [],
    hld: false
  }
}
