import React from 'react'
import SaveLineLevels, {
  linkTypes,
} from './../../../../libs/businessContainerApps/cart/components/lineLevelForm/saveLineLevels'
import { t } from '@insight/toolkit-utils/lib/labels'

export const CartFooter = ({ isReadOnly, isCollapsed }) => {
  return (
    <section>
      {!isReadOnly && !isCollapsed && (
        <div className="row expanded is-collapse-child hide-for-print align-right line-level__button-wrapper">
          <div className="columns small-12 medium-shrink">
            <SaveLineLevels
              linkType={linkTypes.CONTINUE_BUTTON}
              text={t('Continue')}
            />
          </div>
        </div>
      )}
    </section>
  )
}

export default CartFooter
