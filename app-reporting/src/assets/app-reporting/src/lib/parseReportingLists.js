
export const STANDARD_REPORTS = 'Standard Reports';
export const SOFTWARE_SUMMARY_REPORTS = 'Software Summary Reports';
export const INVENTORY_REPORTS = 'Inventory Reports';

export const parseReportingLists = (data) => {
  // Merging Softare Summary Reports with Standard Reports
  return {
    [STANDARD_REPORTS]: [
      ...(data?.[STANDARD_REPORTS] || []),
      ...(data?.[SOFTWARE_SUMMARY_REPORTS] || []),
    ],
    [INVENTORY_REPORTS]: [...(data?.[INVENTORY_REPORTS] || [])],
  };
}