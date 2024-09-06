import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { submit } from 'redux-form'

import { IWAnchor, IWButton } from '../../../../iw-components'
import { selector_lineLevelFormNames } from '../../selectors'
import {
    clearFormSubmissionStaging,
    declareItemToSplit,
    declareIsSaveAsQuote,
    resetNumberOfStagedLineLevelForms,
    setLineLevelFormSubmissionFailureStatus,
} from '../../actions/lineLevelFormActions'

import { recreateBundleParentFormName } from '../../actions/lineLevelFormActionHelpers'

export const linkTypes = {
    SPLIT_LINK: 'splitLink',
    SAVE_AS_QUOTE_LINK: 'saveAsQuoteLink',
    CONTINUE_BUTTON: 'continueButton',
}

export function SaveLineLevels(props) {
    function submitAllLineLevelForms() {
        const { associatedForm, dispatch, formNames, isBundled, linkType } = props

        dispatch(resetNumberOfStagedLineLevelForms())
        // reset failureStatus
        dispatch(setLineLevelFormSubmissionFailureStatus(false))
        // clear form submit data
        dispatch(clearFormSubmissionStaging())
        // declare which form will be split if any
        isBundled
            ? dispatch(declareItemToSplit(recreateBundleParentFormName(associatedForm)))
            : dispatch(declareItemToSplit(associatedForm))
        // declare whether it is save as quote
        dispatch(declareIsSaveAsQuote(linkType === linkTypes.SAVE_AS_QUOTE_LINK))
        // dispatch all form submits
        formNames.forEach(form => dispatch(submit(form)))
    }

    switch (props.linkType) {
        case linkTypes.SPLIT_LINK: {
            return (
                <IWAnchor onClick={submitAllLineLevelForms} className="line-level__split-link">
                    <span className="ion ion-shuffle" />
                    {props.text}
                </IWAnchor>
            )
        }
        case linkTypes.SAVE_AS_QUOTE_LINK: {
            return (
                <IWAnchor onClick={submitAllLineLevelForms} className="save-for-later__action">
                    {props.text}
                </IWAnchor>
            )
        }
        case linkTypes.CONTINUE_BUTTON: {
            return (
                <IWButton className="expanded cart-summary__button" onClick={submitAllLineLevelForms}>
                    {props.text}
                </IWButton>
            )
        }
        default: {
            console.warn('linkType not found')
            return null
        }
    }
}

SaveLineLevels.propTypes = {
    associatedForm: PropTypes.string.isRequired,
    formNames: PropTypes.arrayOf(PropTypes.string).isRequired,
    isBundled: PropTypes.bool.isRequired,
    linkType: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
}

SaveLineLevels.defaultProps = {
    associatedForm: '',
    isBundled: false,
}

function mapStateToProps(state) {
    return {
        formNames: selector_lineLevelFormNames(state),
    }
}

export default connect(mapStateToProps)(SaveLineLevels)
