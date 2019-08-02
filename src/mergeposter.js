import React from 'react';
import {withRouter} from 'react-router-dom'

import './mergeposter.css';



class MergePoster extends React.Component{
  

  constructor(props) {
  	super(props)
    this.state = {
      clickedposter: null
    }

  }
 

  render(){
    return <img alt='postersinmergepage' className = 'poster' src = {this.props.importedposter} onClick = {() => this.props.handleSelection(this.props.importedposter)} />
  }
}


// var base = "https://api.example.com/items"
// var fullPath = base+"?hue="+hueVariable+"&sat="+satVariable



export default withRouter(MergePoster);
