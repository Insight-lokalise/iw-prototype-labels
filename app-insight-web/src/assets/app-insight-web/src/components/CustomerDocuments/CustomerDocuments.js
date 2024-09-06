import React, { useState, useEffect } from 'react'
import { getCustomerDocuments } from 'api'
import { t } from '@insight/toolkit-utils'
import Button from '@insight/toolkit-react/lib/Button/Button'
import {FileTypeIcon, FileTypeIconSymbols} from '@insight/toolkit-react/lib/FileTypeIcon'

export default function CustomerDocuments() {
  const [documents, setDocuments] = useState([]);
  useEffect(() => {
    getCustomerDocuments().then(documents => {
      setDocuments(documents)
    })
  }, [])

  function renderDocuments() {
    return (
      <div className="o-grid">
        <FileTypeIconSymbols/>
        {documents.map(({title, id, type, href, description}) => (
          <div key={id} className="o-grid__item u-1/1 c-customer-document">
            <div className="o-grid">
              <div className="o-grid__item o-grid__item--shrink">
                <FileTypeIcon type={type}/>
              </div>
              <div className="o-grid__item">
                <Button className="c-customer-document__button" color="link" target="_blank" href={href}>{title}</Button>
                <p>{description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="c-customer-documents">
      <h2>{t("Customer documents")}</h2>
      <p>{t("Below you will find a list of available documents.")}</p>
      {renderDocuments()}
    </div>
  )
}

CustomerDocuments.propTypes = {}
