import { connect } from 'react-redux'
import App from '../components/App'

/** Use this function to grab entities out of state that you need.
    Say your state looks like this..
    state = { 
		users: { ... },
		items: { ... },
		messages: { ... }
    }

    To grab all of the users, simply pull it from state in the function below.
    const mapStateToProps = state => ({
		users: state.users
    })
    Then you can access users in your components props with this.props.users
*/
const mapStateToProps = state => ({})

/** Actions work the same way. If your component needs a specific action import the action
    In this file, and then pass it to dispatch so Redux is aware of it. Then you can call it from
    your component

    import { myAction } from './some/file/path'
    const mapDispatchToProps = dispatch => ({
		callMyAction: (args) => dispatch(myAction(args))
    })

  	Then in your component you can call this.props.callMyActions(args)
*/

const mapDispatchToProps = dispatch => ({}) 

// Finally, let Redux know about your container by connecting it to the store instance
// export default connect(mapStateToProps, mapDispatchToProps)(YourComponent)
export default connect(mapStateToProps, mapDispatchToProps)(App)
