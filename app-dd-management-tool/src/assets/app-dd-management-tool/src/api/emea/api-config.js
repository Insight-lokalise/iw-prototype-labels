export const API_ROOT = window && window.siteServiceBase;
if (typeof API_ROOT === 'undefined') {
  throw new Error('app-dd-management-tool: \'siteServiceBase\' not defined');
}
