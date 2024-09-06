import React, { Fragment, useState, useEffect, useRef } from 'react'
import PropTypes from "prop-types";
import { t } from "@insight/toolkit-utils";
import { SmartCart, Quantity, Selection, Price, Icon } from '@insight/toolkit-react'
import { useSelector } from "react-redux";

import { selector_language, selector_isViewPriceEnabled, selector_userSettings, selector_isEMEA,
  selector_isStockAndPriceDisplay } from "../duck";
import { parse } from './Shared'
import { fetchProductInformation } from "../api";
import { PDPModal } from "../lib/PDP"

export default function ProductSetView(props) {
  const { attachment, hasErrors, hasSomeUnavailableParts, contract, firstPSetWithError, type } = props
  const isSingleWithNoneOptionType = (type === "SINGLEWITHNONE" && window.flags && window.flags["GNA-10010-CS-SINGLE-NONE"])
  const fileName = attachment && attachment.split('/').pop()
  const fileDisplayName = fileName && fileName.length > 20 ? fileName.substring(0,17).concat('...') : fileName
  const unavailableErrorMessage = t("One or more required products are unavailable. Please contact your support team for assistance.")
  const errorMessageForMandatory = hasSomeUnavailableParts? unavailableErrorMessage
    : t("All products are mandatory and must be added to your cart")
  const errorMessageForSingle = hasSomeUnavailableParts? unavailableErrorMessage
    : t("A selection is required")
  const productSetRef = useRef(null);
  const [modalState, editModalState] = useState(false)
  const { isViewPriceEnabled, language, userSettings, isEMEA, isCallForPrice, isStockAndPriceDisplay} = useSelector(state => ({
    language: selector_language(state),
    isViewPriceEnabled: selector_isViewPriceEnabled(state),
    isStockAndPriceDisplay: selector_isStockAndPriceDisplay(state),
    userSettings: selector_userSettings(state),
    isEMEA: selector_isEMEA(state),
  }));

  useEffect(()=>{
    if (hasErrors && firstPSetWithError && productSetRef.current) {
      productSetRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [hasErrors])

  const textLine = (
    type === 'MANDATORY' && (
      `**${t("The following products are mandatory and must be added to your cart.")}`
    )
  ) || (
      (type === 'SINGLE' || type === 'SINGLEWITHNONE') && (
        `**${t("One of the following options must be selected before continuing.")}`
      )
    ) || undefined

  const emptySet = props.contract[0].lineitems.length < 1
  const isItemSelectionDisabled = type === 'MANDATORY' || !isViewPriceEnabled
  function ErrorMessage() {
    const errorMessage = type === "MANDATORY" ? errorMessageForMandatory : errorMessageForSingle
    return (
      <div>
        <small className="c-cart__error">
          <Icon type="error" icon="alert" className="c-cart__error-icon"></Icon>
          {errorMessage}
        </small>
      </div>
    )
  }

  const parsedSetDescription = (
    props.description[language] || props.description["en"]
    ) ? (
      parse(props.description[language] || props.description["en"])
    ) : null

  return (
    <Fragment>
      <div ref={productSetRef} className="o-grid__item u-1/1">
        <div className="o-grid">
          <h5 className="c-cs-ps__name u-padding-small u-margin-none u-text-bold o-grid__item u-2/3">
            {props.name[language] || props.name["en"]}
          </h5>
          { attachment && (
            <div className="o-grid__item u-1/3 u-padding-small u-text-right c-cs-attachment" aria-label={fileName}>
              <a href={attachment} target="_blank">
                <Icon icon="attach" className="c-button__icon c-button__icon--left" />
                <span>{fileDisplayName}</span>
              </a>
            </div>
          )}
        </div>
        { parsedSetDescription && (
          <p className="c-cs-pg-detail__parsed u-padding-small u-margin-none u-padding-top-none">
            {parsedSetDescription}
          </p>
        )}
        {emptySet ? (
          <p className="u-padding-small u-margin-none">
            {t(
              "There are no products available. Please contact your support team for assistance."
            )}
          </p>
        ) : (
          <SmartCart
            className='u-padding-top-small'
            contracts={contract}
            isViewPriceEnabled={!isCallForPrice}
            productCallback={editModalState}
            onChange={props.onChange}
            hasErrors={hasErrors}
            errorComponent={ErrorMessage}
            textLine={textLine}
            useTitleBar={false}
            language={language}
            hideContractSidePanel
            isEMEA={isEMEA}
            showProductImage={userSettings.showPictures}
            isSingleWithNoneOptionType={isSingleWithNoneOptionType}
            selectionType={selectionTypes[type]}
            isItemSelectionDisabled={isItemSelectionDisabled}
          >
            <Quantity
              title={t('Qty')}
              disableAvailability={!isStockAndPriceDisplay }
              adjustable={!props.disableQty}
            />
            {isViewPriceEnabled && isStockAndPriceDisplay? <Price title={t('Price')} /> : <div />}
            <Selection title={t('Add')} type={selectionTypes[type]} disabled={isItemSelectionDisabled} />
          </SmartCart>
        )}
      </div>
      {!!modalState && (
        <PDPModal
          contracts={contract}
          fetchPDPData={fetchProductInformation}
          onClose={() => editModalState(false)}
          isViewPriceEnabled={isStockAndPriceDisplay}
          isViewAvailabilityEnabled={isStockAndPriceDisplay}
          isEMEA={isEMEA}
          {...modalState}
        />
      )}
    </Fragment>
  );
}

ProductSetView.defaultProps = {
  hasSomeUnavailableParts: false,
}


ProductSetView.propTypes = {
  attachment: PropTypes.string,
  block: PropTypes.bool,
  bundle: PropTypes.bool,
  contract: PropTypes.arrayOf(PropTypes.object).isRequired,
  description: PropTypes.objectOf(PropTypes.string).isRequired,
  disableQty: PropTypes.bool.isRequired,
  draft: PropTypes.bool,
  groupLabConfig: PropTypes.string,
  hasErrors: PropTypes.bool,
  hasSomeUnavailableParts: PropTypes.bool,
  id: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  lastEditedBy: PropTypes.string.isRequired,
  lastEditedDate: PropTypes.number.isRequired,
  master: PropTypes.bool,
  name: PropTypes.objectOf(PropTypes.string).isRequired,
  needsAttention: PropTypes.bool,
  order: PropTypes.arrayOf(PropTypes.string),
  parents: PropTypes.array,
  shared: PropTypes.bool,
  type: PropTypes.oneOf(['MULTIPLE', 'SINGLE', 'SINGLEWITHNONE', 'MANDATORY']).isRequired
}

const selectionTypes = {
  MANDATORY: 'Radio',
  MULTIPLE: 'Checkbox',
  SINGLE: 'Radio',
  SINGLEWITHNONE: 'Radio'
}
