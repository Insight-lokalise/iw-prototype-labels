import { t } from '@insight/toolkit-utils';

// TODO - Move to iw-toolkit
/**
 * Translates a string using the LABELS object and
 * Replaces Dynamic keys with values provided in 'replacementObj' object
 * @param  {String} key English text used as a key
 * @param  {Object} replacementObj Object with dynamic keys and values
 * @return {String} Translated text with dynamic keys replaced with values
 * @example
 * When calling the function for French language
 * getLabelWithDynamicKeys('Hello {{firstname}} {{lastname}}', { firstname: 'John', lastname: 'Doe' }) => 'Bonjour John Doe'
 */
export const getLabelWithDynamicKeys = (key, replacementObj = {}) => {
  if (!key) {
    return '';
  }

  const replacementKeys = replacementObj && Object.keys(replacementObj);
  let updatedLabel = t(key);
  replacementKeys?.forEach((replacementKey) => {
    updatedLabel = updatedLabel.replaceAll(`{{${replacementKey}}}`, replacementObj[replacementKey]);
  });
  return updatedLabel;
}