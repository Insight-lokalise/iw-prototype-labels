import React from 'react';
import {t} from '@insight/toolkit-utils';
export const Hierarchy = () => (
    <div>
        {t('Hierarchy displays the structure of related accounts, showing parent and child relationships. When the hierarchy is shown, you can view and select specific accounts within this structure.')}
    </div>
)

export const ScheduleReportTooltip = () => (
    <div>
        &#x2022; {t('Yearly reports run on January 1st and include data from the prior year')} <br />
        &#x2022; {t('Quarterly reports run the 1st day of each quarter and include data from the prior quarter')} <br />
        &#x2022; {t('Monthly reports run the 1st day of each month and include data from the prior month')} <br />
        &#x2022; {t('Weekly reports run each Saturday and include data from the prior week')} <br />
        &#x2022; {t('Daily reports run each morning and include data from the prior day')}
    </div>
)

export const DeliveryOptionsTooltip = () => (
    <div>
        {t('Our reports are available in many report delivery options and formats.')}<br /><br />
        {t('Report Now: Run the report immediately and view results in the selected format.')}<br />
        {t('Schedule Report: Easily schedule the report to run automatically based on the selected criteria. View the report schedules under Report Mangement.')}<br />
        {t('Save in Posted Reports: Save the report to our system for easy access later. Access Posted Reports at your convenience under Report Mangement.')}<br />
        {t('Save as Template: Save the report criteria for future use. Access Saved Templates under Report Mangement.')}<br />
        {t('reportDeliveryOptions: The selected date format will determine the display of dates in your report.')}
    </div>
)

export const DigitalSerialNumber = () => (
    <div>
        {t('By default, serial number and asset tag information is displayed in one cell. You can choose to display the information on separate lines by selecting the checkbox.')}
    </div>
)

export const IncludeInsightPartnerData = () => (
    <div>
        {t('Selecting to include Partner Data will include purchase activity which Insight collects from our partner alliances in locations around the world. Partner Data is uploaded bi-weekly, monthly or quarterly depending on region')}
    </div>
)

export const SmartTracker = () => (
    <div>
        {t('SmartTracker is customs data catpured for our clients during the ordering process to allow for customized record-keeping for each customer. This service can assist a company in tracking and auditing internally to maintain license compliance and other internal reporting functions.')}
    </div>
)

export const SelectRegion = () => (
    <div>
        {t('Selecting an Operations Center will limit your transactions to the selected Operations Center(s).')}<br/>
        {t('Insight APAC will limit your transactions to Asia Pacific')}<br/>
        {t('Insight EMEA will limit your transactions to Europe, Middle East and Africa')}<br/>
        {t('Insight North America will limit your transactions to United States and CanadaUse the Region filter to further customize your results and choose')}<br/>
        {t('Update Filter Selections to apply your selections.')}
    </div>
)