import React from 'react'
import { Panel } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

export default function Header() {
  const title = 'Saved carts/Order templates'
  const description = 'Preview, delete or load any of your saved carts and order templates.'
  const details = 'Retrieve the items you saved for later by adding your saved cart to the active shopping cart. Purchase similar items often? Create an order template to load specific items plus additional information such as shipping address, carrier and more.'
  return (
    <Panel className="c-save-for-later__panel">
      <Panel.Body>
        <h1 className="u-h2">{t(title)}</h1>
        <p className='c-save-for-later__desc'>{t(description)}</p>
        <p className='c-save-for-later__desc'>{t(details)}</p>
      </Panel.Body>
    </Panel>
  )
}
