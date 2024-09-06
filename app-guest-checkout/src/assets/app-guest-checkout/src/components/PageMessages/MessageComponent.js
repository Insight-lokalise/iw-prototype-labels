import React from 'react';
import { useSelector } from 'react-redux';
import { selector_Messages } from './../../state/slices/messageSlice';
import { Message } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils/lib/labels'

const MessageComponent = () => {
  const messages = useSelector(selector_Messages);
  return (
    <div>
      {Array.isArray(messages) && messages.map(message => (
        <div key={message.id}>
          <Message type={message.type} className={"c-section__cart_validation-error"}>
            {t(message.text)}
          </Message>
        </div>
      ))}
    </div>
  );
};

export default MessageComponent;
