import React from 'react'
import Button from '@insight/toolkit-react/lib/Button/Button'
import Image from '@insight/toolkit-react/lib/Image/Image'
import { t } from '@insight/toolkit-utils/lib/labels'

export const SearchContentTile = ({ doc, query, index, isSolutionsServicesTab }) => {
  const { imageUrl, pagePath, title } = doc
  const contentRediect = () => {
    const searchInfo = {
      searchKeyword: query,
      article_link_clicked: title,
      linkPositionClicked: index + 1,
    }
    window.fireTagEvent('searchInfo', searchInfo)

    window._satellite && _satellite.track && _satellite.track('searchInfo')

    window.location.href = pagePath
  }

  return pagePath && title && !isSolutionsServicesTab ? (
    <div className="c-content-tile">
      <Button
        className="c-content-tile__image"
        color="inline-link"
        title={title}
        onClick={() => contentRediect()}
      >
        <Image image={imageUrl} alt={t(title || 'Product Image')} />
        <div className="c-content-tile__text">{title}</div>
      </Button>
    </div>
  ) : null
}

export default SearchContentTile
