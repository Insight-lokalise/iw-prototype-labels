import * as constants from '../constants'

import exportAsXLS from '../OrderUtilities'

export default function exportResultAsXLS(isCES, exportView, searchObj) {
  return {
    type: constants.EXPORT_RESULT_AS_XLS,
    payload: exportAsXLS(isCES, exportView, searchObj),
  }
}
