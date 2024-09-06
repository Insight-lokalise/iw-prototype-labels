import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { useSelector } from "react-redux"

import { Pin } from './index'
import Tag from './Tags/Tag'
import Quantity from './Quantity'
import { selector_language, selector_tags, selector_userSettings, selector_isPurchasingPopupEnabled } from "../../duck"

export default function TagPinContainer({ showTags, showPin, pinOptions, tagOptions, routine, productGroupId, showQuantity }) {
  const { justification, layout, tagOrder, isMiniListView, tagClassName, iconContainerClassName } = tagOptions
  const { id, pinClassName } = pinOptions

  const { language, showAddToCartPopup, tags, viewMode: { viewMode } } = useSelector(state => ({
    language: selector_language(state),
    showAddToCartPopup: selector_isPurchasingPopupEnabled(state),
    tags: selector_tags(state, tagOrder),
    viewMode: selector_userSettings(state),
  }))

  const justificationMap = {
    centered: 'center',
    right: 'right',
    left: 'left',
  }

  const tagMap = {
    horizontal: (
      <div
        className={cn(
          isMiniListView ? "o-grid--justify-right" : "o-grid--justify-left",
          "o-grid",
          tagClassName
        )}
      >
        {tags.map((tag, i) =>
          tag ? (
            <div className="o-grid__item o-grid__item--shrink" key={tag.id}>
              {tags.length === 1 && (
                <div className="c-cs-client__tag-pin-container-blank" />
              )}
              <Tag
                color={tag.color}
                text={tag.name[language] || tag.name["en"]}
                hideText={isMiniListView || viewMode === "LIST"}
                iconContainerClassName={iconContainerClassName}
                finalTag={i === tags.length - 1}
              />
            </div>
          ) : null
        )}
      </div>
    ),
    vertical: tags.map(tag =>
      tag ? (
        <div
          className={cn(
            `o-grid o-grid--justify-${justificationMap[justification]}`,
            tagClassName
          )}
        >
          <div className="o-grid__item o-grid__item--shrink" key={tag.id}>
            <Tag
              color={tag.color}
              text={tag.name[language] || tag.name["en"]}
              hideText={isMiniListView || viewMode === "LIST"}
              iconContainerClassName={iconContainerClassName}
            />
          </div>
        </div>
      ) : null
    )
  };

  const justifyContainer = () => {
    if (isMiniListView) {
      return 'right'
    } else if (showTags && showPin) {
      return 'between'
    } else if (justification) {
      return justificationMap[justification]
    }
    return 'center'
  }
  return (
    <div className={cn(`o-grid o-grid--center o-grid--justify-${justifyContainer()}`, pinClassName)}>
      {showPin && isMiniListView && <Pin className={pinClassName} id={id} />}
      {isMiniListView && <div className="o-grid__item u-1/1" />}
      {showTags &&
        <div className={cn("o-grid__item o-grid__item--shrink")}>
          {tagMap[layout]}
        </div>}
      {(layout === 'horizontal' && showQuantity && routine) && <Quantity productGroupId={productGroupId} showAddToCartPopup={showAddToCartPopup} />}
      {showPin && !isMiniListView && <Pin className={pinClassName} id={id} />}
    </div>
  )
}

TagPinContainer.propTypes = {
  showTags: PropTypes.bool,
  showPin: PropTypes.bool,
  tagOptions: PropTypes.shape({
    justification: PropTypes.string.isRequired,
    layout: PropTypes.string.isRequired,
    padding: PropTypes.bool,
    tagOrder: PropTypes.arrayOf(PropTypes.string).isRequired,
    tagClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.objectOf(PropTypes.bool)]),
    isMiniListView: PropTypes.bool,
    iconContainerClassName: PropTypes.string,
    routine: PropTypes.bool,
    showQuantity: PropTypes.bool,
    productGroupId: PropTypes.string
  }),
  pinOptions: PropTypes.shape({
    id: PropTypes.string.isRequired,
    pinClassName: PropTypes.string,
  })
}

TagPinContainer.defaultProps = {
  showTags: false,
  showPin: false,
  tagOptions: {
    justification: 'left',
    layout: 'horizontal',
    padding: true,
    tagClassName: '',
    isMiniListView: false,
    iconContainerClassName: '',
  },
  pinOptions: {
    id: '',
    pinClassName: '',
  }
}
