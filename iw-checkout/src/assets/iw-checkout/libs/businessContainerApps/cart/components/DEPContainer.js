import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import DEPSection from './DEPSection'
import { getEnrollmentIDs, splitItems, updateTentativeDEPValues, copyDEPValues } from "../actions";
import { selector_enrollmentInfo, selectCartItemsViewByContract } from "../../../Cart/selectors";

function mapStateToProps(state, ownProps) {
    return {
        enrollmentInfoFromState: selectCartItemsViewByContract(state, ownProps.materialIDKey, ownProps.contractID),
        enrollmentInfo: selector_enrollmentInfo(state),
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getEnrollmentIDs,
        splitItems,
        updateTentativeDEPValues,
        copyDEPValues,
    }, dispatch)
}

class DEPView extends Component {
     componentDidMount() {
        this.props.getEnrollmentIDs()
     }
    render() {
         const { enrollmentInfo } = this.props
        return enrollmentInfo ? <DEPSection {...this.props} /> : null
     }
}

export default connect(mapStateToProps, mapDispatchToProps)(DEPView)
