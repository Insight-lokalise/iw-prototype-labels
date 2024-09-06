import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'

import { selector_b2bLoginInfo } from './../../../../libs/User/selectors'
import { selector_cartTransfer } from './../../../../libs/Cart/selectors/b2bTransfer'
import { IWLoading } from './../../../../libs/iw-components'

function PunchoutCart(props){
    return (
        <section className="invisible clientProcForm">
            { props.cartTransfer.isPending && <IWLoading modal={true} className="iw-loading__size-giant" /> }
            { 'commodities' in props.cartTransfer && B2BHiddenMarkup(props) }
        </section>
    )
}

function B2BHiddenMarkup(props) {
    const { eProcType } = props
    const { setupToken, formPostHtml, target } = props.cartTransfer
    let parser = new DOMParser();
    let doc = parser.parseFromString(formPostHtml, 'text/html')
    const parsedFormPostHTML = eProcType === 'EB' ? doc.body : doc.body.firstChild.data
    switch (eProcType) {
        case 'CX':
            return (
                <form id="hiddenFormSubmit" action={setupToken.browserFormPost} method="POST" >
                    <input type="hidden" id="cxml_urlencoded_id" name="cxml-urlencoded" value={parsedFormPostHTML} />
                </form>
            )
        case 'OA':
            return (
                <form id="hiddenFormSubmit" action={setupToken.browserFormPost} method="POST" target={target}>
                    <input type="hidden" id="oracleCart" name="oracleCart" value={parsedFormPostHTML}/>
                </form>
            )
        case 'EB':
            return (
                <form id="hiddenFormSubmit" action={setupToken.browserFormPost}
                    method="POST" target={target} dangerouslySetInnerHTML= {{ __html: formPostHtml }}>
                </form>
            )
        default:
            return (
                <form/>
            )
    }
}

function mapStateToProps(state) {
    return {
        cartTransfer: selector_cartTransfer(state),
        eProcType: selector_b2bLoginInfo(state).eProcType,
    }
}

export default connect(mapStateToProps, null)(PunchoutCart)

PunchoutCart.propTypes = {
    eProcType: PropTypes.string.isRequired,
    cartTransfer: PropTypes.object.isRequired,
}
