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



///the old way to handle a poster clic
  handlePosterClick = () => {
  	this.setState({
      clickedposter: this.props.importedposter
    });
  	
   //  console.log(this.props.importedposter)   
   this.props.handleSelection(this.state.clickedposter)

  }

///the new way to handle a poster click



  render(){
    // return <img alt='2pgposter' className = 'poster' src = {this.props.importedposter} onClick = {() => this.props.handleSelection(this.props.importedposter)} />
    return <div alt='2pgposter' className ='poster' id={this.props.id}  onClick = {() => this.props.handleSVGClick()  }  />


  }
}


export default withRouter(Poster);
