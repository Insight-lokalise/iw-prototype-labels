import React, { useEffect, useState } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Field, reduxForm,  getFormValues, change } from 'redux-form'
import PropTypes from 'prop-types'

import { t } from '@insight/toolkit-utils/lib/labels'

import { IWAnchor } from '../../../../libs/iw-components'

import { IWModal, IWAddress, IWButton } from '../../../../libs/iw-components'
import { USER_ENTERED_ADDRESS, SUGGESTED_ADDRESS } from './../../constants/SAPAddressConstants'
import SuggestedAddressSearch from './SuggestedAddressSearch'


function SuggestedAddressModal(props) {
    const modalTitle = t('Address Validation')
    const descriptionText = t('Please choose which version of the address you want to use, or click Edit address to update the address you entered.')
    const saveText = t('Save address')
    const enteredAddress = t('Entered address:')
    const suggestedAddress = t('Suggested address:')
    const editText = t('Edit address')
    const noResultsFound = t('No suggestions Available.')
    props.enteredAddress.userSelectedAddressType = USER_ENTERED_ADDRESS
    
    const { suggestedAddresses, change, formValues } = props
    const minFilterLimit = 4
    const [filteredAddresses, setFilteredAddresses] = useState([])

    const filterAddress = (searchTerm) => {        

        const newFilteredAddresses = suggestedAddresses.reduce((acc, address, addressIndex)=>{

            let matchFound = false

            if(!searchTerm) {
                matchFound = true
            }
            else {
                //address props to search against
                const addressProps = {
                    street1: 'street1',
                    street2: 'street2',
                    street3: 'street3',
                    city: 'city',
                    region: 'region',
                    postalCode: 'postalCode',
                    country: 'country'
                  }

                //look for the searchTerm in address object props
                for(var key in address) {
                    if(addressProps[key] && address[key] && address[key].toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
                        matchFound = true
                        break
                    }
                }
            }

            //need to preserve original suggestedAddresses array element index so it can be saved later from parent component
            return matchFound ? acc.concat({...address, addressIndex}) : acc
            
        }, [])

        setFilteredAddresses(newFilteredAddresses)
        if(newFilteredAddresses.length == 0) {
            //if no search results found from suggested addresses, preslect user entered address
            change('SuggestedAddress','selectedAddress',USER_ENTERED_ADDRESS)
        }
        else if(formValues.selectedAddress != USER_ENTERED_ADDRESS) {
            //preselect first suggested address
            change('SuggestedAddress','selectedAddress',String(newFilteredAddresses[0].addressIndex))
        }        
    }

    useEffect(() => {
        //on initial render, show all suggested addresses
        filterAddress('')
      }, [suggestedAddresses])
    

    return (
        <IWModal
            backdropClassName='iw-dialog iw-dialog-backdrop new-address'
            modalSize='medium'
            disableCloseButton
            title={modalTitle}
            showIf={true}
            onHide={props.onHide}
            hideConfirmButton
            modalSize="large"
            >
            <div className="row">
                <div className="columns">
                    <br />
                    <p>{descriptionText}</p>

                    { suggestedAddress && suggestedAddresses.length >= minFilterLimit &&
                        <div className="row collapse">
                            <div className="columns small-12">
                                <div class="suggested-filter">
                                    <SuggestedAddressSearch filterAddress={filterAddress}/>
                                </div>
                            </div>
                        </div>
                    }

                    <form className="form" onSubmit={props.handleSubmit(normalizeAndSubmit(props.handleFormSubmit))}>
                        <div className="row collapse">
                            <div className="columns small-12 medium-6">
                                <div class="address-title">{enteredAddress}</div>
                                <label className="row align-top">
                                    <Field
                                        component={radioFieldContents}
                                        name='selectedAddress'
                                        type='radio'
                                        value={USER_ENTERED_ADDRESS}
                                    />
                                    <div className="columns">
                                        <IWAddress className="no-margin-bot" address={props.enteredAddress} />
                                    </div>
                                </label>
                            </div>
                            <hr className="columns small-12 hide-for-medium" />
                            <div className="columns small-12 medium-6">
                                <div class="address-title">{suggestedAddress}</div>
                                <div class="suggested-address">
                                { filteredAddresses.length > 0 && filteredAddresses.map((addr, idx) => {
                                    return (
                                        <label className='row align-top' key={String(addr.street1 + addr.city + addr.postalCode)}>
                                            <Field
                                                component={radioFieldContents}
                                                name='selectedAddress'
                                                type='radio'
                                                value={String(addr.addressIndex)}
                                            />
                                            <div className="columns">
                                                <IWAddress className="no-margin-bot" address={addr} />
                                            </div>
                                        </label>
                                    )
                                })}
                                { filteredAddresses.length == 0 &&
                                    <p className="no-margin-bot">{noResultsFound}</p>
                                }
                                </div>
                            </div>
                            <hr className="columns small-12 hide-for-medium" />
                        </div>
                        <br className="hide-for-small-only" />
                        <br className="hide-for-small-only" />
                        <div className="row align-right">
                            <div className="column small-6 medium-shrink">
                                 <IWAnchor onClick={props.onHide} className="button hollow expanded" role="button" tabindex="0" >
                                    {editText}
                                </IWAnchor>
                            </div>
                            <div className="column small-6 medium-shrink">
                                <IWButton className="expanded" type="submit">
                                    {saveText}
                                </IWButton>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </IWModal>
    )
}

function normalizeAndSubmit(handleFormSubmit) {
    return (values) => values.selectedAddress && handleFormSubmit(values.selectedAddress)
}

function radioFieldContents(field) {
    return <input className='columns shrink form__field form__input--radio' type='radio' {...field.input} />
}

SuggestedAddressModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    enteredAddress: PropTypes.object.isRequired,
    suggestedAddresses: PropTypes.array.isRequired,
    handleFormSubmit: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    formValues: getFormValues('SuggestedAddress')(state),
  });
  
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        change,
    }, dispatch)
};

export default reduxForm({
    form: 'SuggestedAddress',
    initialValues: {
        selectedAddress: '0', // redux-form all radio input values as strings.
    },
})(connect(
    mapStateToProps,
    mapDispatchToProps
  )(SuggestedAddressModal))
