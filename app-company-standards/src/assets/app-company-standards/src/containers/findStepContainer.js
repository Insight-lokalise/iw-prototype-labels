import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import FindStep from '../components/Duplicate/FindStep'
import { getDifferentGroupCategories, selector_differentWebgroupCategories } from '../duck'


function mapStateToProps(state) {
    return {
        differentWebgroupCategories: selector_differentWebgroupCategories(state)
    }
  }

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getDifferentGroupCategories }, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FindStep)
