import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import { getInObject } from "@insight/toolkit-utils";

import ItemBody from "./ItemBody";
import ContractHeader from "./ContractHeader";
import BundleItem from "./BundleItem";
import ItemTracking from "./ItemTracking/ItemTracking";
import { getBundleTrackingInfo } from "./ItemTracking/helpers/itemTracking";

const CONTRACT = "contract";
const SINGLE_ITEM = "item";
const BUNDLE = "bundle";

export default function CardType({
  cmsServer,
  currencyCode,
  currentPart,
  hasInvoicingEnabled,
  isAPAC,
  isEMEA,
  isContract,
  isLoggedIn,
  itemType,
  orderNumber,
  getDEPInfo,
  salesAreaId,
}) {
  const [isCES, setIsCES] = useState(null);
  useEffect(() => {
    const userInfo = getInObject(window, ["Insight", "userInformation"], {});
    setIsCES(isLoggedIn ? userInfo.isCES : false);
  }, []);
  const itemDataProps =
    (itemType === "bundle" && getBundleTrackingInfo(currentPart)) ||
    (itemType === "item" && currentPart.data);
  const lineItemTrackingInfoList = itemDataProps.lineItemTrackingInfo || [];
  const hasTrackingInfo = !!lineItemTrackingInfoList.length;
  switch (itemType) {
    case CONTRACT:
      return (
        <div>
          {currentPart.name && <ContractHeader item={currentPart} />}
          {currentPart.data.map((contractItem) =>
            CardType({
              itemType: contractItem.type,
              currentPart: contractItem,
              currencyCode,
              isContract: true,
              isLoggedIn,
              getDEPInfo,
              isAPAC,
              isEMEA,
              orderNumber,
              hasInvoicingEnabled,
              cmsServer,
              salesAreaId,
            })
          )}
        </div>
      );
    case SINGLE_ITEM:
      //render only parent items without enrollment prop (only child items have enrollment prop)
      return !currentPart.data.enrollment ? (
        <div className={cn("card-type", { "card-type--contract": isContract })}>
          <ItemBody
            currencyCode={currencyCode}
            hasInvoicingEnabled={hasInvoicingEnabled}
            isContract={isContract}
            isLoggedIn={isLoggedIn}
            item={currentPart}
            orderNumber={orderNumber}
            getDEPInfo={getDEPInfo}
            isCES={isCES}
          />
          {hasTrackingInfo && !itemDataProps.materialInfo.nonShipabble && (
            <ItemTracking
              cmsServer={cmsServer}
              isAPAC={isAPAC}
              isEMEA={isEMEA}
              isLoggedIn={isLoggedIn}
              lineItemTrackingInfoList={lineItemTrackingInfoList}
              shippingStatus={currentPart.data.shippingStatus}
              orderNumber={orderNumber}
              salesAreaId={salesAreaId}
            />
          )}
        </div>
      ) : null;
    case BUNDLE:
      return (
        <div className={cn("card-type", { "card-type--contract": isContract })}>
          <BundleItem
            currencyCode={currencyCode}
            bundle={currentPart}
            hasInvoicingEnabled={hasInvoicingEnabled}
            isContract={isContract}
            isLoggedIn={isLoggedIn}
            orderNumber={orderNumber}
            getDEPInfo={getDEPInfo}
            isCES={isCES}
          />
          {hasTrackingInfo && !itemDataProps.nonShipabble && (
            <ItemTracking
              cmsServer={cmsServer}
              isAPAC={isAPAC}
              isEMEA={isEMEA}
              isLoggedIn={isLoggedIn}
              itemType={itemType}
              lineItemTrackingInfoList={lineItemTrackingInfoList}
              orderNumber={orderNumber}
              salesAreaId={salesAreaId}
            />
          )}
        </div>
      );

    default:
      return null;
  }
}

CardType.propTypes = {
  cmsServer: PropTypes.string.isRequired,
  currencyCode: PropTypes.string.isRequired,
  currentPart: PropTypes.shape({
    data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    id: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
  hasInvoicingEnabled: PropTypes.bool.isRequired,
  isAPAC: PropTypes.bool.isRequired,
  isEMEA: PropTypes.bool.isRequired,
  isContract: PropTypes.bool,
  isLoggedIn: PropTypes.bool.isRequired,
  itemType: PropTypes.string.isRequired,
  orderNumber: PropTypes.number.isRequired,
  salesAreaId: PropTypes.number.isRequired,
  getDEPInfo: PropTypes.func.isRequired,
};

CardType.defaultProps = {
  isContract: false,
};
