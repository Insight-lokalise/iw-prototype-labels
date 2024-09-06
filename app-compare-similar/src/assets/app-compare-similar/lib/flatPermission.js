export const flatPermissions = (permissions) => {
    const defaultPermission = {
        enable_warranty_purchase: true,
        enable_accessory_purchase: true,
        enable_purchasing_popup: true,
        enable_personal_product_list: false,
        enableViewPricing: true,
    }
    if(permissions) {
        const {
            enableAccessories = true, 
            enablePurchasePopup = true, 
            enableWarranties = true,
            enablePersonalProductList = false,
            enableViewPricing = true,
        } = permissions
        return {
            enable_warranty_purchase: enableWarranties,
            enable_accessory_purchase: enableAccessories,
            enable_purchasing_popup: enablePurchasePopup,
            enable_personal_product_list: enablePersonalProductList,
            enableViewPricing: enableViewPricing,
        }
    }
    else return defaultPermission
}