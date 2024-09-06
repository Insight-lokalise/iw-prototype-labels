import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from '@insight/toolkit-react'
import cn from 'classnames'
import { useSelector } from "react-redux"

import TagIcon from './TagIcon'
import { selector_taggingEnabled } from "../../../duck"

export default function Tag({ text, color, hideText, iconContainerClassName, finalTag, padding }) {
  const tagText = <span className="u-font-size-small">{text}</span>;
  const taggingEnabled = useSelector(selector_taggingEnabled)
  return taggingEnabled ? (
    <div className={cn('c-tag o-grid', iconContainerClassName, { 'u-padding-none': padding })}>
      <div className={cn("o-grid__item o-grid__item--shrink", { "u-margin-right-small": !hideText || finalTag }, { "c-cs-client__minilist-final-tag": finalTag })}>
        <Tooltip position="bottom" content={text}>
          <TagIcon color={color} />
        </Tooltip>
      </div>
      <div className="o-grid__item o-grid__item--shrink">
        {hideText ? null : tagText}
      </div>
    </div>
  ) : null
}

Tag.propTypes = {
  color: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  hideText: PropTypes.bool.isRequired,
  iconContainerClassName: PropTypes.string,
  finalTag: PropTypes.bool.isRequired,
  padding: PropTypes.bool,
}

Tag.defaultProps = {
  iconContainerClassName: '',
  padding: true,
}
