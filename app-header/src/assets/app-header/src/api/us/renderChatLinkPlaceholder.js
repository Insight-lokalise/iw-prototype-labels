import React from 'react'
import debounce from '@insight/toolkit-utils/lib/timing/debounce'

//const chatEvent = debounce(()=> window.dataLayer.push({'event': 'chatPlaceholder'}), 3000);
const chatEvent = debounce(()=> fireTagEvent('chat',{'event': 'chatPlaceholder'}), 3000);

export default function renderChatLinkPlaceholder({ isMobile }) {
  if(window.dataLayer) {
    // trigger an event to GTM so that Chat script can be loaded on to the page
    chatEvent({});
  }
  return {
    children: <span id={isMobile ? 'v-chat-link-mobile' : 'v-chat-link'} />
  }
}
