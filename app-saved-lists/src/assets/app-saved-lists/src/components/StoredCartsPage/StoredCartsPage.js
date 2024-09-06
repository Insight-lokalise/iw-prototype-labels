import React, { useState } from 'react'
import { t } from '@insight/toolkit-utils'
import { StoredCartsHeader } from './StoredCartsHeader'
import { StoredCartsContent } from './StoredCartsContent'
import { StoredCartsMiniPDP } from './StoredCartsMiniPDP'

export const StoredCartsPage = ({ addToast, loginId }) => {
  document.title = t('Saved Lists')
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [miniPDP, setMiniPDP] = useState('')
  return (
    <div className="c-app-stored-carts">
      <StoredCartsHeader
        query={query}
        setQuery={setQuery}
        loading={loading}
      />
      <StoredCartsContent
        addToast={addToast}
        loading={loading}
        setLoading={setLoading}
        setMiniPDP={setMiniPDP}
        loginId={loginId}
        query={query}
      />
      {
        miniPDP && (
          <StoredCartsMiniPDP
            miniPDP={miniPDP}
            setMiniPDP={setMiniPDP}
          />
        )
      }
    </div>
  )
}

export default StoredCartsPage
