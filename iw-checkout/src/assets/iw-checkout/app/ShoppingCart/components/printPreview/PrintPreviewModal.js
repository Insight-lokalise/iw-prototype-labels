import React from 'react'
import { Modal } from 'react-overlays'

import CartPrintHeader from './CartPrintHeader'

export default function PrintPreviewModal(props) {
    return (
        <Modal
            onHide={props.onHide}
            backdropClassName='iw-dialog iw-dialog-backdrop cart-print-preview__backdrop'
            show={props.showPrintPreview}
            onShow={cloneCartToPrintPreview}
            className='cart-container ds-v1 hide-for-print'>
            <div className="iw-dialog iw-dialog-contents xLarge">
                <div className="iw-modal cart-print-preview">
                    <CartPrintHeader pathname={props.pathname} />
                </div>
            </div>
        </Modal>
    )
}

function cloneCartToPrintPreview() {
    const $cart = $('#CartContainer > .cart-container').html()
    $('.cart-print-preview').append($cart)
}
