import React from 'react'
import { t } from '@insight/toolkit-utils'
import { Field, Tooltip } from '@insight/toolkit-react'
import { ScheduleReportTooltip } from './tooltips'
import {
    CREATE_REPORT,
} from '../../texts'

import { SCHEDULE_REPORT_DROPDOWN, FILTER_TYPE_DROPDOWN, CURRENCY, FILTER_BY_CURRENCY_OPTIONS, FILTER_DATE_RANGE_DROPDOWN, FILTER_DATE_OPTIONS } from './static/FieldValues/FieldValues'
const { SCHEDULE_REPORT, FILTER_BY_DATE_RANGE, FILTER_BY_CURRENCY, START_DATE, END_DATE } = CREATE_REPORT

const ScheduleReport = () => {
    const scheduleReport = (
        <div className="c-new-reports-category c-new-reports-input-group">
            <div className="c-new-reports-input-group__title">
                {t(SCHEDULE_REPORT)}
                <Tooltip content={t(ScheduleReportTooltip())}>
                    <span className='c-tooltip-report'>?</span>
                </Tooltip>
            </div>
            <Field
                fieldComponent="Select"
                fullWidth
                handleChange={() => { }}
                name="select-report"
                options={SCHEDULE_REPORT_DROPDOWN}
                value={(e) => e.target.value}
            />
        </div>
    )

    const filterDateRange = (
        <div className="c-new-reports-category">
            <div className="c-new-reports-input-group__title">
                {t(FILTER_BY_DATE_RANGE)}
            </div>
            <div className="c-new-reports-input-group">
                <Field
                    fieldComponent="RadioGroup"
                    horizontal={true}
                    options={FILTER_DATE_OPTIONS}
                    name="filter-date-range"
                />
                <Field
                    fieldComponent="Select"
                    fullWidth
                    handleChange={() => { }}
                    name="date-rage"
                    value={(e) => e.target.value}
                    options={FILTER_DATE_RANGE_DROPDOWN}
                />
            </div>
            <div className="c-new-reports-input-group">
                <Field
                    fieldComponent="Text"
                    name="start-date"
                    label={t(START_DATE)}
                    type="date"
                    className="c-new-reports-input-group__date"
                />
            </div>
            <div className="c-new-reports-input-group">
                <Field
                    fieldComponent="Text"
                    name="end-date"
                    label={t(END_DATE)}
                    type="date"
                    className="c-new-reports-input-group__date"
                />
            </div>
        </div>
    )

    const filterByCurrency = (
        <div className="c-new-reports-category c-new-reports-input-group">
            <div className="c-new-reports-input-group__title">
                {t(FILTER_BY_CURRENCY)}
            </div>
            <fieldset class="c-form__element c-form__element--filter-currency">
                <div class="c-form__control">
                    <div class="o-grid">
                        <div class="c-radio__container o-grid__item u-1/1">
                            <input class="c-radio" id={FILTER_BY_CURRENCY_OPTIONS.ACCT.value} name="filter-by-currency" type="radio" value={FILTER_BY_CURRENCY_OPTIONS.ACCT.value} />
                            <label class="c-form__label c-form__label--radio" for={FILTER_BY_CURRENCY_OPTIONS.ACCT.value}>{FILTER_BY_CURRENCY_OPTIONS.ACCT.text}</label>
                        </div>
                        <div class="c-radio__container o-grid__item u-1/1">
                            <input class="c-radio" id={FILTER_BY_CURRENCY_OPTIONS.SUPPLY.value} name="filter-by-currency" type="radio" value={FILTER_BY_CURRENCY_OPTIONS.SUPPLY.value} />
                            <label class="c-form__label c-form__label--radio" for={FILTER_BY_CURRENCY_OPTIONS.SUPPLY.value}>{FILTER_BY_CURRENCY_OPTIONS.SUPPLY.text}</label>
                            <Field
                                fieldComponent="Select"
                                fullWidth
                                handleChange={(e) => { e.target.value }}
                                name={"currencyOptionsSelect" + FILTER_BY_CURRENCY_OPTIONS.SUPPLY.value}
                                options={CURRENCY}
                                value={''}
                                className="c-select--currency"
                            />
                        </div>
                        <div class="c-radio__container o-grid__item u-1/1">
                            <input class="c-radio" id={FILTER_BY_CURRENCY_OPTIONS.INVOICED.value} name="filter-by-currency" type="radio" value={FILTER_BY_CURRENCY_OPTIONS.INVOICED.value} />
                            <label class="c-form__label c-form__label--radio" for={FILTER_BY_CURRENCY_OPTIONS.INVOICED.value}>{FILTER_BY_CURRENCY_OPTIONS.INVOICED.text}</label>
                            <Field
                                fieldComponent="Select"
                                fullWidth
                                handleChange={(e) => { e.target.value }}
                                name={"currencyOptionsSelect" + FILTER_BY_CURRENCY_OPTIONS.INVOICED.value}
                                options={CURRENCY}
                                value={''}
                                className="c-select--currency"
                            />
                        </div>
                    </div>
                </div>
            </fieldset>
        </div>
    )

    const filterType = (
        <div className="c-new-reports-category c-new-reports-input-group">
            <div className="c-new-reports-input-group__title">
                {t(SCHEDULE_REPORT)}
            </div>
            <Field
                fieldComponent="Select"
                fullWidth
                handleChange={() => { }}
                name="filter-type"
                options={FILTER_TYPE_DROPDOWN}
                value={(e) => e.target.value}
            />
        </div>
    )

    return (
        <div className="c-new-reports-container">
            <div className="o-grid">{scheduleReport}</div>
            <div className="o-grid">{filterDateRange}</div>
            <div className="o-grid">{filterByCurrency}</div>
            <div className="o-grid">{filterType}</div>
        </div>
    )
}

export default ScheduleReport
