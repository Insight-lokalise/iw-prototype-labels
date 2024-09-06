export const flatPermissions = (permissions) => {
    const defaultPermission = {
        enable_warranty_purchase: true,
        enable_accessory_purchase: true,
        enable_purchasing_popup: true,
        enable_personal_product_list: false,
        enable_inventory_search: false,
        enableViewPricing: true,
    }
    if(permissions) {
        const {
            enableAccessories = true, 
            enablePurchasePopup = true, 
            enableWarranties = true,
            enablePersonalProductList = false,
            enableInventorySearch = false,
            enableViewPricing = true,
        } = permissions
        return {
            enable_warranty_purchase: enableWarranties,
            enable_accessory_purchase: enableAccessories,
            enable_purchasing_popup: enablePurchasePopup,
            enable_personal_product_list: enablePersonalProductList,
            enable_inventory_search: enableInventorySearch,
            enableViewPricing: enableViewPricing,
        }
    }
    else return defaultPermission
}

export const flatWebGroupPermissions = (permissions) => {
   // we need to expand this list as we start using more in this app
    const defaultPermission = {
        enableListPrice: true,
        disableStockAndPrice: false,
    }
    if(permissions.length > 0) {
        return {
            enableListPrice: permissions.includes('list_price'),
            disableStockAndPrice: permissions.includes('disable_stock_and_price_display'),
        }
    }
    else return defaultPermission
}
