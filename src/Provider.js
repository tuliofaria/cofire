import { Component, Children } from 'react'
import PropTypes from 'prop-types'

import firebase from 'firebase'
import 'firebase/firestore'

export function createProvider(storeKey = 'firebase', subKey) {
    
    class Provider extends Component {
        getChildContext() {
          return {
            firebase: this.firebase,
            auth: this.state.auth
          }
        }

        constructor(props, context) {
          super(props, context)
          this.state = {
            auth: {
              isLoading: true
            }
          }
          this.firebase = firebase.initializeApp(this.props.firebase)
          
        }

        componentDidMount(){
          this.firebase.auth().onAuthStateChanged( user => {
            const auth = {
              isLoading: false,
              isAuth: !!(user),
              user
            }
            this.setState({
              auth
            })
          })
        }

        render() {
          return Children.only(this.props.children)
        }
    }

    Provider.propTypes = {
        firebase: PropTypes.object.isRequired,
        children: PropTypes.element.isRequired,
    }
    Provider.childContextTypes = {
        firebase: PropTypes.object.isRequired,
        auth: PropTypes.object,
    }

    return Provider
}

export default createProvider()