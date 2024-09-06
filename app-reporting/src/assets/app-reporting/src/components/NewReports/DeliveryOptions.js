import React from 'react';
import { t } from '@insight/toolkit-utils';
import { Tooltip, Field, Button } from '@insight/toolkit-react';
import { DeliveryOptionsTooltip } from './tooltips';
import { CREATE_REPORT, REPORTING_TEXTS } from '../../texts';
import {REPORT_NAME, DATE_FORMAT, FORMAT_OPTIONS} from './static/FieldValues/FieldValues'
const {REPORT_HEADERS} = REPORTING_TEXTS;
const {DELIVERY_OPTIONS, DELIVERY_METHOD, DELIVERY_FORMAT, EMAIL_REPORT, CUSTOM_NAME, RUN} = CREATE_REPORT;

const DeliveryOptions = ({reportsData}) => {
    const {deliveryrunoptions, outputoptions} = reportsData;

    const selectFormat = (title, options, required = false) => {
        const selectOptions = options.map(option => ({
            text: option.text || option.value || option.name,
            value: option.value || option.name
        }))
        return (
            <div class="c-new-reports-category c-new-reports-input-group">
                <div class="c-new-reports-input-group__title">{t(title)} {required && <span>*</span>}</div>
                <Field 
                    fieldComponent="Select"
                    fullWidth
                    handleChange={(e) => {e.target.value}}
                    name={title}
                    options={selectOptions}
                    value={selectOptions[0].value} 
                />
            </div>
        )
    }
    return (
        <div className="c-new-reports-container">
            <div className="o-grid o-grid--center">
                <div className="o-grid__item">
                    <h2>
                        {t(DELIVERY_OPTIONS)}
                        <Tooltip content={DeliveryOptionsTooltip()}>
                            <span className='c-tooltip-report'>?</span>
                        </Tooltip>
                    </h2>
                </div>
            </div>
            <div className="o-grid o-grid--bottom">
                {selectFormat(DELIVERY_METHOD, deliveryrunoptions, true)}
                <div className="o-grid__item u-1/1 u-1/2@tablet">
                    <div class="c-new-reports-category c-new-reports-input-group--inline">
                        <div class="c-new-reports-input-group__title">{t(EMAIL_REPORT)}:</div>
                        <Field 
                            autoFocus
                            fieldComponent="Text"
                            helpText=""
                            name={EMAIL_REPORT}
                            showErrorIcon
                            type="text"
                        />
                    </div>
                </div>
            </div>
            <div className="o-grid o-grid--bottom">
                {selectFormat(REPORT_HEADERS.REPORT_NAME, REPORT_NAME)}
                <div className="o-grid__item u-1/1 u-1/2@tablet">
                    <div class="c-new-reports-category c-new-reports-input-group--inline">
                        <div class="c-new-reports-input-group__title">{t(CUSTOM_NAME)}:</div>
                        <Field 
                            autoFocus
                            fieldComponent="Text"
                            helpText=""
                            name={CUSTOM_NAME}
                            showErrorIcon
                            type="text"
                        />
                    </div>
                </div>
            </div>
            <div className="o-grid o-grid--bottom">
                {selectFormat(DELIVERY_FORMAT, outputoptions)}
                <div className="o-grid__item u-1/1 u-1/2@tablet">
                    <div class="c-new-reports-category c-new-reports-input-group--inline">
                        <Field 
                            fieldComponent="RadioGroup"
                            helpText=""
                            horizontal
                            name={DELIVERY_FORMAT}
                            options={FORMAT_OPTIONS}
                        />
                        <Field 
                            autoFocus
                            fieldComponent="Text"
                            helpText=""
                            name={DELIVERY_FORMAT}
                            showErrorIcon
                            type="text"
                        />
                    </div>
                </div>
            </div>
            <div className="o-grid o-grid--bottom">
                {selectFormat(CREATE_REPORT.DATE_FORMAT, DATE_FORMAT)}
            </div>
            <div className="o-grid o-grid--bottom">
                <Button
                    color="primary"
                    size="small"
                    className="c-new-reports__run-reports"
                    onClick={() => {}}
                >
                    {t(RUN)}
                </Button>
            </div>
        </div>
    )
}

export default DeliveryOptions;