import { selector_countryCode } from './../../../libs/Insight/selectors'
import { selector_userSalesOrg, selector_isEMEA, } from './../../../libs/User/selectors'
import { normalizeToPurchaseOrderAddress } from './../../../libs/models/Address/address'
import { selector_billingCountry } from '../../LineLevel/selectors'

export function selector_addressSectionInitialValues(state, selectedAddress, { addNewFieldsOnly, isShipping }) {
    const { companyName, attentionLine, phone, address } = normalizeToPurchaseOrderAddress(selectedAddress)

    const attentionForm = {
        attentionLine: attentionLine,
        phone: phone,
        address3: address && address.address3,
    }

    const countryCode = selector_countryCode(state)
    const isFromCanada = selector_userSalesOrg(state) === '4100'
    const isEMEA = selector_isEMEA(state)
    const billingCountry = selector_billingCountry(state)

    const determineInitialCountry = () => {        
        if(isEMEA) {
            //EMEA, prepopulate country drop down to billingCountry, can be different from country code of locale (Ireland for example)
            return billingCountry ? billingCountry : countryCode
        }
        else {            
            return isShipping && isFromCanada ? 'CA' : countryCode
        }
    }

    const initialValues = {
        setNickName: false,
        allowPrivateShipTo: false,
        useAsDefaultAddress: false,
        country: determineInitialCountry(),
        existingAddressAttention: addNewFieldsOnly ? undefined : attentionForm,
    }

    let restFields = {
        companyName: companyName,
        street1: address.address1,
        street2: address.address2,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        dunsNumber: address.dunsNumber,
        attentionForm,
    }

    return addNewFieldsOnly ? { ...initialValues, ...restFields } : initialValues
}
