import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import CreateProductGroup from '../components/CreateStandards/CreateProductGroup'
import { createProductGroup } from '../duck'

function mapDispatchToProps(dispatch, { parentId }) {
  return bindActionCreators(
    {
      onSubmit: (formData, messenger) => createProductGroup({ productGroup: formData, parentCategoryId: parentId, messenger }),
    },
    dispatch
  )
}

export default connect(
  null,
  mapDispatchToProps
)(CreateProductGroup)
