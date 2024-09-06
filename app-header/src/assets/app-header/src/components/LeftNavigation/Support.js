import {t} from "@insight/toolkit-utils";
import React from "react";
import {Button} from "@insight/toolkit-react";

export default function Support(props) {
  const {account} = props;

  const supportObject = [
    {'title': (account?.supportObj?.accountTeam ? 'accountTeam' : ``), 'href': `/insightweb/salesRep`},
    {'title': (account?.supportObj?.customerDocs ? 'Customer Documents' : ``), 'href': `/insightweb/customerDocs`}
  ];
  return supportObject.map((support) => {
    if (support?.title) {
      return <li><Button {...support}>{t(support.title)}</Button></li>
    }
  });
}
