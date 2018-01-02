import { Component, Children } from 'react'
import PropTypes from 'prop-types'

import firebase from 'firebase'
import 'firebase/firestore'

export function createProvider(storeKey = 'firebase', subKey) {
    
    class Provider extends Component {
        getChildContext() {
          return {
            firebase: this.firebase,
            isAuthing: this.state.isAuthing,
            isAuth: this.state.isAuth,
            authUser: this.state.authUser
          }
        }

        constructor(props, context) {
          super(props, context)
          this.state = {
            isAuth: false,
            authUser: {},
            isAuthing: true
          }
          this.firebase = firebase.initializeApp(this.props.firebase)
          
          //this[storeKey] = props.firebase;
        }

        componentDidMount(){
          this.firebase.auth().onAuthStateChanged( user => {
            this.setState({
              isAuthing: false,
              isAuth: !!(user),
              authUser: user
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
        isAuth: PropTypes.bool,
        authUser: PropTypes.object,
        isAuthing: PropTypes.bool
    }

    return Provider
}

export default createProvider()