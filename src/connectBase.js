import React, { Component } from 'react'
import PropTypes from 'prop-types'

const connectBase = ComponentToWrap => options => {
  class ConnectBaseComponent extends Component {
    constructor(props){
      super(props)
      // settings
      //this[`__${ref}`] = 
      this.dataSource = {

      }
      this.state = {
        //data: []
      }
    }
    componentDidMount(){
      const { firebase } = this.context
      this.db = firebase.firestore()
    }
    componentWillReceiveProps(newProps){
      console.log('componentDidMount', this.props, newProps)
      const mappings = options(newProps)
      Object.keys(mappings).forEach( mapping => {
        if(!this.dataSource[mapping]){
          const newMapping = {}
          newMapping.query = this.db.collection(mappings[mapping].collection)
          if(mappings[mapping].where){
            mappings[mapping].where.forEach( where => {
              newMapping.query = newMapping.query.where(where.field, where.op, where.value)
            })
          }
          this.setState({
            [mapping]: {
              isLoading: true,
              data: []
            }
          })
          newMapping.query.onSnapshot( snapshot => {
            const newData = []
            snapshot.forEach( doc => newData.push(doc.data()))
            this.setState({
              [mapping]: {
                isLoading: false,
                data: newData
              }
            })
            console.log(newData)
          })
        }
      })
      
      //console.log('component', options(props))
    }
    render() {
      const { firebase, isAuthing, isAuth, authUser } = this.context
      const additionalProps = {
        firebase,
        isAuthing,
        isAuth,
        authUser
      }
      const computedData = {
        ...this.props,
        ...additionalProps,
        //...options({ ...this.props, ...additionalProps }),
        ...this.state
      }
      return <ComponentToWrap {...computedData} options={options}  />
    }
  }
  ConnectBaseComponent.contextTypes = {
    firebase: PropTypes.object.isRequired,
    isAuth: PropTypes.bool,
    authUser: PropTypes.object,
    isAuthing: PropTypes.bool
  }
  return ConnectBaseComponent
}
export default connectBase