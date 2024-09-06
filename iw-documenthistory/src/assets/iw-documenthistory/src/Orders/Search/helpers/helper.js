import {EVENT_TYPES, DATASET_ATTRIBUTES} from "../constants/Constants";

export const handleKeydownListener = (targetElem, listenerFunc = () => {}, addListener = false) => {
  if(targetElem) {
    if (addListener) {
      const {eventListener: {getKey, setKey} = {}} = DATASET_ATTRIBUTES;
      if(targetElem?.dataset?.[getKey] !== 'true') {
        targetElem.setAttribute(setKey, 'true');
        targetElem.addEventListener(EVENT_TYPES.keydown, listenerFunc)
      }
    } else {
      targetElem.removeEventListener(EVENT_TYPES.keydown, listenerFunc)
    }
  }
}

export const getDocumentElement = (selector) => {
  if(selector) {
    return document.querySelector(selector);
  }
}

export const focusElement = (target, preventScroll = false) => {
  if (target) {
    target.focus({ preventScroll });
  }
}
