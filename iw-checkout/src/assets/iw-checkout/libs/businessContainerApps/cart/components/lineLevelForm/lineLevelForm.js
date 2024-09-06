import React from 'react'
import PropTypes from 'prop-types'
import { reduxForm } from 'redux-form'

import {
    stageLineLevelFormDataForSaving,
    setLineLevelFormSubmissionFailureStatus,
    saveLineLevelFormData,
} from '../../actions/lineLevelFormActions'
import { navigateToSection } from './../../../../routes/navigate'


function LineLevelForm(props) {
    return (
        <form noValidate onSubmit={props.handleSubmit}>
            {props.children}
        </form>
    )
}

LineLevelForm.propTypes = {
    bundleParentMaterialIDKey: PropTypes.string.isRequired,
    childItems: PropTypes.arrayOf(PropTypes.object).isRequired,
    contractID: PropTypes.string.isRequired,
    contractReportingFields: PropTypes.arrayOf(PropTypes.object).isRequired,
    form: PropTypes.string.isRequired,
    hasContractReportingFields: PropTypes.bool.isRequired,
    hasCountryOfUsage: PropTypes.bool.isRequired,
    hasDiversityPartnerList: PropTypes.bool.isRequired,
    hasLicenseInfoCharacteristics: PropTypes.bool.isRequired,
    hasSavedSmartTrackers: PropTypes.bool.isRequired,
    hasSmartTrackers: PropTypes.bool.isRequired,
    history: PropTypes.object,
    setActiveIndex: PropTypes.func.isRequired,
    initialValues: PropTypes.objectOf(PropTypes.object).isRequired,
    lineLevels: PropTypes.objectOf(PropTypes.object).isRequired,
    materialIDKey: PropTypes.string.isRequired,
    outOfBundleChildItems: PropTypes.array,
    savedSmartTrackers: PropTypes.objectOf(PropTypes.object).isRequired,
    sellRequirement: PropTypes.object,
    updateChildItems: PropTypes.func.isRequired,
}

LineLevelForm.defaultProps = {
    outOfBundleChildItems: [],
    sellRequirement: {},
}

function onSubmit(values, dispatch, props) {
    return dispatch(stageLineLevelFormDataForSaving(values, props))
}

function onSubmitFail(errors, dispatch, submitError, props) {
    console.warn('submitError:', submitError)
    dispatch(scrollToFirstError(props.form))
    dispatch(setLineLevelFormSubmissionFailureStatus(true))
}

function onSubmitSuccess(values, dispatch, props) {
    const {
        bundledItem,
        bundleParentMaterialIDKey,
        childEnrollmentId,
        childItems,
        contractID,
        materialIDKey,
        outOfBundleChildItems
    } = props
    if(outOfBundleChildItems && outOfBundleChildItems.length > 0){
        const items = outOfBundleChildItems.map(item => {
            const enrolledItems = extractIds(outOfBundleChildItems, bundleParentMaterialIDKey, contractID, item, materialIDKey)
            enrolledItems && props.updateChildItems(enrolledItems)
        })
    }else{
        if(props.childItems.length > 0){
            const enrolledItems = extractIds(outOfBundleChildItems, bundleParentMaterialIDKey, contractID, childEnrollmentId, materialIDKey, childItems)
            enrolledItems && props.updateChildItems(enrolledItems)
        }
    }
    if(!bundledItem && props.childItems.length > 0){
        const enrolledItems = extractIds(outOfBundleChildItems, bundleParentMaterialIDKey, contractID, childEnrollmentId, materialIDKey, childItems)
        enrolledItems && props.updateChildItems(enrolledItems)
    }
    return dispatch(saveLineLevelFormData(({value})=>{
        const { checkoutState } = value
        navigateToSection(props.history, checkoutState ,props.setActiveIndex)
    }))
}

function extractIds(outOfBundleChildItems, bundleParentMaterialIDKey, contractID, childEnrollmentId, materialID, items){
    if(outOfBundleChildItems.length > 0){
        return {
            bundle: true,
            bundleParentMaterialIDKey: childEnrollmentId,
            contractId: contractID,
            childEnrollmentId: childEnrollmentId,
            materialIDKey : '',
            parentMaterialId: bundleParentMaterialIDKey
        }
    }else{
        const parentIDs = items.find(item => item.parentMaterialId === parseInt(materialID))
        if(parentIDs){
            return {
                bundle: false,
                bundleParentMaterialIDKey: bundleParentMaterialIDKey,
                contractId: contractID,
                childEnrollmentId: childEnrollmentId,
                materialIDKey : parentIDs.materialIDKey,
                parentMaterialId: parentIDs.parentMaterialId.toString()
            }
        }else{
            return false
        }
    }
}


export default reduxForm({
    destroyOnUnmount: false,
    pure: true,
    onSubmit,
    onSubmitFail,
    onSubmitSuccess,
})(LineLevelForm)

function scrollToFirstError(formName) {
    return (dispatch, getState) => {
        // if this is the first failed form, focus on said form
        if (!getState().lineLevelView.lineLevelFormSubmissionFailed) {
            document.getElementById(formName).scrollIntoView()
        }
    }
}
