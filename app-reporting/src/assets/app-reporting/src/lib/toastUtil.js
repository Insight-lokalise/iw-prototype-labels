import React from 'react';

export const getToastData = (text, type = 'success') => [
  {
    id: `${type}-toast`,
    text: <div>{text}</div>,
    title: '',
    type,
  }
];