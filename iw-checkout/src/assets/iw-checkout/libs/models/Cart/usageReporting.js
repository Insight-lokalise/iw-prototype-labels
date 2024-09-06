import trim from 'lodash-es/trim'

import { get, post } from './../fetch'
import { equalMonthAndYear, monthsAgo } from './../Date'
import { getCurrentLocale } from '@insight/toolkit-utils/lib/helpers/localeHelpers'

/**
 * Determine the months that the user needs to report for SPLA/CITRIX usage reporting.
 * @param  {[type]} splaDetails [description]
 * @return {object}             information on the months the user needs to report.
 *                                { monthsWithReportingDue<Date[]>,
 *                                  firstMonthToReport<Date>,
 *                                  monthNamesNeedingReporting<String[]> }
 */
export function usageReportingHistory(splaDetails, webGroupPermissions = []) {
    const {enrollmentID} = splaDetails
    return get(`/insightweb/transaction/getLastUsageByUsageType/${splaDetails.usageType}/${enrollmentID}`)
        .then((enrollmentUsage) => {
            const dateList = enrollmentUsage[enrollmentID]
            const reportedMonths = dateList.map((date) => new Date(date.replace(/-/g, '/')))
            const pastSixMonths = [1, 2, 3, 4, 5, 6].map(n => monthsAgo(n))

            let monthsWithReportingDue = []
            monthsWithReportingDue = pastSixMonths.map(pastMonth => {
                const monthReported = reportedMonths.some(date => equalMonthAndYear(pastMonth, date))
                if (!monthReported) return pastMonth
            }).filter(m => m != null)

            if (splaDetails.contractEffectiveDate) {
                // Clients only need to report months that they've had the contract
                const contractEffectiveDate = new Date(splaDetails.contractEffectiveDate)
                monthsWithReportingDue = monthsWithReportingDue.filter(monthDue => {
                    const monthsDifference = (monthDue.getMonth() - contractEffectiveDate.getUTCMonth())
                        + (12 * (monthDue.getFullYear() - contractEffectiveDate.getUTCFullYear()))
                    return monthsDifference >= 0
                })
            }

            // Oldest months first
            monthsWithReportingDue.sort((date1, date2) => date1 - date2)

            let unlimitedOrderingMonth
            if (monthsWithReportingDue.length === 0 && canOrderUnlimited(splaDetails.usageType, webGroupPermissions)) {
                // unlimited orderers must report for any un-reported months and are perpetually able to report for
                // the previous month.
                unlimitedOrderingMonth = pastSixMonths[0]
            }

            return {
                monthsWithReportingDue,
                monthToReport: monthsWithReportingDue[0] || unlimitedOrderingMonth,
                isUnlimitedOrdering: !!unlimitedOrderingMonth,
            }
        })
}

/**
 * [reportZeroUsage description]
 * @param  {[type]}  webLoginProfile For getting the client's soldTo #. Usually comes along with the getCart response.
 * @param  {[type]}  dateToReport    For what date are we reporting zero usage?
 * @param  {[type]}  usageName       [description]
 * @param  {[type]}  usageValue      [description]
 * @param  {Boolean} isPreviousUsage [description]
 * @return {[type]}                  [description]
 */
export function reportZeroUsage({ webLoginProfile, dateToReport, usageName, usageValue, isPreviousUsage, enrollment }) {
    if (webLoginProfile && webLoginProfile.soldToNumber != null) {
        return getUsageSetupMapping().then(usageSetupMapping => {
            const soldTo = webLoginProfile.soldToNumber
            const usagePeriod = determineUsagePeriod(usageSetupMapping, usageName, dateToReport, usageValue, enrollment)

            if (isPreviousUsage && window.checkIfHLDWebGroupPermissionExistsInProfile(usageSetupMapping, usageName, usageValue)) {
                return get(`/insightweb/transaction/checkPreviousZeroUsage/${soldTo}/${usageValue}/${isPreviousUsage}/${usagePeriod}`)
                    .then(previousZeroUsage => {
                        if (previousZeroUsage.previousZeroUsage && previousZeroUsage.isComplete) {
                            // If the user has reported zero usage for the past 5 consecutive months, display a notification
                            // that their contract might be at risk of termination - from Chandra
                            displayZeroUsageNotificationModal(previousZeroUsage, usagePeriod)
                            return
                        }
                    })
            }
        })
        .then(() => {
            return post('/insightweb/transaction/reportZeroUsage', {
                data: {
                    isRequestFromContractPage: false,
                    name: usageName || '',
                    value: usageValue || '',
                    enrollmentId: enrollment || '',
                },
            })
        })
    }

    return Promise.reject("User's webLoginProfile does not have a soldToNumber")
}

/**
 * Records SPLA/CITRIX usage in the session for this user's order.
 * @param  {Date} date      the date to report
 * @return {Promise}        [description]
 */
export function saveSPLAUsage(date) {
    const dateToReport = `${date.getMonth() + 1}/01/${date.getFullYear()}`
    return post('transaction/saveSPLAUsage', dateToReport)
}

/**
 * [getUsageSetupMapping description]
 * @return {[type]} [description]
 */
function getUsageSetupMapping() {
    return get('/insightweb/transaction/getUsageSetupMapping')
}

function canOrderUnlimited(usageType, webGroupPermissions) {
    const unlimitedSPLA = webGroupPermissions.includes('allow_unlimited_spla_ordering')
    const unlimitedCITRIX = webGroupPermissions.includes('allow_unlimited_citrix_ordering')
    return usageType === 'SPLA' ? unlimitedSPLA : usageType === 'CITRIX' ? unlimitedCITRIX : false
}

/**
 * [determineUsagePeriodAndProgramId description]
 * @param  {[type]} usageName    [description]
 * @param  {[type]} dateToReport [description]
 * @param  {[type]} usageValue   [description]
 * @return {Object}              The date-like string usagePeriod to report for the programId
 *                                   { usagePeriod<String(YYYY-MM)>, programId<String> }
 */
export function determineUsagePeriod(usageSetupMapping, usageName, dateToReport, usageValue, enrollment) {
    let usagePeriod

    if (usageName === 'programId') {
        if (dateToReport) {
            usagePeriod = `${dateToReport.getYear() + 1}-${dateToReport.getMonth()}-01`
        } else {
            dateToReport = window.getUsagePeriodForSoldTo(usageValue, enrollment)
            // TODO this breaks when the user has not reported any of the past 6 months.
            // We need a bool check here to report for the least recent month.
            // if (!dateToReport) dateToReport = monthsAgo(6) or something
            var [usageMonth, usageYear] = dateToReport.split(':').map(trim)
            usagePeriod = usageYear + '-' + usageMonth + '-01'
        }
    } else if (usageName === 'usageType') {
        const programId = window.getProgramIDFromUsageSettingMap(usageSetupMapping, usageName, usageValue)
        dateToReport = window.getUsagePeriodForSoldTo(programId, enrollment)
        const [usageMonth, usageYear] = dateToReport.split(':').map(trim)
        usagePeriod = usageYear + '-' + usageMonth + '-01'
    }
    return usagePeriod
}

// usagePeriodReportable & requestor permision on
// Hide checkout button logic
// $.each(cartData.contracts, function(index, item) {
//     if ((item.usagePeriodReportable) && (isRequestor)) {
//         $('#checkOutDiv').css('display', 'none');
//         $('#errors').show();
//         var msg = Templatelabels.labels.LicensingordecannoSPLA;
//         $('#errors').html(msg);
//         $('.editLineLevelInfo').hide();
//         $('.editManufacturerRequirements').hide();
//     }
//     if ((item.vspp) && (isRequestor)) {
//         $('#checkOutDiv').css('display', 'none');
//         $('#errors').show();
//         var msg = Templatelabels.labels.LicensingordecannoVSPP;
//         $('#errors').html(msg);
//         $('.editLineLevelInfo').hide();
//         $('.editManufacturerRequirements').hide();
//     }
// });

// user_requires_approval permission on & no requestor groups
// if ((Insight.userPermissions != null) && ($.inArray('user_requires_approval', Insight.userPermissions) > -1)) {
//     if (requestorGroupsInfo.requestorGroups == null || requestorGroupsInfo.requestorGroups.length == 0) {
//         $('#errors').show();
//         var msg = Templatelabels.labels.mayNotContinue;
//         $('#errors').html(msg);
//         if (cartData.postLoginRedirectUrl != null) {
//             cartData.postLoginRedirectUrl = null;
//             errorMessage = msg;
//             displayResultsCart(cartData);
//         }
//         InsightCommon.hideLoading();
//         return;
//     }
// }

/**
 * @deprecated
 *
 * @return {[type]} [description]
 */
function displayZeroUsageNotificationModal(previousZeroUsage, usagePeriod) {
      const searchLabelsContent = InsightCommon.getLabels('app-legacy-search',false);
      window.InsightCommon.getContentAsync(window.InsightSearch.staticContentUrl, null, 'search/zeroUsageNotification.html', function(htmlTemplate) {
          $.template('zeroNotificationtempl', htmlTemplate)
          $('#zeroUsageNotificationId').html('')
          const renderData = $.extend(previousZeroUsage, {
              flag: previousZeroUsage.iszeroUsage ? 1 : 2,
              labels: searchLabelsContent.labels,
              usagePeriod,
          })
          InsightCommon.renderTemplate('zeroNotificationtempl', renderData, '#zeroUsageNotificationId')
      })
      $('#zeroUsageNotificationId').dialog({ width: 300, resizable: false, modal: true, position: ['top', 300], overlay: { background: '#F2F2F2' } })
      window.insightLightBox.styleCustomDialog('#zeroUsageNotificationId')
}
