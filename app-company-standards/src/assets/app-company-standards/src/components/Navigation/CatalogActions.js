import React from 'react'
import { Button, Icon } from '@insight/toolkit-react'

import ExportAsFileContainer from '../../containers/ExportAsFileContainer'
import PublishAllContainer from '../../containers/PublishAllContainer'
import FindAndReplaceButtonContainer from '../../containers/FindAndReplaceButtonContainer'

export default function CatalogActions() {
  return (
    <div className="o-grid__item u-text-right c-catalog-actions">
      <div>
        <ExportAsFileContainer />
      </div>
      <div>
        <PublishAllContainer />
      </div>
      {/*<div className="o-grid__item o-grid__item--shrink u-1/1">
        <FindAndReplaceButtonContainer />
      </div>*/}
      {/* <div>
        <Button className="u-padding-tiny u-padding-bot-none" color="link" onClick={() => {}}>
          <span className="u-margin-right-tiny">{'Learn more'}</span>
          <Icon icon="videocam" />
        </Button>
      </div> */}
    </div>
  )
}
