import React from "react";
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils/lib/labels'
import {IWAnchor, IWHelpIcon} from "../../../iw-components";


export default function DEPInteractions(props) {
    const {
        bundleParentMaterialIDKey,
        childEnrollmentId,
        contractID,
        handleClearFields,
        handleCopyToAll,
        isEnrolled,
        isReadOnly,
        materialIDKey,
        numberOfItemsInCart,
        showCopyToAllLink,
        showProductImages,
        splitDEPItems,
        toggleEnabling,
        enrollmentIDs
    } = props
    const enrollmentHeading = t('Device Enrollment Information')
    const enrollmentProgram = t('Use Device Enrollment Program')
    const splitLines = t('Split into individual lines')
    const clear = t('Clear')
    const copyToAll = t('Copy to all')
    const depInfoMsg = t('Please make a selection before proceeding to checkout.')

    return(
        <div className="row expanded dep_section">
            <div className='columns flex-child-auto medium-flex-child-shrink cart__table-col cart__table-col--dep_enabled text-left'>
                <div className={'cart__table-col ' + (showProductImages ? '' : 'hide-images-margin__ewr')}>
                    <strong>{enrollmentHeading}</strong>
                </div>
                <label className="form__label form__label--inline">
                    <input
                        className="form__field form__input--checkbox"
                        type="checkbox"
                        checked={isEnrolled}
                        disabled={isReadOnly}
                        onChange={event => toggleEnabling(event.target.checked)}
                    />
                    <span className="form__label--checkbox">
                        {enrollmentProgram}
                        <IWHelpIcon
                            className='right'
                            tooltip={t('Apple Business Manager helps businesses easily deploy and configure Apple devices. Apple Business Manager provides a fast, streamlined way to deploy organization-owned Apple devices purchased from Insight, a participating Apple Authorized Reseller. Supported Apple devices are Macintosh, iPhone, iPad, iPod touch, and Apple TV.')}/>

                    </span>
                </label>
                {enrollmentIDs && enrollmentIDs.length > 1 && <div className='dep-info__msg'>{depInfoMsg}</div>}
            </div>

            {isEnrolled && <div className='columns flex-child-auto medium-flex-child-shrink cart__table-col cart__table-col--dep_actions text-right'>
                {numberOfItemsInCart > 1 && Number(bundleParentMaterialIDKey) === 0 && <div className='cart__table-col--dep_split-link'>
                    <IWAnchor onClick={splitDEPItems} className="line-level__split-link">
                        <span className="ion ion-shuffle" />
                        {splitLines}
                    </IWAnchor>
                </div>}
                <div className="cart__table-col ">
                    <IWAnchor onClick={() => handleClearFields(childEnrollmentId, contractID, materialIDKey)}>
                        {clear}
                    </IWAnchor>
                    {showCopyToAllLink &&
                        <span>
                            <span className="vertical-separator"> | </span>
                            <IWAnchor onClick={()=>handleCopyToAll(contractID, materialIDKey)}>
                                {copyToAll}
                            </IWAnchor>
                        </span>
                    }
                </div>

            </div>}
        </div>
    )
}

DEPInteractions.propTypes = {
    childEnrollmentId: PropTypes.number.isRequired,
    contractID: PropTypes.string.isRequired,
    isEnrolled: PropTypes.bool.isRequired,
    isReadOnly: PropTypes.bool,
    handleClearFields: PropTypes.func.isRequired,
    handleCopyToAll: PropTypes.func.isRequired,
    materialIDKey: PropTypes.number.isRequired,
    numberOfItemsInCart: PropTypes.number.isRequired,
    showCopyToAllLink: PropTypes.bool.isRequired,
    showProductImages: PropTypes.bool.isRequired,
    splitDEPItems: PropTypes.func.isRequired,
    toggleEnabling: PropTypes.func.isRequired,
}

DEPInteractions.defaultProps = {
    isReadOnly: false
}