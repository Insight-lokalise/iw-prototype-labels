import { connect } from 'react-redux'

import DuplicateProductGroup from '../components/Duplicate/DuplicateProductGroup'
import { 
  selector_categories, 
  selector_differentWebgroupCategories,
  selector_isManagerView
} from '../duck'

function mapStateToProps(state) {
  return {
    categories: selector_categories(state),
    differentWebgroupCategories: selector_differentWebgroupCategories(state),
    isManagerView: selector_isManagerView(state)
  }
}

export default connect(mapStateToProps)(DuplicateProductGroup)
