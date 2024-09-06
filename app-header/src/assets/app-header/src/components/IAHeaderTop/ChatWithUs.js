import React, { useContext, useEffect}  from 'react'
import PropTypes from 'prop-types'
import isMobile from '@insight/toolkit-utils/lib/media/isMobile'

import useFilteredItemStatus from '../../hooks/useFilteredItemStatus'
import IAHeaderContext from '../../context/IAHeaderContext'
import ChatWrapper from './ChatWrapper'
import { renderChatWithUsPlaceholder, renderChatWithUsMobilePlaceholder, incrementChatWithUsCounter } from 'api'

export default function ChatWithUs(props) {

  useEffect(() => {
    incrementChatWithUsCounter()
  }, [])

  const { headerInfo: { isLiveChatEnabled } } = useContext(IAHeaderContext)
  const { id, wrapper: Wrapper, chatType } = props
  const isFiltered = useFilteredItemStatus(id)
  const isOnMobile = isMobile()

  const { children, ...rest } = isOnMobile? renderChatWithUsMobilePlaceholder(props) : renderChatWithUsPlaceholder(props)

  return !isFiltered && isLiveChatEnabled
    ? <Wrapper {...rest} type={chatType} >{children}</Wrapper>
    : null
}

ChatWithUs.propTypes = {
  chatType: PropTypes.string,
  isMobile: PropTypes.bool,
  wrapper: PropTypes.func,
}

ChatWithUs.defaultProps = {
  chatType: 'top',
  isMobile: false,
  wrapper: ChatWrapper,
}
