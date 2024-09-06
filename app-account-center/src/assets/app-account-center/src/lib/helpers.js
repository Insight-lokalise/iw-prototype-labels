import { getCurrentLocale } from "@insight/toolkit-utils";
import { INSIGHT_CURRENT_LOCALE_COOKIE_NAME } from "@constants";

export const getCountryCode = () => {
  const currentLocale = getCurrentLocale(INSIGHT_CURRENT_LOCALE_COOKIE_NAME);
  const countryCode = currentLocale.split("_")[1].toUpperCase();
  return countryCode;
};

export function checkExpired(exMonth, exYear) {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  return (
    Number(currentYear) > Number(exYear) ||
    (Number(currentYear) === Number(exYear) &&
      Number(currentMonth) > Number(exMonth))
  );
}

export const filterAccounts = ({ filterString, accounts, filterProps }) =>
  accounts.reduce((acc, account) => {
    let matchFound = false;
    const { address } = account;
    if (!filterString) {
      matchFound = true;
    } else {
      // look for the filterString in account object props
      for (let i = 0; i < filterProps.length; i++) {
        if (
          account[filterProps[i]] &&
          account[filterProps[i]]
            .toString()
            .toLowerCase()
            .indexOf(filterString.toLowerCase()) > -1
        ) {
          matchFound = true;
          break;
        } else if (
          address[filterProps[i]] &&
          address[filterProps[i]]
            .toString()
            .toLowerCase()
            .indexOf(filterString.toLowerCase()) > -1
        ) {
          matchFound = true;
          break;
        }
      }
    }

    return matchFound ? acc.concat(account) : acc;
  }, []);

 export  const  isValidObjectList = (list)=>{
    return list.every(item=>typeof item ==='object' && item!== null && item.hasOwnProperty('id'))
  }