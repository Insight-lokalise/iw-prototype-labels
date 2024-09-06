import React from "react";

import {t} from "@insight/toolkit-utils";
import {Button} from "@insight/toolkit-react";

export default function Order(props) {
  const {account, isEMEA, locale} = props;
  const ordersObject = [
    {'title': (account?.ordersObj?.quoteHistory ? 'quoteHistory' : ``), 'href': `/insightweb/quoteHistory`},
    {'title': (account?.ordersObj?.requisitionHistory ? 'reqHistory' : ``), 'href': `/insightweb/ar/reqHistory`},
    {
      'title': (account?.ordersObj?.newRequest ? 'createNewRequest' : ``),
      'href': `/insightweb/newRequest?client=${account?.ordersObj?.newRequest}`
    },
    {'title': (account?.ordersObj?.orderTracking ? 'orderHistory' : ``), 'href': `/insightweb/orderHistory`},
    {'title': (account?.ordersObj?.invoiceHistory ? 'invoiceHistory' : ``), 'href': `/insightweb/invoiceHistory`},
    {
      'title': (account?.ordersObj?.rma ? 'rmaRequest' : ``),
      'href': (isEMEA ? `/${locale}/knowledge-base/policies/trading-terms-and-conditions.html` : `/${locale}/help/return-policy.html`)
    }
  ];

  return ordersObject.map((orders) => {
    if (orders?.title) {
      return <li><Button {...orders}>{t(orders.title)}</Button></li>
    }
  });
}
