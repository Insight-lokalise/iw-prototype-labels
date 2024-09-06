import React from 'react'
import PropTypes from 'prop-types'

import { IWOverlayAdvanced, IWOverlayBody, IWOverlayController } from './'

export default function IWOverlay(props) {
  return (
    <IWOverlayAdvanced className={props.className}>
      <IWOverlayController className={props.controllerClassName}>{props.children}</IWOverlayController>
      <IWOverlayBody
        className={props.bodyClassName}
        hideArrow={props.hideArrow}
        hideHeader={props.hideHeader}
        position={props.position}
        title={props.title}
        useDefaultStyles={props.useDefaultStyles}
      >
        {props.overlayBody}
      </IWOverlayBody>
    </IWOverlayAdvanced>
  )
}

IWOverlay.propTypes = {
  bodyClassName: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  className: PropTypes.string,
  controllerClassName: PropTypes.string,
  hideArrow: PropTypes.bool,
  hideHeader: PropTypes.bool,
  overlayBody: PropTypes.node.isRequired,
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right', 'none']),
  title: PropTypes.string,
  useDefaultStyles: PropTypes.bool,
}

IWOverlay.defaultProps = {
  bodyClassName: '',
  children: null,
  className: '',
  controllerClassName: '',
  hideArrow: false,
  hideHeader: false,
  position: 'right',
  title: '',
  useDefaultStyles: true,
}
