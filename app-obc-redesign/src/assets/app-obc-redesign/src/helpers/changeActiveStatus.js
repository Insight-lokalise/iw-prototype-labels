/* Used upon determining whether the first tab is shown as active upon page load */
export default function changeActiveStatus(match, location, tab) {
  return location.pathname === "/" ||
    (tab === "occurences" && location.pathname === "/occurences") ||
    (tab === "contracts" && location.pathname === "/contracts");
}
