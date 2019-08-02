import React from 'react';
import {withRouter} from 'react-router-dom'

import './poster.css';



class Poster extends React.Component{
  

  constructor(props) {
  	super(props)
    this.state = {
      clickedposter: null
    }

  	this.handlePosterClick = this.handlePosterClick.bind(this)
  }

  handlePosterClick = () => {
  	this.setState({
      clickedposter: this.props.importedposter
    });
  	
   //  console.log(this.props.importedposter)   
   this.props.handleSelection(this.state.clickedposter)

  }
 
  componentDidMount() {
     
  }

  render(){
    return <img alt='secondpageposter' className = 'poster' src = {this.props.importedposter} onClick = {() => this.props.handleSelection(this.props.importedposter)} />
  }
}


export default withRouter(Poster);
