import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {
    createAccordion,
    setActiveIndex,
    saveIndex,
} from './actions'
import {
    selector_activeIndex,
} from './selectors'

/**
 * IWAccordion is a semi-generic wrapper for a list of items where only one is meant
 * to be active at a point of time. Current functionality is that items before
 * the active item are passed a isReadOnly prop and non-active items are always passed a isCollapsed prop 
 * unless expandAll prop is passed from parent.
 *
 * To all of its child elements, it provides the functions:
 *  setActiveIndex(index<Number>): sets the specified index as active. Generally,
 *      elements before the active index are passed a true isReadOnly prop and
 *      non-active elements are passed a true isCollapsed prop unless expandAll is set from parent
 *
 *  @deprecated
 *  saveIndex(index<Number>): notifies the accordion that a child has been
 *      acted on.
 *
 * NOTE it's important to keep in mind that right now everything is by Index. If
 * this should later change to a key like an item's name or id or something, it
 * won't take more than a couple hours.
 *
 * @example
 * <IWAccordion name="SBP" initialActiveIndex={1}>
 *     { showAdditionalInformation && <AdditionalInformation /> }
 *     <ShippingAddress />
 *     <PaymentInfo />
 * </IWAccordion>
 *
 * where
 * function ShippingAddress(props) {
 *     return (
 *         <header>
 *             <h4>Enter your shipping info</h4>
 *             <IWButton onClick={() => props.setActiveIndex.bind(0)}>
 *                 Go back
 *             </IWButton>
 *         </header>
 *         <AddressFields />
 *         <IWButton onClick={() => {
 *             // do some validation, make some calls
 *             props.setActiveIndex(2)
 *         }} >
 *             Continue
 *         </IWButton>
 *     )
 * }
 *
 */
export class IWAccordion extends Component {
    componentDidMount() {
        if (this.props.activeIndex == null) {
            this.props.createAccordion(this.props.name)
            this.props.setActiveIndex(this.props.name, this.props.initialActiveIndex || 0)
        }
    }

    render() {
        const { children, activeIndex, expandAll } = this.props
        const sections = React.Children.map(children, (child, idx) => {
            if (!child) return // in-case a child is falsy (from ternary or &&)

            // const hasSavedSection = savedIndexes.includes(idx)
            const isReadOnly = idx < activeIndex /* || hasSavedSection*/
            const isCollapsed = idx !== activeIndex && !expandAll /* && !hasSavedSection*/
            return React.cloneElement(child, {
                saveIndex: this.props.saveIndex.bind(this, this.props.name, idx),
                setActiveIndex: this.props.setActiveIndex,
                ownIndex: idx,
                accordionName: this.props.name,
                isReadOnly,
                isCollapsed,
            })
        })

        return (<div>
            { sections || null }
        </div>)
    }
}

function mapStateToProps(state, ownProps) {
    return {
        activeIndex: selector_activeIndex(state, ownProps.name),
        // savedIndexes: selector_savedIndexes(state, ownProps.name),
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        createAccordion,
        setActiveIndex,
        saveIndex,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(IWAccordion)

IWAccordion.propTypes = {
    activeIndex: PropTypes.number,
    // savedIndexes: PropTypes.arrayOf(PropTypes.number).isRequired,
    initialActiveIndex: PropTypes.number,
    createAccordion: PropTypes.func.isRequired,
    setActiveIndex: PropTypes.func.isRequired,
    saveIndex: PropTypes.func.isRequired,
}
