import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import { renderChatLinkPlaceholder, renderChatLinkMobilePlaceholder } from 'api'
import useFilteredItemStatus from '../../hooks/useFilteredItemStatus'
import IAHeaderContext from '../../context/IAHeaderContext'
import ChatWrapper from './ChatWrapper'


export default function ChatNow(props) {
  const { headerInfo: { isLiveChatEnabled } } = useContext(IAHeaderContext)
  const isFiltered = useFilteredItemStatus(props.id)

  const { wrapper: Wrapper, type, isMobile } = props
  const { children, ...rest } = isMobile? renderChatLinkMobilePlaceholder(props) : renderChatLinkPlaceholder(props)

  return !isFiltered && isLiveChatEnabled
    ? <Wrapper {...rest} type={type}>{children}</Wrapper>
    : null
}

ChatNow.propTypes = {
  isMobile: PropTypes.bool,
  type: PropTypes.string,
  wrapper: PropTypes.func,
}

ChatNow.defaultProps = {
  isMobile: false,
  type: 'top',
  wrapper: ChatWrapper,
}
