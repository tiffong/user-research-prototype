import React, { Component } from "react";
import './mergepage.css';
import MergePoster from './mergeposter.js'
import PosterSample from './postersamples'

import axios  from 'axios'
import {getDataCallback,noises} from './autobg/generator.js'



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

var requestBody = {}


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

	//TODO: you need to get the info of two selected posters and pass the info to the path /img_comparison

      //using the ID of the clicked poster, insert DIV
      // var clickedID = this.state.clickedid.replace(/[^0-9]/ig,"")
      // console.log(clickedID)

	  var clickedID_1 = 1;
	  var clickedID_2 = 2;

      console.log(noises)

      requestBody = {
          circle_1: noises[clickedID_1][0],
          square_1: noises[clickedID_1][1],
          triangle_1: noises[clickedID_1][2],
          bright_dark_1: noises[clickedID_1][3],
          soft_sharp_1: noises[clickedID_1][4],
          warm_cool_1: noises[clickedID_1][5],
          simple_complex_1: noises[clickedID_1][6],
          disorder_inorder_1: noises[clickedID_1][7],
          high_low_1: noises[clickedID_1][8],
          random_noise_1:noises[clickedID_1].slice(9),

          circle_2: noises[clickedID_2][0],
          square_2: noises[clickedID_2][1],
          triangle_2: noises[clickedID_2][2],
          bright_dark_2: noises[clickedID_2][3],
          soft_sharp_2: noises[clickedID_2][4],
          warm_cool_2: noises[clickedID_2][5],
          simple_complex_2: noises[clickedID_2][6],
          disorder_inorder_2: noises[clickedID_2][7],
          high_low_2: noises[clickedID_2][8],
          random_noise_2:noises[clickedID_2].slice(9)
      }

      console.log(requestBody)


      axios.post('http://127.0.0.1:5000/img_comparison', requestBody)
          .then(function (response) {
              getDataCallback(response.data, true, true)
          })
          .catch(function (error) {
              console.log(error);
          });

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