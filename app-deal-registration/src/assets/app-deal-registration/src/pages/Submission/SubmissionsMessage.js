import React from 'react'

export default function SubmissionsMessage({ displayType, dealId }) {
  //TODO: Add more types and possibly turn this into switch statement to manage showing the appropriate message based
  //on type. Also, move message to const file.
  if (displayType === 'clientlink') {
    const bidPagesHref = "https://inside.insight.com/northamerica/depts_and_resources/departments/profitability/deal_registration_bidprogram"
    return (
      <div className="c-submission__message">
        <h4>{'Congratulations, the deal registration has been submitted. The POSS_DealRegistration team will follow up with further instructions if needed.'}</h4>
        <h5>{'If you need to submit additional registrations, please navigate via ClientLink or click this link -'}<a href={bidPagesHref} target="_blank">{bidPagesHref}</a>{' - and this will take you to the bid pages.'}</h5>
        <h6>{'Thank you, \nDeal Registration at Insight'}</h6>
      </div>
    )
  }
  if (displayType === 'emea-success') {
    const bidPagesHref = "https://inside.insight.com/northamerica/depts_and_resources/departments/profitability/deal_registration_bidprogram"
    return (
      <div className="c-submission__message">
        <h4>Congratulations, the deal registration has been submitted. The Deal ID is {dealId}</h4>
        <h6>{'Thank you, \nDeal Registration at Insight'}</h6>
      </div>
    )
  }
}
