import React from 'react'

import { t } from '@insight/toolkit-utils/lib/labels'
import { IWAnchor } from '../IWAnchor/IWAnchor'

export function CanadaEWRFeeModalBody(props) {
  const paragraphOne = (
    <p>
      {t(
        'The Electronic Products Recycling Association (EPRA) is an industry-led, not-for-profit organization that operates regulated recycling programs across Canada. They ensure that end-of-life electronics are handled in a safe, secure and environmentally-sound manner. Please refer to the following links for more information about the recycling program and EWR fees in the province you are shipping to.'
      )}
    </p>
  )
  const paragraphTwo = (
    <p>
      <IWAnchor target="blank" href="https://www.albertarecycling.ca/">
        {t('Alberta (operated by Alberta Recycling Management Authority)')}
      </IWAnchor>
      <br />
      <IWAnchor target="blank" href="https://www.recyclemyelectronics.ca/bc/">
        {t('British Columbia')}
      </IWAnchor>
      <br />
      <IWAnchor target="blank" href="https://www.recyclemyelectronics.ca/mb/">
        {t('Manitoba')}
      </IWAnchor>
      <br />
      <IWAnchor target="blank" href="https://www.recyclemyelectronics.ca/nb/">
        {t('New Brunswick')}
      </IWAnchor>
      <br />
      <IWAnchor target="blank" href="https://www.recyclemyelectronics.ca/nl">
        {t('Newfoundland and Labrador')}
      </IWAnchor>
      <br />
      <IWAnchor target="blank" href="https://www.recyclemyelectronics.ca/ns/">
        {t('Nova Scotia')}
      </IWAnchor>
      <br />
      <IWAnchor target="blank" href="https://www.recycleyourelectronics.ca/">
        {t('Ontario')}
      </IWAnchor>
      <br />
      <IWAnchor target="blank" href="https://www.recyclemyelectronics.ca/pei/">
        {t('Prince Edward Island')}
      </IWAnchor>
      <br />
      <IWAnchor target="blank" href={props.locale === 'fr_CA' ? 'https://www.recyclermeselectroniques.ca/qc/' : 'https://www.recyclemyelectronics.ca/qc/'}>
        {t('Quebec')}
      </IWAnchor>
      <br />
      <IWAnchor target="blank" href="https://www.recyclemyelectronics.ca/sk/">
        {t('Saskatchewan')}
      </IWAnchor>
      <br />
    </p>
  )

  return (
    <div className="column">
      {paragraphOne}
      {paragraphTwo}
    </div>
  )
}

export function CaliforniaEWRFeeModalBody() {
  const paragraphOne = 'Electronic Waste Recycling Act of 2003'
  const paragraphTwo = 'On September 24, 2003, California passed legislation establishing a funding system for the collection and recycling of certain electronic wastes. According to the Electronic Waste Recycling Act of 2003, retailers and direct sellers must impose a fee at the time of purchase on certain electronic items. Insight will begin assessing this fee on all orders shipping to California starting on January 1, 2005. For the full text of the law, visit'
  const paragraphThree = 'Insight is committed to adhering to this legislation by assessing the appropriate fee to all orders containing affected products shipping into California starting on January 1, 2005. Affected products include but are not limited to: computer monitors both CRT and LCD, notebook computers, projectors, televisions, any video display devices with a screen size 4 inches or larger (phones, fax machines, cameras). The fees range from $6 and up per unit.'
  const paragraphFive = 'We value your partnership and look forward to continually growing our business with you.'
  return (
      <div className="iw-summary-ewr-modal__body" >
          <p>{t(paragraphOne)}</p>
          <p>
            {t(paragraphTwo)}
            <IWAnchor target="blank" href="https://www.calrecycle.ca.gov/Electronics/">https://www.calrecycle.ca.gov/Electronics/</IWAnchor>.
          </p>
          <p>{t(paragraphThree)}</p>
          <p>{t('Any questions regarding this fee should be directed to')}<IWAnchor target="blank" href="mailto:CARecycling@Insight.com?subject=EWR%Question">CARecycling@Insight.com</IWAnchor>.</p>
          <p>{t(paragraphFive)}</p>
      </div>
  )
}