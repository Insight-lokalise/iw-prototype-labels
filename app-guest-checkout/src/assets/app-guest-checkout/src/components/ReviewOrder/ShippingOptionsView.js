import React from "react"
import {t} from "@insight/toolkit-utils/lib/labels";
import ReviewSection from "./ReviewSection";
import PropTypes from "prop-types";

const ShippingOptionsView = ( {shippingMethod, notificationEmails, onEdit} ) => {

    const notificationEmailArray = notificationEmails?.split(/;/);

    return (
        <ReviewSection title={t('Shipping options')} isEditable={true} onEdit={onEdit}>
            <div className="o-grid">
                <div className="o-grid__item">
                    <div className="u-text-bold">
                        {t('Shipping method')}
                    </div>
                    <div>
                        {shippingMethod}
                    </div>
                    <div className="o-grid--gutters-large">

                    </div>
                </div>
                <div className="o-grid__item">
                    {(notificationEmailArray && notificationEmailArray.length > 0) && (<>
                        <div className="u-text-bold">
                            {t('Notification email(s)')}
                        </div>
                        <div>
                            {notificationEmailArray.map((email , index)=>
                                <div key={index}>{email}</div>
                            )}
                        </div>
                    </>)}
                </div>
            </div>
        </ReviewSection>
    )

}

export default ShippingOptionsView;

ShippingOptionsView.prototype = {
    shippingMethod: PropTypes.string.isRequired,
    userEmail : PropTypes.string.isRequired,
    additionalNotificationEmails : PropTypes.array,
    onEdit: PropTypes.func.isRequired
}

ShippingOptionsView.defaultProps = {
    additionalNotificationEmails : []
}