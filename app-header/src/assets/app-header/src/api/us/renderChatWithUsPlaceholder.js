import React from 'react'
export default function renderChatWithUsPlaceholder({chatType:type})  {
  return {
    children: <div className={`c-header-${type}__link`}><span id='app-header-chat-with-us' /></div>
  }
}
