import React from 'react'

import ContentTab from '../ContentTab/ContentTab';

export const ArticlesTab = ({ handleTabClick, query, items, id }) => {

  return (
    <ContentTab
      handleTabClick={handleTabClick}
      query={query}
      id={id}
      items={items}
    />
  )
}

export default ArticlesTab