import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
// import omit from 'lodash-es/omit'

import msgBox from './model'

/**
 *  A MessageBox component listens to changes in its Redux state, re-rendering
 *  its @prop Content whenever it's @prop boxId part of the
 *  `state.messages` Redux state changes. Changes are affected via the MessageBox
 *  model, found at ./model. It has an api for reading, updating, and clearing
 *  a message's properties. It conveniantly allows you to change, through redux,
 *  a message from anywhere in the application.
 *
 *  @prop Content is a function which returns JSX. It receives as props the
 *  `state.messages[@prop boxId]`, allowing it to significantly customize its
 *  behavior and style.
 *
 *  @example
 *  <MessageBox boxId='shopping-cart' Content={props =>
 *   <div>
 *       { props.messages.map(msg => <Message key={msg.text} {...msg} />) || null }
 *   </div>
 *  } />
 */
export class IWMessageBox extends Component {
    componentDidMount() {
        const { messageState } = this.props
        if (!messageState) {
            msgBox.create(this.props.boxId, this.props.ownProps)
        }
    }

  render() {
        const { messageState, Content } = this.props

        if (!messageState || !messageState.messages || !messageState.messages.length) return null

        return <Content {...this.props.messageState} />
    }
}

// prevent [children, Content] from passing as properties to redux during the constructor
function mapStateToProps(state, { children, Content, ...ownProps }) { // eslint-disable-line no-unused-vars
    return {
        messageState: state.messageBoxes[ownProps.boxId],
        ownProps,
    }
}

export default connect(mapStateToProps, null)(IWMessageBox)

IWMessageBox.propTypes = {
    boxId: PropTypes.string,
    Content: PropTypes.func,
    messageState: PropTypes.object,
    ownProps: PropTypes.object,
}
