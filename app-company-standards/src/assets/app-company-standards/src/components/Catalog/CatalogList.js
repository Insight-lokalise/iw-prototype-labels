import React from 'react'
import PropTypes from 'prop-types'

import DragAndDropList from './DragAndDropList'
import CatalogListItem from './CatalogListItem'

export default function CatalogList(props) {

  const {
    children,
    currentItemOrder,
    dndFunctions,
    droppableId,
    expandAll,
    initialItemOrder,
    itemDictionary,
    nestLevel,
    preselection,
    categoryId,
  } = props

  return (
    initialItemOrder.length > 0 && (
      <DragAndDropList itemOrder={initialItemOrder} droppableId={droppableId} type={droppableId} {...dndFunctions}>
        {currentItemOrder &&
          currentItemOrder.map((itemId, idx) => {
            const catItemDetails = itemDictionary[itemId]
            return catItemDetails ? (
              <CatalogListItem
                key={catItemDetails.id}
                isExpanded={preselection === catItemDetails.id || expandAll}
                nestLevel={nestLevel}
                categoryId={categoryId}
                {...catItemDetails}
              >
                {children && children(catItemDetails, initialItemOrder)}
              </CatalogListItem>
            ) : (
              <CatalogListItem key={idx} isExpanded={expandAll} nestLevel={nestLevel}>
                {children && children()}
              </CatalogListItem>
            )
          })}
      </DragAndDropList>
    )
  )  
}

CatalogList.propTypes = {
  currentItemOrder: PropTypes.arrayOf(PropTypes.string).isRequired,
  dndFunctions: PropTypes.shape({}).isRequired,
  droppableId: PropTypes.string.isRequired,
  expandAll: PropTypes.bool.isRequired,
  initialItemOrder: PropTypes.arrayOf(PropTypes.string).isRequired,
  itemDictionary: PropTypes.shape({}).isRequired,
  nestLevel: PropTypes.number.isRequired,
  preselection: PropTypes.string.isRequired,
  categoryId: PropTypes.string,
}

CatalogList.defaultProps = {
}
