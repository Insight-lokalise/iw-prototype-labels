import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'react-overlays'
import cn from 'classnames'

import './IWLoading.scss'

/**
 * TODO !Important! This component needs to inline its styles!
 */

/**
 * IWLoadingModal can appears as a centered modal that darkens the background.
 *
 * classNames can be passed which adjust the size of the spinner:
 *  [tiny, small, medium, large, giant, massive]
 *
 * TODO FIX the icon's lopsided-ness (may be exagerated only in IE)
 * TODO make the non-modal spinner correctly center itself in its container
 * TODO prevent clicks to the spinner's containing element
 */
export default function IWLoadingModal(props) {
  return (
    <Modal aria-labelledby="modal-label" style={modalStyle} backdropStyle={backdropStyle}>
      <div style={dialogStyle}>
        <div className={cn('iw-loading', `iw-loading__size-${props.size}`, props.className)} />
      </div>
    </Modal>
  )
}

const modalStyle = {
  position: 'fixed',
  zIndex: 1040,
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
}

const backdropStyle = {
  ...modalStyle,
  zIndex: 'auto',
  backgroundColor: '#2f2b27',
  opacity: 0.2,
}

const dialogStyle = {
  textAlign: 'center',
  position: 'absolute',
  width: 200,
  top: '50%',
  left: '50%',
  transform: `translate(-50%, -50%)`,
  padding: 20,
}

IWLoadingModal.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOf(['tiny', 'small', 'medium', 'large', 'giant', 'massive']),
}

IWLoadingModal.defaultProps = {
  className: '',
  size: 'massive',
}
