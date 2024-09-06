import { addToShoppingCartGAE } from '@insight/toolkit-utils/lib/analytics'

export function addToCartGAEAction (shoppingRequest, updatedQuantity, materialId) {
    const {
        cart: { cartItems },
    } = shoppingRequest
    const cartItem = cartItems.find(part => part.materialInfo.materialId==materialId)

    const addedCartItem = {
      name: cartItem.materialInfo.description,
      id: cartItem.materialInfo.materialId,
      productSku: cartItem.materialInfo.manufacturerPartNumber,
      insightPartId: cartItem.materialInfo.materialId,
      price: cartItem.totalPrice,
      brand: cartItem.materialInfo.manufacturerName,
      category: cartItem.materialInfo.categoryId,
      quantity: updatedQuantity || cartItem.quantity,
      currency: shoppingRequest.soldTo.currency,
    }

    console.log("addToCartGAEAction")
    console.log(addedCartItem)
    addToShoppingCartGAE(shoppingRequest.cart, [addedCartItem]);
}
