// TODO: lazy imports
import FindAndReplaceModal from './FindAndReplaceModal/FindAndReplaceModal'
import ImageModal from './ImageModal/ImageModal'
import DuplicateModal from './DuplicateModal/DuplicateModal'
import PublishAllModal from './PublishAllModal/PublishAllModal'

export const MODALS_MAP = {
  FIND_AND_REPLACE: FindAndReplaceModal,
  IMAGE_UPLOAD: ImageModal,
  DUPLICATE: DuplicateModal,
  PUBLISH_ALL: PublishAllModal,
}

export const MODALS = Object.keys(MODALS_MAP).reduce((prev, curr) => {
  prev[curr] = curr
  return prev
}, {})

export { default as ModalContext } from './ModalContext'
