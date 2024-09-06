import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { selector_tags } from '../duck'

function mapStateToProps(state) {
  return { tagDictionary: selector_tags(state) }
}

function TagProvider(props) {
  return props.children(props)
}

TagProvider.propTypes = {
  tagDictionary: PropTypes.shape({}).isRequired,
  children: PropTypes.func.isRequired,
}

export default connect(mapStateToProps)(TagProvider)
