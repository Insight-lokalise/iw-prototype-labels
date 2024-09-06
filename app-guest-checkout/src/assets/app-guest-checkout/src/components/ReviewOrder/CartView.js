import React from 'react'
import {useSelector} from "react-redux";
import {selector_lineLevelSessionInfos} from "../../state/slices/selectors/lineLevelSessionInfosSelector";
import {t} from "@insight/toolkit-utils/lib/labels";
import {Panel, ShoppingTable} from "@insight/toolkit-react";
import { selector_shoppingRequestEWRFee } from "../../state/slices/selectors/ShoppingReqeustSelector";

const CartView = ({shoppingRequest}) => {

    const lineLevelSessionInfos = useSelector(selector_lineLevelSessionInfos)
    const hasEWRFee = useSelector(selector_shoppingRequestEWRFee)
    const currentPage = 'review'

    return (
        <div>
            <Panel className="c-review-section">
                <Panel.Title className="c-review-section-title">
                    <Panel.Title.Left>
                        <h2 className="u-h5 u-text-bold u-margin-bot-none">
                            {t('Cart')}
                        </h2>
                    </Panel.Title.Left>
                </Panel.Title>
                <ShoppingTable
                    shoppingRequest={shoppingRequest}
                    lineLevelSessionInfos={lineLevelSessionInfos}
                    currencyCode={shoppingRequest.soldTo.currency}
                    emptyCart={()=>{}}
                    openMiniPDP={()=>{}}
                    readOnly={true}
                    enrollmentParentIds={[]}
                    showEWRFee={hasEWRFee !== 0}
                    currentPage={currentPage}
                />
            </Panel>
        </div>
    )
}

export default CartView;
