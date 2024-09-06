import React, { Fragment } from "react";
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils/lib/labels'
import Select from "react-select";
import cn from "classnames";
import Cookies from 'js-cookie';


export default function DEPEnrollments(props) {
    const {
        enrollmentIDs,
        enteredCustomerID,
        defaultEnrollmentID,
        handleEnrollmentIDSelection,
        handleUserInput,
        invalidID,
        isExistingID,
        materialIDKey,
        reset,
        setSelectedEnrollmentID,
        selectedCustomerID,
        isRegisteredOption,
    } = props


    const registeredID = t('Select your existing Organization ID registered with Insight.')
    const existingID = t('Enroll your existing Organization ID with Insight')
    const locale = Cookies.get('insight_locale');
    const country = locale.split('_')[1];
    let resellerId = '1C6A2360';
    if(country === 'GB') {
      resellerId = '3960F70';
    } else if(country === 'DE') {
      resellerId = 'C08CD60';
    }
    let gettingStartedGuidUrl = country === 'DE' ? 'https://de.insight.com/de_DE/shop/partner/apple/apple-business-manager.html' : 'https://www.apple.com/business/docs/site/Apple_Business_Manager_Getting_Started_Guide.pdf';
    const existingIDInfo = t(`Enter your Organization ID to register with Insight and continue your order. Please note that you must also have Insight\'s Reseller ID# ${resellerId} enabled as a supplier in your account in Apple\'s portal. To enroll in Apple Business Manager, refer to the `)
    const guide = t('Getting Started Guide.')
    const depID = t('Organization ID #')
    const select= t('Select')
    const showSelectOption = enrollmentIDs.length > 0
    const validDEPErrorMsg = t('Please enter a valid Organization ID.')
    const duplicateIDMsg = t('Organization ID is already listed with Insight.')
    return(
        <div className="row expanded dep_section">
            {showSelectOption && <Fragment>
              <div className='columns flex-child-auto medium-flex-child-shrink cart__table-col cart__table-col--dep_newEnrollment text-left'>
                <label onClick={()=>handleEnrollmentIDSelection('select')}>
                    <input className='dep_enrollmentIds__radio'
                           checked= {isRegisteredOption}
                           name={`dep_registered--enrollmentId_${materialIDKey}`} type="radio"/>
                    &nbsp;
                    <span>{registeredID}</span>
                </label>
              </div>
              <div className='columns flex-child-auto medium-flex-child-shrink cart__table-col cart__table-col--dep_enrollmentIds text-left'>
                <Select
                    className=""
                    value={selectedCustomerID || defaultEnrollmentID}
                    inputProps={{readOnly:true, id: `enrollmentId_${materialIDKey}`}}
                    onChange={setSelectedEnrollmentID}
                    options={enrollmentIDs}
                    placeholder={select}
                    disabled={!showSelectOption}
                />
              </div></Fragment>
            }
            {!showSelectOption && <Fragment>
                <div className='columns flex-child-auto medium-flex-child-shrink cart__table-col cart__table-col--dep_existingEnrollment text-left'>
                    <label onClick={()=>handleEnrollmentIDSelection('input')}>
                    <input className='dep_enrollmentIds__radio'
                               checked={!isRegisteredOption}
                               name={`dep_registered--enrollmentId_${materialIDKey}`} type="radio"/>
                        &nbsp;
                        <span>{existingID}</span>
                        <p className='cart__item-part cart__table-col--dep cart__font-size--sm'>
                            <span>{existingIDInfo}</span>
                            <a href={gettingStartedGuidUrl} target='_blank'>{guide}</a>
                        </p>
                    </label>
                </div>
                <div className='columns flex-child-auto medium-flex-child-shrink cart__table-col cart__table-col--dep_enrollmentIds text-left'>
                    <input
                        type="text"
                        className={cn({ 'form__field--error': invalidID }) + ' input-group-field'}
                        placeholder={depID}
                        onChange={(event)=>handleUserInput(event.target.value)}
                        onFocus={(event)=>handleUserInput(event.target.value)}
                        id={`enrollmentId_${materialIDKey}`}
                        value={enteredCustomerID === null ? '' : enteredCustomerID}
                    />
                    {invalidID && <div className='dep_invalid-error'>{validDEPErrorMsg}</div>}
                    {isExistingID && <div className='dep_invalid-error'>{duplicateIDMsg}</div>}
                </div></Fragment>
            }
        </div>
    )
}

DEPEnrollments.propTypes = {
    enrollmentIDs: PropTypes.arrayOf(PropTypes.object).isRequired,
    enteredCustomerID: PropTypes.string,
    defaultEnrollmentID: PropTypes.string,
    handleEnrollmentIDSelection: PropTypes.func.isRequired,
    handleUserInput: PropTypes.func.isRequired,
    numberOfItemsInCart: PropTypes.number,
    reset: PropTypes.bool.isRequired,
    setSelectedEnrollmentID: PropTypes.func.isRequired,
    selectedCustomerID: PropTypes.string.isRequired,
}

DEPEnrollments.defaultProps = {
    enteredCustomerID: '',
    numberOfItemsInCart: 0,
    selectedCustomerID: ''
}
