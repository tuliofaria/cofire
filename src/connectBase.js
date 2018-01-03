import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

const connectBase = ComponentToWrap => options => {
  class ConnectBaseComponent extends Component {
    constructor(props){
      super(props)
      // settings
      this.dataSource = {
      }
      this.state = {
      }
    }
    prepareMapping(mappings, mapping){
      const newMapping = {
        settings: mappings[mapping]
      }
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
      newMapping.unsubscribe = newMapping.query.onSnapshot( snapshot => {
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
      this.dataSource[mapping] = newMapping
    }
    prepareFirebase(mappings){
      Object.keys(mappings).forEach( mapping => {
        if(!this.dataSource[mapping]){
          this.prepareMapping(mappings, mapping)
        }else{
          if(!_.isEqual(this.dataSource[mapping].settings, mappings[mapping])){
            // unsubscribe
            try{
              console.log('unsubscribe '+ mapping)
              this.dataSource[mapping].unsubscribe()
            }catch(e){
              console.log('error on unsubscribe', e)
            }
            this.prepareMapping(mappings, mapping)
          }
        }
      })
    }
    componentDidMount(){
      const { firebase } = this.context
      this.db = firebase.firestore()
      console.log('connectBase componentDidMount', this.props)
      const mappings = options(this.props)
      this.prepareFirebase(mappings)
    }
    componentWillReceiveProps(newProps){
      console.log('connectBase componentWillReceiveProps', this.props, newProps)
      const mappings = options(newProps)
      this.prepareFirebase(mappings)
    }
    componentWillUnmount(){
      console.log('will be destroyed', this.dataSource)
      const mappings = options(this.props)
      Object.keys(mappings).forEach( mapping => {
        if(this.dataSource[mapping]){
          try{
            console.log('unsubscribe '+ mapping)
            this.dataSource[mapping].unsubscribe()
          }catch(e){
            console.log('error on unsubscribe', e)
          }
        }
      })
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