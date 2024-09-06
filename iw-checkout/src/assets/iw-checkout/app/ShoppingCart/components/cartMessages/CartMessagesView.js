import React, { Component } from 'react'

import { t } from '@insight/toolkit-utils/lib/labels'
import {
  IWMessage,
  IWMessageBox,
} from './../../../../libs/iw-components/iw-messageBox'
import msgBox from './../../../../libs/iw-components/iw-messageBox'

import { processShoppingCartMessages } from './processShoppingCartMessages'
import { showCarrierChargeMessage } from '../../../libs/utils'
/**
 * The top-level MessageBox display of the ShoppingCart. To add messages to those
 * displayed here:
 *
 * @example
 * import MsgBox from './..../components/iw-messageBox'
 *
 * MsgBox.addMsg('shopping-cart', { text: 'your message', severity: info, hideIcon: true })
 *
 * MsgBox.clear('shopping-cart') // to remove all displayed messages. Maybe not what you're looking for.
 *
 * // To remove a specific message, you must create an ID for it when you originally post the message
 * MsgBox.addMsg('shopping-cart', { msgId: 'mustSelectRequestorGroup', text: 'your message', severity: info, hideIcon: true })
 * MsgBox.removeMsg('shopping-cart', 'mustSelectRequestorGroup')
 */
export class CartMessageView extends Component {
  componentDidMount() {
    processShoppingCartMessages(this.props)
    msgBox.removeMsg('shopping-cart', 'sendToColleagueResponse')
  }

  componentDidUpdate() {
    if (this.props) {
      processShoppingCartMessages(this.props)
    }
  }

  render() {
    const { transportsToDetermine, hasQuickCheckout500Error } = this.props
    const showMe =
      (this.props.hasItemsInCart && this.props.splaMessages.length > 0) ||
      hasQuickCheckout500Error ||
      transportsToDetermine ||
      this.props.hasShoppingCartMessages.length > 0

    return (
      <div className={showMe ? '' : 'hide'}>
        <div className="row expanded is-collapse-child shopping-cart__messages">
          <div className="columns">
            <IWMessageBox
              boxId="shopping-cart"
              Content={(props) => (
                <div>
                  {props.messages.map((msg) => (
                    <IWMessage
                      className="expanded"
                      key={msg.text}
                      {...msg}
                    />
                  )) || null}
                </div>
              )}
            />
            <div>
              {(this.props.hasItemsInCart &&
                this.props.splaMessages.map((msg) => (
                  <IWMessage
                    className=" expanded"
                    key={msg}
                    text={msg}
                    severity="info"
                  />
                ))) ||
                null}
              {hasQuickCheckout500Error && (
                <IWMessage
                  className="expanded hide-for-print hide-for-email"
                  key="quickCheckout500Error"
                  text={t(
                    'A carrier cannot be identified with your current shipping location. Please contact your account rep for further assistance.'
                  )}
                  severity="error"
                />
              )}
            </div>
            {transportsToDetermine &&
              showCarrierChargeMessage('hide-for-email')}
          </div>
        </div>
      </div>
    )
  }
}
