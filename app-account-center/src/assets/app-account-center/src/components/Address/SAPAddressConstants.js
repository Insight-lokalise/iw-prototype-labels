import { t } from '@insight/toolkit-utils/lib/labels'

/**
 * Types for submitting addresses to SAP for validation, shipTo/billTo creation,
 * and related error messages
 */
export const MODIFIED_USER_ENTERED_ADDRESS = 'MODIFIED_USER_ENTERED_ADDRESS'
export const USER_ENTERED_ADDRESS = 'USER_ENTERED_ADDRESS'
export const SUGGESTED_ADDRESS = 'SUGGESTED_ADDRESS'
export const SHIPPING_ADDRESS = 'SHIPPING_ADDRESS'
export const BILLING_ADDRESS = 'BILLING_ADDRESS'

export const ADDR_CREATE_SUCCESS = 'ADDR_CREATE_SUCCESS'
export const ADDR_VERIFY_SUCCESS = 'ADDR_VERIFY_SUCCESS'
export const SAP_SUGESSTED_ADDRESS = 'SAP_SUGESSTED_ADDRESS'
export const ADDRESS_CREATION_FAILED = 'ADDRESS_CREATION_FAILED'
export const ADDRESS_VERIFICATION_FAILED = 'ADDRESS_VERIFICATION_FAILED'
export const EXISTING_ADDRESS = 'EXISTING_ADDRESS'
export const INTERNAL_ERROR = 'INTERNAL_ERROR'
export const TAX_JURISDICTION_DETERMINATION_FAILED = 'TAX_JURISDICTION_DETERMINATION_FAILED'

export const creationStatusDescriptionTextMap = {
    ADDR_CREATE_SUCCESS: t('Address created'),
    EXISTING_ADDRESS: t('The address already exists.'),
    DUPLICATE_NICKNAME: t('The favorite name entered already exists.'),
    ADDRESS_CREATION_FAILED: t('Address creation in SAP failed'),
    ADDRESS_VERIFICATION_FAILED: t('Address could not be verified.'),
    INTERNAL_ERROR: t('An issue exists with the shipping/billing address. Please contact your account representative for more information.'),
    SAP_SUGESSTED_ADDRESS: t('There is an issue with the entered address.  Please use the suggested address or modify the address as necessary.'),
    TAX_JURISDICTION_DETERMINATION_FAILED: t('An issue exists with the shipping/billing address. Please contact your account representative for more information.'),
}
