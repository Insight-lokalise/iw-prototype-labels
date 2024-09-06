import groupBy from "lodash/groupBy";
import {
  PLACE_HOLDER,
  PO,
  PO_RELEASE_NUMBER,
  SOLDTO_NAME,
  SOLDTO_NUMBER,
} from "../../../Orders/Search/constants/Constants";

/**
 * Turns a list of items into a list of bundles of items. Items with a bundleId
 * of 0 are not a part of a bundle and are grouped together and then spread out
 * o length-1 arrays.
 *
 * @param {Array<Object>} items the 1-d list of items
 * @return {Array<Array<Object>>} a 2-d list of bundle-grouped items
 */
export function groupByBundle(items) {
  const groups = groupBy(items, (item) => item.bundleId);

  // groups[0] are all of the non-bundle items.
  // We map them into arrays so that every group of items, bundle or not, is an array
  groups["0"] = groups["0"] ? groups["0"].map((item) => [item]) : [];

  const [nonBundleItems, ...bundleGroups] = Object.values(groups);
  return [...bundleGroups, ...nonBundleItems];
}

export function headerText(headerInfo, reference) {
  let headerValue = "";
  if (reference === PO) {
    if (headerInfo[PO] && headerInfo[PO_RELEASE_NUMBER]) {
      headerValue = `${headerInfo[PO]} / ${headerInfo[PO_RELEASE_NUMBER]}`;
    } else if (headerInfo[PO]) {
      headerValue = headerInfo[PO];
    } else if (headerInfo[PO_RELEASE_NUMBER]) {
      headerValue = headerInfo[PO_RELEASE_NUMBER];
    } else {
      headerValue = "";
    }
  } else if (reference === SOLDTO_NAME) {
    headerValue = `${headerInfo[SOLDTO_NAME]} / ${headerInfo[SOLDTO_NUMBER]}`;
  } else if (reference !== PLACE_HOLDER) {
    headerValue = headerInfo[reference];
  }
  return headerValue;
}
