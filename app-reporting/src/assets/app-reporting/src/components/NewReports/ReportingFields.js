import React, {useState} from "react";
import {Field} from '@insight/toolkit-react';
import { t } from '@insight/toolkit-utils';
import { CREATE_REPORT } from "../../texts";
import {adhocFields} from "./static/API/adhocFields";
import { SMART_TRACKER_FILTER } from "./static/FieldValues/FieldValues";
const { ADDITIONAL_REPORTING_FIELDS, AVAILABLE_FIELDS, SELECTED_FIELDS, DRAG_FIELDS, SMARTTRACKER, SEARCH_FOR_FIELDS, SMARTTRACKER_INFO } = CREATE_REPORT;
const {labels: {ADHOCReqOptions, ADHOCoptions}} = adhocFields;

const ReportingFields = ({reportsData}) => {
    const {smarttracker_flag, smartrackeroptions} = reportsData;
    const [fields, setFields] = useState(ADHOCoptions?.map(option => ({checkboxLabel: option.name, value: option.value})))
    const [selectedFields, setSelectedFields] = useState(ADHOCReqOptions?.map(option => ({checkboxLabel: option.name, value: option.value})))

    const availableOptions = <div className="c-new-reports-category c-new-reports-input-group c-new-reports-input-group--checkbox-group">
        <div className="c-new-reports-input-group__title">{t(AVAILABLE_FIELDS)}</div>
            <input type="text" placeholder={t(SEARCH_FOR_FIELDS)} />
            <Field 
                fieldComponent="CheckboxGroup"
                name={t(AVAILABLE_FIELDS)}
                options={fields}
            />
        </div>

    const requiredOptions = <div className="c-new-reports-category c-new-reports-input-group c-new-reports-input-group--checkbox-group">
        <div className="c-new-reports-input-group__title">{t(SELECTED_FIELDS)}</div>
            <Field 
                fieldComponent="CheckboxGroup"
                name={t(AVAILABLE_FIELDS)}
                options={selectedFields}
                legend={DRAG_FIELDS}
            />
        </div>
    
    const mapSmartTracker = smartrackeroptions?.map((option) => ({checkboxLabel: option.name, value: option.name}));
    const smartTracker = <div className="o-grid">
        <div className="c-new-reports-category c-new-reports-input-group">
            <div className="c-new-reports-input-group__title">{t(SMARTTRACKER)}</div>
            <div className="o-grid u-margin-bot-small">
                <div className="o-grid__item o-grid__item--shrink">
                    <span className="c-tooltip-report">i</span>
                </div>
                <div className="o-grid__item">
                    <span className="u-text-torquise">
                        {t(SMARTTRACKER_INFO)}
                    </span>
                </div>
            </div>
            <Field 
                fieldComponent="CheckboxGroup"
                name={SMARTTRACKER}
                options={mapSmartTracker}
            />
            <Field 
                fieldComponent="Select"
                name={SMARTTRACKER}
                options={SMART_TRACKER_FILTER}
                fullWidth
                handleChange={(e) => {
                    e.target.value
                }}
                value={SMART_TRACKER_FILTER[0].text}
            />
        </div>
    </div>

    return (
        <div className="c-new-reports-container">
            <div className="o-grid o-grid--center o-grid--justify-end">
                <div className="o-grid__item u-1/1 u-1/2@tablet">
                    <h2>{t(ADDITIONAL_REPORTING_FIELDS)}</h2>
                </div>
            </div>
            <div className="o-grid">
                {availableOptions}
                {requiredOptions}
            </div>
            {smarttracker_flag && smartTracker}
        </div>
    )
}

export default ReportingFields;