import React, { useState, useEffect } from 'react'
import {
  ButtonGroup,
  Button,
  Date as CDate,
  Icon,
  Loading,
  Panel,
  ResourceTable,
} from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'
import { AddAllToCartModal } from './AddAllToCartModal'
import { DeleteCartModal } from './DeleteCartModal'
import { addToCart as addToCartAPI } from '../../api/addToCart'
import { getStoredCarts as getaStoredCartsAPI, getStoredCart } from '../../api/getStoredCarts'

export const StoredCartsContent = ({
  loginId,
  loading,
  setLoading,
  setMiniPDP,
  addToast,
  query,
}) => {
  const [storedCarts, setStoredCarts] = useState([])
  const [addToCartState, setAddToCartState] = useState({
    loading: false,
    isOpen: false,
  })
  const [deleteModalType, setDeleteModalType] = useState('')
  const [cartId, setCartId] = useState('')
  const [itemId, setItemId] = useState('')
  const [isWarrantyOnly, setIsWarrantyOnly] = useState(false)

  const fetchStoredCarts = async (query) => {
    try {
      setLoading(true)
      const res = await getaStoredCartsAPI(query)
      setStoredCarts(res)
    } catch (err) {
      console.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStoredCarts(query)
  }, [query])

  const handleAddAllToCartClick = async (row) => {
    setCartId(row.id)
    setAddToCartState(state => ({
      ...state,
      loading: true,
    }))
    try {
      await addToCartAPI(loginId, row.id)
      setAddToCartState(state => ({
        ...state,
        isOpen: true,
      }))
    } catch {
      setAddToCartState(state => ({
        ...state,
        loading: false,
      }))
      addToast({ message: t('Failed to add items to cart'), type: 'danger' })
    }
  }

  const hiddenLabelsOnMobile =['action']

  const labels = [
    { id: 'name', accessor: 'name', label: 'List name' },
    {
      id: 'date',
      accessor: 'date',
      label: t('Date created'),
      render: (row) => <CDate date={new Date(row.date)} />,
    },
    { id: 'totalQty', label: t('Item total'), accessor: 'totalQty' },
    {
      id: 'action',
      label: t('Actions'),
      render: (row) => {
        const adding = cartId === row?.id
        return (
          <ButtonGroup
            className="c-stored-carts__content__btngroup--header"
          >
            <Button
              color="primary"
              size="small"
              isLoading={adding && addToCartState?.loading}
              onClick={() => {
                handleAddAllToCartClick(row)
              }}
            >
              <span>{t('Add all to cart')}</span>
            </Button>
            <Button
              color="none"
              size="small"
              onClick={() => {
                setCartId(row?.id)
                setDeleteModalType('header')
              }}
              className="c-stored-carts__content__btngroup--icon"
            >
              <Icon icon="trashcan" />
            </Button>
          </ButtonGroup>
        )
      },
    },
  ]

  const lineLevelAction = (cartId, itemId, warrantyOnly=false) => {
    return (
      <ButtonGroup
        align="right"
        className="c-stored-carts__content__btngroup--line"
      >
        <Button
          color="none"
          size="small"
          onClick={() => {
            setCartId(cartId)
            setItemId(itemId)
            setIsWarrantyOnly(warrantyOnly)
            setDeleteModalType('line')
          }}
        >
          <Icon icon="trashcan" />
        </Button>
      </ButtonGroup>
    )
  }

  if (loading) {
    return (
      <Panel className="c-stored-carts--panel">
        <Panel.Body>
          <div className="u-text-center">
            <Loading size="large" />
          </div>
        </Panel.Body>
      </Panel>
    )
  }

  const isItemInvalid = product => product?.status === 'Inactive'

  const getItemQty = product => !product || product.enrollment || isItemInvalid(product) ? 0 : (product.quantity | 0)

  const getDetails = async (row) => {
    const id = row.id
    const shoppingRequest = await getStoredCart(id)
    const products = shoppingRequest?.cart?.cartItems || []
    let newTotalQty = products.reduce((total, product) => {
      const qty = getItemQty(product)
      if(qty <= 0) return total
      return total + qty + getItemQty(product.warranty)
    }, 0)
    if(newTotalQty <= 0) newTotalQty = '-'
    const newStoredCarts = storedCarts.map(cart => {
      if(cart.id === id) {
        return {...cart, totalQty: newTotalQty, products: products}
      }
      return cart;
    })
    setStoredCarts(newStoredCarts)
    return products
  }

  return (
    <>
      <Panel className="c-stored-carts--panel">
        <Panel.Body>
          {storedCarts && storedCarts?.length > 0 ? (
            <ResourceTable
              resources={storedCarts}
              labels={labels}
              openMiniPDP={(materialId) => setMiniPDP(materialId)}
              resourcesShowSize={100}
              lineLevelAction={lineLevelAction}
              getCurrencyCode={(row) => row.currency}
              isInitiallyExpanded={false}
              showLabelOnMobileAccordion={false}
              hiddenLabelsOnMobile={hiddenLabelsOnMobile}
              renderOnExpand={true}
              getDetails={getDetails}
              invalidHandler={isItemInvalid}
            />
          ) : query ? (
            <div>{t('No results found')}</div>
          ) : (
            <div>{t('You currently do not have any saved lists.')}</div>
          )}
        </Panel.Body>
      </Panel>
      {addToCartState?.isOpen && (
        <AddAllToCartModal
          loginId={loginId}
          cartId={cartId}
          setCartId={setCartId}
          onClose={() =>
            setAddToCartState(state => ({
              ...state,
              isOpen: false,
            }))
          }
          fetchCart={() => fetchStoredCarts(query)}
        />
      )}
      {!!deleteModalType && (
        <DeleteCartModal
          islineLevel={deleteModalType === 'line'}
          loginId={loginId}
          cartId={cartId}
          itemId={itemId}
          setCartId={setCartId}
          setItemId={setItemId}
          isWarrantyOnly={isWarrantyOnly}
          setIsWarrantyOnly={setIsWarrantyOnly}
          onClose={() => setDeleteModalType('')}
          fetchCart={() => fetchStoredCarts(query)}
          addToast={addToast}
        />
      )}
    </>
  )
}
