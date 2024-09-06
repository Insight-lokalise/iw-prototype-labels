import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import CreateCategory from '../components/CreateStandards/CreateCategory'
import { createCategory } from '../duck'

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      onSubmit: (formData, messenger) => createCategory({ category: formData, messenger }),
    },
    dispatch
  )
}

export default connect(
  null,
  mapDispatchToProps
)(CreateCategory)
