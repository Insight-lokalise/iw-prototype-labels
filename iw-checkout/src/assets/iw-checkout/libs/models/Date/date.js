import { t } from '@insight/toolkit-utils/lib/labels'

/**
 * Array of locale-translated month names.
 * @type {Array}
 */
export const monthNames = [
    t('January'), t('February'), t('March'),
    t('April'), t('May'), t('June'),
    t('July'), t('August'), t('September'),
    t('October'), t('November'), t('December'),
]


/**
 *  Returns the Date @param x months ago.
 *
 * NOTE There may be very subtle date problems here
 * NOTE The current day is not maintained. Only use this for months/years.
 * @param  {Number} x   How many months back?
 * @return {Date}       A Date of the month @param x months ago
 */
export function monthsAgo(x, fromDate = new Date()) {
    const date = new Date(fromDate) // avoid mutating passed date
    date.setDate(1)
    date.setMonth(date.getMonth() - x)

    return date
}

/**
 * Checks for dates with equal Month and year
 * @param  {Date} date1
 * @param  {Date} date2
 * @return {Boolean}
 */
export function equalMonthAndYear(date1, date2) {
    return date1.getYear() === date2.getYear()
        && date1.getMonth() === date2.getMonth()
}


