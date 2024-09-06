import { removeFromShoppingCartGAE } from '@insight/toolkit-utils/lib/analytics'

export function removeFromCartGAEAction (shoppingRequest, id, isWarranty = false) {
    const {
        cart: { cartItems },
    } = shoppingRequest

    const cartItem = cartItems.find(part => part.id===id)
    const warrantyItem = cartItem?.warranty

    const deleteCartItem = {
      name: isWarranty? warrantyItem.description :cartItem.materialInfo.description,
      id: isWarranty? warrantyItem.materialId :cartItem.materialInfo.materialId,
      productSku: cartItem.materialInfo.manufacturerPartNumber,
      insightPartId: cartItem.materialInfo.materialId,
      price: isWarranty? warrantyItem.totalPrice :cartItem.totalPrice,
      brand: cartItem.materialInfo.manufacturerName,
      category: cartItem.materialInfo.categoryId,
      //quantity: formatedShoppingReqFromStorage?.materialList[0]?.quantity || cartItem.quantity,
      quantity: isWarranty? warrantyItem.quantity :cartItem.quantity,
      currency: shoppingRequest.soldTo.currency,
    }

    removeFromShoppingCartGAE(shoppingRequest.cart, [deleteCartItem]);
}
