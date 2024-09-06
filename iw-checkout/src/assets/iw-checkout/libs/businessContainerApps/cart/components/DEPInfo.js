import React from 'react'
import PropTypes from 'prop-types'
import ROUTES from "../../../routes";
import {Link} from "react-router-dom";

import { t } from '@insight/toolkit-utils/lib/labels';

export default function DEPInfo(props) {
    const { customerId, disableDEPLink, DEPInsightPart, getCart } = props
    const editDEPInfoText = 'Edit DEP information'
    const DEPInfoText = 'DEP information'
    return(
        <div data-private="true" className="row expanded is-collapse-child">
            <div className="column">
                <div className="line-level">
                    <div className="hide-for-print">
                        {disableDEPLink
                            ? <div className="row expanded is-collapse-child hide-for-print">
                                <div className="columns flex-child-auto cart__table-col text-left">
                                    <span className="cart-item__info">
                                        {t(DEPInfoText)}
                                    </span>
                                </div>
                             </div>
                            : <Link
                                to={ROUTES.VIEW_CART}
                                onClick={getCart}
                                className="shopping-cart__header-link">
                                    <span className="cart-item__info">
                                        <span className="ion-compose"></span>
                                        {t(editDEPInfoText)}
                                    </span>
                              </Link>
                        }
                    </div>
                    <section className="line-level__section">
                        <h4 className="line-level__subheading">{t('Device Enrollment Program')}</h4>
                        <div className="row expanded">
                            <div className="columns small-12 medium-4">
                                <label className="form__label--readonly">{t('Insight #:')}
                                    <p>{DEPInsightPart}</p>
                                </label>
                            </div>
                            <div className="columns small-12 medium-4">
                                <label className="form__label--readonly">{t('Organization ID #')}:
                                    <p>{customerId}</p>
                                </label>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

DEPInfo.propTypes = {
    disableDEPLink: PropTypes.bool.isRequired,
    customerId: PropTypes.string.isRequired,
    DEPInsightPart: PropTypes.string.isRequired,
}
