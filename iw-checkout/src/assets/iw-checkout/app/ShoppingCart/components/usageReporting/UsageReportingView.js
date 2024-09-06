import React, { Component } from 'react'

import { t } from '@insight/toolkit-utils/lib/labels'

import { IWAnchor, msgBox } from './../../../../libs/iw-components'
import { monthNames } from './../../../../libs/models/Date/index'

export default class UsageReporting extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hasFetchedUsage: false,
            isFetchingUsage: false,
            mixedReportableCart: false,
            multipleEnrollment: false,
            haveUsageInfoToDisplay: false,
            previouslyHadMixedReportableCart: false,

        }
    }

    static getDerivedStateFromProps(nextProps, prevState){

        const nextState = {}
        if (prevState.isFetchingUsage) return null
        if (nextProps.hasUsagePeriodReportableNonReportable) {
            nextState.mixedReportableCart = true
        }
        if(nextProps.hasConflictEnrollment){
            nextState.multipleEnrollment = true
        }

        nextState.haveUsageInfoToDisplay = !prevState.hasFetchedUsage && nextProps.splaDetails.hasUsageReportableSoftware
        nextState.previouslyHadMixedReportableCart = prevState.mixedReportableCart && !nextProps.hasUsagePeriodReportableNonReportable
        return Object.keys(nextState).length > 0 ? {...nextState}: null
    }

    componentDidMount() {
        const {haveUsageInfoToDisplay, previouslyHadMixedReportableCart} = this.state
        if (haveUsageInfoToDisplay || previouslyHadMixedReportableCart) {
            this.props.getUsageReportingHistory(this.props.splaDetails, this.props.webGroupPermissions)
                .then(() => {
                    this.setState({
                        mixedReportableCart: false,
                        isFetchingUsage: false,
                        hasFetchedUsage: true,
                    })
                })
            this.setState({
                isFetchingUsage: true,
            })
        }
    }

    // componentDidUpdate(prevProps, prevState) {
    //     const {haveUsageInfoToDisplay, previouslyHadMixedReportableCart} = this.state
    //     if(prevState.haveUsageInfoToDisplay !== haveUsageInfoToDisplay || prevState.previouslyHadMixedReportableCart !== previouslyHadMixedReportableCart) {
    //         if (haveUsageInfoToDisplay || previouslyHadMixedReportableCart) {
    //             this.props.getUsageReportingHistory(this.props.splaDetails, this.props.webGroupPermissions)
    //                 .then(() => {
    //                     this.setState({
    //                         mixedReportableCart: false,
    //                         isFetchingUsage: false,
    //                         hasFetchedUsage: true,
    //                     })
    //                 })
    //             this.setState({
    //                 isFetchingUsage: true,
    //             })
    //         }
    //     }
    // }

    getConflictedEnrollments() {
        return this.props.conflictEnrollments
    }

    checkIfMultipleEnrollmentIsPresent() {
        return this.state.multipleEnrollment
    }

    shouldShowUsageReporting() {
        return this.props.splaDetails.hasUsageReportableSoftware
            && this.props.usageReportingHistory.monthsWithReportingDue
            && !this.state.isFetchingUsage
            && !msgBox.hasMsg('shopping-cart', 'reportableNonReportable')
    }

    render() {
        const { usageReportingHistory, splaDetails, reportZeroUsage, enrollmentId } = this.props
        const { monthsWithReportingDue, monthToReport, isUnlimitedOrdering } = usageReportingHistory
        const hasUsagePeriodsToReport = (monthsWithReportingDue && monthsWithReportingDue.length > 0) || !!monthToReport

        const monthNamesWithReportingDue = monthsWithReportingDue && monthsWithReportingDue.map(date => monthNames[date.getMonth()])
        const monthNameToReport = monthToReport && monthNames[monthToReport.getMonth()]

        const today = new Date()
        const isPast11th = today.getDay() >= 11
        const hasPastDueMonths = monthsWithReportingDue && monthsWithReportingDue.length > 1
        const usageDueText = isPast11th || hasPastDueMonths
            ? t('Your usage reporting is past due for the following months:')
            : t('Your usage reporting is due for the following months:')
        const submitOneOrder = t('Please submit one order per missing month.')
        const allReportingCurrent = t('All reporting periods current.')
        const reportZeroUsageText = t('Report zero usage for this period')
        const enrollmentText = t('Enrollment #:')
        const conflictEnrollmentMessage = t('Your current cart contains parts from multiple hosted enrollments. Please limit your report to one enrollment.')
        const conflictEnrollmentText = t('Enrollments #:')

        return (<div>
            { this.shouldShowUsageReporting() &&
                <div className="row expanded is-collapse-child usage-reporting">
                    <section className="column">
                        <header>
                            <h3 className="usage-reporting__heading hide-for-print">{t('Usage Reporting')}</h3>
                        </header>
                        { hasUsagePeriodsToReport && !isUnlimitedOrdering
                            ? <div className="row row__gutter--tiny collapse expanded usage-reporting__warning hide-for-print">
                                <span className="columns shrink usage-reporting__warning-icon ion-android-warning"></span>
                                <span className="columns usage-reporting__warning-message">
                                    {usageDueText}
                                    {` ${monthNamesWithReportingDue.join(', ')}. `}
                                    {submitOneOrder}
                                </span>
                            </div>
                            : null }

                        { this.checkIfMultipleEnrollmentIsPresent()
                            ? <div className="row row__gutter--tiny collapse expanded usage-reporting__warning hide-for-print">
                                <span className="columns shrink usage-reporting__warning-icon ion-android-warning"></span>
                                <span className="columns usage-reporting__warning-message">
                                {conflictEnrollmentMessage}
                                </span>
                            </div>
                            : null }

                        <div className="usage-reporting__detail row row__gutter--tiny collapse expanded">
                            <span className="column shrink">
                                {t('Report usage for:')}</span>
                            <span className="column">
                                <strong>
                                    { hasUsagePeriodsToReport || isUnlimitedOrdering
                                        ? `${monthNameToReport} ${monthToReport.getUTCFullYear()}`
                                        : allReportingCurrent }
                                </strong>
                            </span>
                            { ((!this.props.disableNextPageDueToUsageReporting || isUnlimitedOrdering ) && !this.checkIfMultipleEnrollmentIsPresent())
                                ? <div className="column small-12 medium-shrink hide-for-print">
                                    <IWAnchor onClick={reportZeroUsage.bind(null, {
                                        webLoginProfile: this.props.webLoginProfile,
                                        dateToReport: monthsWithReportingDue[0],
                                        usageName: 'usageType',
                                        usageValue: splaDetails.usageType,
                                        isPreviousUsage: true,
                                        enrollment: enrollmentId,
                                    })}>
                                        <strong>{reportZeroUsageText}</strong>
                                    </IWAnchor>
                                </div>
                            : null }
                        </div>
                        <footer className="row expanded">
                            <div className="columns medium-text-right">
                                <div className="usage-reporting__footer">
                                    { this.checkIfMultipleEnrollmentIsPresent()
                                        ? <div>{conflictEnrollmentText}<strong>{this.props.conflictEnrollments.toString()}</strong></div>
                                        : <div>{enrollmentText}<strong>{enrollmentId}</strong></div>
                                    }
                                </div>
                            </div>
                        </footer>
                    </section>
                </div>
            }
        </div>)
    }
}
