import React, {useState} from 'react'
import {t} from "@insight/toolkit-utils/lib/labels";
import {Button} from "@insight/toolkit-react";
import SaveAsListModal from "./SaveAsListModal";
import {saveCartAsList} from "../../api";

const CartOptions = ({isCartPage, emptyCart, shoppingRequest}) => {

  const [isSaveListOpen, setIsSaveListOpen] = useState(false)

  const closeSaveListModal = (isClearCart = false) => {
    setIsSaveListOpen(false)
    if (isClearCart) {
      if (isCartPage) {
        emptyCart()
      } else {
        window.location.href = window.location.origin
      }
    }
  }

  const handleSaveCartAsList = async (name, isClearCart) => {
    const {user} = shoppingRequest
    const loginProfileId = user.loginProfileId
    const response = await saveCartAsList({
      name,
      shoppingRequest,
      userId: loginProfileId,
    })
    if (isClearCart) {
      await emptyCart()
    }
    return response
  }

  const saveList = async ({ name, isClearCart }) => {
    try {
      return await handleSaveCartAsList(name, isClearCart)
    } catch (error) {
      throw new Error('Failed to save cart as list')
    }
  }


  const openSaveListModal = async () => {
    try {
      setIsSaveListOpen(true)
    } catch (error) {
      throw new Error('Failed to save enrollment ')
    }
  }

  return (
  <div className="c-cart-options hide-for-print">
    <>
      <hr />
      <div className="u-text-bold">{`${t('Cart options')}:`}</div>
    </>
    <div className="c-cart-summary-simple__link">
      <Button color="link" data-testid="save-quote">
        {t('Save as quote')}
      </Button>
    </div>
    <div className="c-cart-summary-simple__link">
      <Button color="link" data-testid="save-list" onClick={openSaveListModal} >
        {t('Save as list')}
      </Button>
    </div>
    <SaveAsListModal
      isOpen={isSaveListOpen}
      onClose={closeSaveListModal}
      onSaveList={saveList}
    />
  </div>
)
}

export default CartOptions
