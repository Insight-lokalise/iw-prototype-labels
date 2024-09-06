/**
 * Determine whether the cloud management link should be displayed. It should
 * be displayed either if ET is enabled or it's an Odin client, AND could
 * management is not explicitly disabled at the company level.
 */
export default function getHasCloudManagement() {
  const {
    isCompanyCloudManagementHidden,
    enabled,
    isEtEnabled,
    isOdinClient,
  } = window.cloudConfiguration || {}

  return Promise.resolve(enabled && !isCompanyCloudManagementHidden && (isEtEnabled || isOdinClient))
}
