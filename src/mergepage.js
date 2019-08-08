import React, { Component } from "react";
import './mergepage.css';
import MergePoster from './mergeposter.js'
import PosterSample from './postersamples'


const ii1 = require('./img/sample1.png')
const ii2 = require('./img/sample2.png')
const ii3 = require('./img/sample3.png')
const ii4 = require('./img/sample4.png')
const ii5 = require('./img/sample5.png')
const ii6 = require('./img/sample6.png')
const ii7 = require('./img/sample7.png')
const ii8 = require('./img/sample8.png')
const ii9 = require('./img/sample9.png')
const ii10 = require('./img/sample10.png')
const white = require('./img/white.png')

class MergePage extends Component {
  
  constructor(props) {
  	super(props)

  	this.state = {
  		leftrightarray: [],
  		parray: [],
  		isGreyClicked: false,
  		xout: false,
  		favorites: []
  	}

  	this.handleCancel = this.handleCancel.bind(this)
 	this.handleGreyClick = this.handleGreyClick.bind(this)
  }

  componentDidMount() {

    this.setState(prevState => ({
      parray: [...prevState.parray, ii1, ii2, ii3, ii4, ii5, ii6, ii7, ii8, ii9, ii10],
    }))

//intially set leftrightarray
    this.setState(prevState => ({
      leftrightarray: [...prevState.leftrightarray, white,white],
    }))

  }

// when you click a poster, set the local states correctly based on your selection
// ie add to the array of posters to be displayed
  handleSelection(chosenposter) {
  	this.setState(prevState => ({
      leftrightarray: [chosenposter, ...prevState.leftrightarray],
    }))
  }

  handleCancel() {
  	this.setState ( { 
  		leftrightarray: []
  		})
  	
  }

  handleGreyClick() {
  	console.log('a grey square was clicked')

  	this.setState(prevState => ({
      isGreyClicked: true
    }))

  	this.setState(prevState => ({
      xout: false
    }))


  }

  handleXout = () =>  {
  	this.setState(prevState => ({
      xout: true
    }))


    this.setState(prevState => ({
      isGreyClicked: false
    }))
  }

  handleFavorite = () => {
  	this.handleXout()

  }

  dynamicallyRenderRows = () => {

  	return (
		 <div className = 'row3'>
			<span className="square4"></span>
			<span className="square4"></span>
			<span className="square4"></span>
			<span className="square4"></span>
			<span className="square4"></span>
			<span className="square4"></span>
		</div>
  	)

  }

  dynamicallyRenderPosters = () => {
  	
  	var indents = []
  	for (var i=0; i<100; i++) {
  		indents.push(<MergePoster importedposter = {this.state.parray[i%10]} handleSelection={this.handleSelection.bind(this)}  />
		)
  	}
  	return (indents)
  }

	render() {
		return(

      <div className = 'lrcontainer2'>

	    <div className = 'leftside2'>
	      	
	      	<div className='buttflexrow'>
		      	<button className='button2' onClick={()=>{this.props.history.push('/secondpage');}} > Back </button>
		      	
		      	<div className='instr'> Click two - see the transition! </div>

		      	<button className='button2' onClick={this.handleCancel}> Cancel </button>
	      	</div>

	      <div className='posterrows'>	

	      	{this.dynamicallyRenderPosters()}
	      

	      </div>

		    <div className='history'>
		    	<div className='historytitle' > Favorites </div>
	
		    </div>

	    </div>


	    <div className = 'rightside3'>


	      <div className = 'conditionalpopupdiv'>
	          {this.state.isGreyClicked && !this.state.xout && 

		            <div className='popup'> 
		            	<button className='cancelbutton' onClick={this.handleXout}> X </button>
		            	
		            	<img src={ii2} className='popupimage'/>  
		            	
		            	<div className='popuprow'>
			            	<button className='favoritebutton' onClick={this.handleFavorite}> Add to Favorites </button>		            	</div> 
		            </div>
	          }
          </div>

	      	<div className = 'row3'>
	      		<PosterSample posterselection={this.state.leftrightarray[0]} />
	      		<span className="square4" onClick={this.handleGreyClick}></span>
	  			<span className="square4"></span>
	  			<span className="square4"></span>
	  			<span className="square4"></span>
	  			<span className="square4"></span>
	      	</div>

	      	<div> 
	      		{this.dynamicallyRenderRows()}
	      		{this.dynamicallyRenderRows()}
	      		{this.dynamicallyRenderRows()}
	      	</div>


      		<div className = 'row3'>
	      		<span className="square4"></span>
	      		<span className="square4"></span>
	  			<span className="square4"></span>
	  			<span className="square4"></span>
	  			<span className="square4"></span>
	  			<PosterSample posterselection={this.state.leftrightarray[1]} />
	     	</div>

	      		

		    
	      </div>

      </div>



		);
	}
}

export default MergePage;