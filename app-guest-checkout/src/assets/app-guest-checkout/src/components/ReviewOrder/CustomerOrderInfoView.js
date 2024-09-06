import React from 'react';
import ReviewSection from "./ReviewSection";
import {t} from "@insight/toolkit-utils/lib/labels";
import {useHistory} from "react-router-dom";
import { ROUTES } from '@constants';
import PropTypes from "prop-types";


const CustomerOrderInfoView = ({ data, title, isEditable } ) => {
    const name = data?.name.split(";")[0].trim() + data?.name.split(";")[1] || ''
    const history = useHistory()
    const editCustomerInfo = (title) => {
        switch(title) {
            case "Order information" :
                history.push({ pathname: ROUTES.ITEM_INFO.url}); break;
            case "Customer information" :
                history.push({ pathname: ROUTES.CUSTOMER_INFO.url});
        }
    }
    const emailLabel = title === 'Order information' ? "Email" : "Business Email";

    return (
        <ReviewSection title={t(title)} isEditable={isEditable} onEdit={()=>editCustomerInfo(title)}>
            <div className="o-grid">
                <div className="o-grid__item u-1/1 u-1/3@tablet u-margin-bot">
                    <div className="u-text-bold">
                        {t('Name')}
                    </div>
                    <div>
                        {name}
                    </div>
                </div>
                <div className="o-grid__item u-1/1 u-1/3@tablet u-margin-bot">
                    <div className="u-text-bold">
                        {t('Phone')}
                    </div>
                    <div>
                        {data.phone}
                    </div>
                </div>
                <div className="o-grid__item u-1/1  u-1/3@tablet u-margin-bot">
                    <div className="u-text-bold">
                        {t(emailLabel)}
                    </div>
                    <div>
                        {data.email}
                    </div>
                </div>
            </div>
        </ReviewSection>
    )
}

export default CustomerOrderInfoView;


CustomerOrderInfoView.prototypes = {
    data: PropTypes.shape({
        name: PropTypes.string,
        phone: PropTypes.string,
        email: PropTypes.string
        }
    ).isRequired,
    title: PropTypes.string.isRequired
}