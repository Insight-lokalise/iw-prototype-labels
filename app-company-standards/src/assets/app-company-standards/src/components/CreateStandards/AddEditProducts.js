import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Loading, Panel } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

import AddProducts from './AddProducts'
import AltPanelHeader from './AltPanelHeader'
import EditProductsForm from './EditProductsForm'
import NameDisplayContainer from '../../containers/NameDisplayContainer'
import { UniversalMessageContext } from '../UniversalMessages'

export default function AddEditProducts({ locale, navigateOnSubmit, onSubmit, products, productSet, productSetId, isManagerView, categoryId }) {
  // Prevent rerender without complete productSet data. productSet state is being updated from productSet call + productSetItems call in the reducer
  if(!productSet.type) {
    return null;
  }
  const { master, shared } = productSet
  const isShared = !master && shared
  const [_, , productGroupId] = productSet.parents
  const { setActiveMessage } = useContext(UniversalMessageContext)

  function handleSubmit(formData) {
    onSubmit(formData, setActiveMessage).then(() => navigateOnSubmit({ categoryId, productGroupId, productSetId }))
  }

  const isNonConfigGroup = productSet.groupLabConfig === 'NONE' || productSet.groupLabConfig === 'None'
  return (
    <div className="c-container">
      <Panel className="o-box o-grid u-margin-bot">
        <AltPanelHeader title={t('Add/Edit products')}>
          <NameDisplayContainer categoryId={categoryId} productGroupId={productGroupId} productSetId={productSetId} />
        </AltPanelHeader>
        <div className="o-grid__item u-1/1 u-padding-side-small">
          <div className="o-grid">
            <div className="o-grid__item u-1/1">
              <AddProducts isShared={isShared} groupLabConfig={productSet.groupLabConfig} locale={locale} productSetId={productSetId} />
            </div>
            <div className="o-grid__item u-1/1">
              { !products ? (
                <Loading />
              ) : (
                <EditProductsForm
                  categoryId={categoryId}
                  isEdit
                  isNonConfig={isNonConfigGroup}
                  isManagerView={isManagerView}
                  locale={locale}
                  onSubmit={handleSubmit}
                  productGroupId={productGroupId}
                  products={products}
                  productSetId={productSetId}
                  productSetType={productSet.type}
                  isShared={isShared}
                  productSet={productSet}
                />
              )}
            </div>
          </div>
        </div>
      </Panel>
    </div>
  )
}

AddEditProducts.propTypes = {
  locale: PropTypes.string.isRequired,
  navigateOnSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
  productSet: PropTypes.shape({
    groupLabConfig: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    parents: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])).isRequired,
  }).isRequired,
  productSetId: PropTypes.string.isRequired,
  categoryId: PropTypes.string.isRequired,
}
