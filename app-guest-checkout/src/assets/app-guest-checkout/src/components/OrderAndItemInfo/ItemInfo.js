import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { items, splitItems, nextStepMap } from '@constants'
import { t } from "@insight/toolkit-utils/lib/labels";
import { hasStorage, getStorage } from "@insight/toolkit-utils/lib/helpers/storageHelpers";
import {Button, Form, ResourceItem} from '@insight/toolkit-react'
import { selector_lineLevelSessionInfos } from '../../state/slices/selectors/lineLevelSessionInfosSelector'
import {
  selector_cartItems,
  selector_shoppingRequest,
  selector_userInfo,
  selector_warrantyContactInfo
} from '../../state/slices/selectors/ShoppingReqeustSelector'
import LineLevelHeader from "./LineLevelHeader"
import LineLevelForm from "./LineLevelForm";
import {
  formInitialValues,
  getLicenseInfo,
  getRequiredLicenseFields
} from "../../lib/Helpers";
import { formValidation } from '../../lib/ItemFormValidation'
import { split, updateLineLevelInfo, fetchNextStep } from '../../api'
import {save as saveShoppingRequest} from "../../state/slices/shoppingRequestSlice";
import {save as saveLineLevelSessionInfos} from "../../state/slices/lineLevelSessionInfosSlice";

export default function ItemInfo(){
  const dispatch = useDispatch()
  const cartItems = useSelector(selector_cartItems)
  const lineLevelSessionInfos = useSelector(selector_lineLevelSessionInfos)
  const shoppingRequest = useSelector(selector_shoppingRequest)
  const [initialValues, setInitialValues] = useState(formInitialValues(cartItems, lineLevelSessionInfos))
  const showCopyToAllLink = lineLevelSessionInfos.length > 1

  const onSubmit = async (values) => {
    const lineLevelItems = values.lineLevelSessionInfos.map(item => {
      const lineId = item.id
      const usage = values[`countryUsage__${lineId}`] || null
      const sellReqFields = item.sellRequirements?.map((sellItem, sellIndex) => {
        const formSellKey = `${sellItem.name}__${lineId}`
        return {
          ...sellItem,
          value: values[formSellKey] || null,
        }
      }) || null
      return{
        id: lineId,
        countryOfUsage: usage,
        sellRequirements: sellReqFields
      }
    })
    const payload = {
      shoppingRequest: values.shoppingRequest,
      lineLevelSessionInfos: lineLevelItems,
      warrantyContact: {
        name: values.shoppingRequest.orderMetaData.warrantyContact.name,
        email: values.shoppingRequest.orderMetaData.warrantyContact.email,
        phone: values.shoppingRequest.orderMetaData.warrantyContact.phone
      }
    }
    const { data } = await updateLineLevelInfo (payload)
    updateState(data.shoppingRequest, data.lineLevelSessionInfos)
    const quickCheckoutRequested = hasStorage('quickCheckoutRequested')? getStorage('quickCheckoutRequested'): false
    const { checkoutState } = await fetchNextStep({
      source: 'LINE_LEVEL',
      quickCheckoutRequested,
      shoppingRequest: data.shoppingRequest,
      lineLevelSessionInfos: data.lineLevelSessionInfos,
    })
    const [url, hash] = nextStepMap[checkoutState]?.split('#')
    if(!!hash) {
      toggleAccordion(hash)
    }else{
      window.location = `/insightweb${url}`
    }
  }

  const validateForm = (formValues) => {
    let errors
    setInitialValues(formValues)
    cartItems.map((item, i) => {
      const lineLevelInfo = item.id === lineLevelSessionInfos[i].id ? lineLevelSessionInfos[i] : []
      const { materialID, requiredLineLevelFields } = getRequiredLicenseFields(item, lineLevelInfo)
      if(requiredLineLevelFields ?.length > 0){
        errors = formValidation(formValues, lineLevelInfo.id, materialID, requiredLineLevelFields)
      }
    })
    return errors
  }

  const clearFormValues = (id) => {
    const updatedValues = Object.keys(initialValues)
      .filter((key) => key.endsWith(`__${id}`))
      .reduce((obj, key) => {
        return Object.assign(obj, {
          [key]: ''
        });
      }, {});
    const mergedValues  = { ...initialValues, ...updatedValues}
    setInitialValues(mergedValues)
  }

  const updateState = (shoppingRequest, lineLevelSessionInfos) => {
    dispatch(saveShoppingRequest(shoppingRequest))
    dispatch(saveLineLevelSessionInfos(lineLevelSessionInfos))
  }

  const handleSplitLinkClick = async (id) => {
    const { shoppingRequest, lineLevelSessionInfos } = await split ({
      shoppingRequest,
      lineLevelSessionInfos,
      items: [{
        id,
        bundle: false
      }]
    })
    setInitialValues(formInitialValues(shoppingRequest.cart.cartItems, lineLevelSessionInfos))
    updateState(shoppingRequest, lineLevelSessionInfos)
  }

  const handleCopyToAll = (id) => {
    // Get the updated values for that particular item (materialID)
    const selectedCopyToValues = Object.keys(initialValues)
      .filter((key) => key.endsWith(`__${id}`))
      .reduce((obj, key) => {
        return Object.assign(obj, {
          [key]: initialValues[key]
        });
      }, {});

    // Loop through items and update sell req for all items except the updated item
    const restOfValuesToCopy = cartItems.map((item, i) => {
      const itemID = item.id
      const licenseChars = getLicenseInfo(lineLevelSessionInfos[i])
      if(itemID !== id) {
        const sellReqValues = licenseChars && licenseChars.map((sellItem) => {
          const {name} = sellItem
          return {[`${name}__${itemID}`]: selectedCopyToValues[`${name}__${id}`]}
        })
        const finalObj = {}
        for (let i = 0; i < sellReqValues.length; i++) {
          Object.assign(finalObj, sellReqValues[i]);
        }
        return {...finalObj, [`countryUsage__${itemID}`]: selectedCopyToValues[`countryUsage__${id}`]}
      }
    }).filter((item) => item !== undefined )

    const allCopiedValues = Object.assign({},...restOfValuesToCopy, selectedCopyToValues)
    setInitialValues(allCopiedValues)
  }

  const renderResourceItem = (item, i) => {
    const lineLevelInfo = item.id === lineLevelSessionInfos[i]?.id ? lineLevelSessionInfos[i] : {}
    const { hasCountryOfUsage=false, hasRequiredLineLevels=false } = getRequiredLicenseFields(item, lineLevelInfo)
    const showSplitLink = item.quantity > 1
    const licenseInfoCharacteristics = lineLevelInfo? getLicenseInfo(lineLevelInfo) : []
    const hasLicenseInfoCharacteristics = licenseInfoCharacteristics.length > 0
    const hasLicenseInfo = hasLicenseInfoCharacteristics || hasCountryOfUsage

    return(
      hasLicenseInfo &&
        <ResourceItem
          key={i}
          isLastItem={i === items.length - 1}
          isCheckout
          currencyCode={'USD'}
          product={item}
        >
            <LineLevelHeader
              clearFormValues={() => clearFormValues(item.id)}
              handleCopyToAll={() => handleCopyToAll(item.id)}
              hasRequiredLineLevels={hasRequiredLineLevels}
              handleSplitLinkClick={() => handleSplitLinkClick(item.id)}
              materialId={item.materialInfo.materialId}
              showCopyToAllLink={showCopyToAllLink}
              showSplitLink={showSplitLink}
            />
          {hasLicenseInfo &&
            <LineLevelForm
              id={lineLevelInfo.id}
              materialId={item.materialInfo.materialId}
              countryOfUsage={lineLevelInfo.countryOfUsage}
              hasCountryOfUsage={hasCountryOfUsage}
              sellRequirement={licenseInfoCharacteristics}
              sellRequirementId={licenseInfoCharacteristics.length > 0 ? lineLevelInfo.sellRequirements[0].sellRequirementId : ''}
            />
          }
        </ResourceItem>
    )}

  const combinedInitialValues = {
    ...initialValues,
    shoppingRequest,
    lineLevelSessionInfos
  }

  return (
    <div className='o-grid'>
      <div className='o-grid__item'>
        <Form
          initialValues={combinedInitialValues}
          onSubmit={onSubmit}
          validate={validateForm}
          skipValidateOnMount
          validateOnBlur
          render={({handleSubmit}) => {
            return(
              <form onSubmit={handleSubmit} noValidate className="c-form" aria-labelledby="licenseInformation">
                <fieldset className="c-form__group" data-private="true">
                  {cartItems.map((item, i) => renderResourceItem(item, i))}
                </fieldset>
                <div className='c-guest-checkout__button'>
                  <Button
                    color="primary"
                    data-testid='item-info-submit-btn'
                    onClick={handleSubmit}
                  >
                    {t('Continue')}
                  </Button>
                </div>
              </form>
            )
          }}
        />
      </div>
    </div>
  )
}
