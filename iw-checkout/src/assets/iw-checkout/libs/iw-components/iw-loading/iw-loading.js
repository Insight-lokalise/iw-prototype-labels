import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from "react-overlays"

/*
 */
export const IWLoading = (props) => {
    var getInitialState = () => {
        return { showModal: false };
    };

    const modalStyle = {
        position: 'fixed',
        zIndex: 1040,
        top: 0, bottom: 0, left: 0, right: 0
    };

    const backdropStyle = {
        ...modalStyle,
        zIndex: 'auto',
        backgroundColor: '#222222',
        opacity: 0.2
    };

    const dialogStyle = function() {
        return {
            //borderRadius: 5,
            textAlign: 'center',
            position: 'absolute',
            width: 200,
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%)`,
            //border: '1px solid #e5e5e5',
            //backgroundColor: '#c0c0c0',
            //boxShadow: '0 5px 15px rgba(0,0,0,.5)',
            padding: 20
        };
    };

    var loader = null;
    if (!props.hide) {
        if (props.modal) {
            loader = (
                <Modal
                    aria-labelledby='modal-label'
                    style={modalStyle}
                    backdropStyle={backdropStyle}
                    show={props.modal}
                >
                    <div style={dialogStyle()} >
                        <div className={"iw-loading " + props.className}></div>
                    </div>
                </Modal>
            )
        } else {
            loader = (
               <div className={"iw-loading " + props.className}></div>
            )
        }
    }
    return (
        <span>
        {loader}
        </span>
    );
};

IWLoading.propTypes = {
    className: PropTypes.string,
    modal: PropTypes.bool,
    hide: PropTypes.bool,
}

