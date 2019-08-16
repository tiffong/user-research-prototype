import React, { Component, useState } from "react";
import './secondpage.css';
import Poster from './poster.js'
import PosterSample from './postersamples.js'
import axios  from 'axios'
import {getDataCallback,noises,features} from './autobg/generator.js'
import {Line, Triangle} from 'react-shapes';
//reactsvg stuff
import { ReactDOM, render } from 'react-dom'
import $ from 'jquery'


const ii2 = require('./img/sample2.png')

var requestBody = {}
var leftsideposters = []

var clickedID;

var clickedID_1;
var clickedID_2;

class SecondPage extends Component {
  constructor(props) {
  	super(props)

  	this.state = {
  		parray: [],
  		//clickedposter: null,
  		historyarray: [],
  		isGreyClicked: false,
  		xout: false,
  		favorites: [],
  		clickedid: 'poster8',
  		transitionmodeclicked: false,
  		twoclickedposters: [],
  		popupimage: null,
  	}

  	this.handleSelection = this.handleSelection.bind(this)
  }

// sets up the posters that are displayed by putting them in an array
  componentDidMount() {


   this.getDataAxios()
   // console.log('requestbody')
   // console.log(requestBody)

  }


  componentDidUpdate(prevProps, prevState) {
  	console.log('state of transition mode', this.state.transitionmodeclicked)
  	console.log('first of the clicked posters', this.state.twoclickedposters[0])
  	console.log('second of the clicked posters', this.state.twoclickedposters[1])
  	console.log('length of clicked posters array', this.state.twoclickedposters.length)
  	console.log('ID of POPUP that was just clicked: ', this.state.popupimage)
  	console.log('ID of left side poster that was clicked:', this.state.clickedid)



//if the length of posters clicked is greater than 2, then will send a request to load the merge page
  	if(this.state.transitionmodeclicked) {

  		  	 if(this.state.twoclickedposters.length>1 &&  this.state.twoclickedposters.length%2 == 0) {
			  	  clickedID_1 = this.state.twoclickedposters[0].replace(/[^0-9]/ig,"");
				  clickedID_2 = this.state.twoclickedposters[1].replace(/[^0-9]/ig,"");


				  console.log('from x to y',  clickedID_2, clickedID_1)
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
			          	  var clickedArrays= [clickedID_2,clickedID_1] 
			              getDataCallback(response.data, true, true, clickedArrays)
			              
			          })
			          .catch(function (error) {
			              console.log(error);
			          });
			}

			
		


		}



  }	


// once you click a poster, this function handles the selection, 
// setting the clicked poster image to the one that was clicked
// chosenposter is found from within the poster component
//CURRENTLY UNUSED
  handleSelection(chosenposter) {
  	this.setState({
      clickedposter: chosenposter
    });

    this.setState(prevState => ({
      historyarray: [ chosenposter , ...prevState.historyarray],
    }))
  }

//this is used to handle when you click a svg
  handleSVGClick = (e) => {

  	$("#poster"+clickedID).removeClass('posterclicked')
	$("#poster"+clickedID).addClass('poster')


  	//e.persist()
  	// set clicked id to clicked poster
  	var id_of_clicked_poster = e.currentTarget.id
  	
  	//highlight when clicked
  	e.currentTarget.className = 'posterclicked'

  	//TODO: unhighlight the last SVGs that was clicked

  	this.setState(prevState => ({
	      twoclickedposters: [id_of_clicked_poster ,...prevState.twoclickedposters],
	      clickedid: id_of_clicked_poster
	}))

 //using the number ID of the clicked poster, insert DIV
 //if you are in explore mode
  	if(!this.state.transitionmodeclicked)  {
	   	clickedID = id_of_clicked_poster.replace(/[^0-9]/ig,"")
	  	//console.log('ID of the poster you clicked: ', clickedID)
	  	console.log('noises', noises)



		requestBody = {
	        circle: noises[clickedID][30],
	        square: noises[clickedID][31],
	        triangle: noises[clickedID][32],
	        bright_dark: noises[clickedID][33],
	        soft_sharp: noises[clickedID][34],
	        warm_cool: noises[clickedID][35],
	        simple_complex: noises[clickedID][36],
	        disorder_inorder: noises[clickedID][37],
	        high_low: noises[clickedID][38],
	        random_noise:noises[clickedID].slice(0,30)
	    }

	    console.log('request body', requestBody)

		axios.post('http://127.0.0.1:5000/img_augmentation', requestBody)
		  .then(function (response) {
		  		var clickedArrays= [clickedID] 
			  getDataCallback(response.data, true, true, clickedArrays)
		  })
		  .catch(function (error) {
			  console.log(error);
		  }); 		
  	} else {
  		console.log('moved')
  		if(clickedID_1 && clickedID_2){
  			$("#poster"+clickedID_1).removeClass('posterclicked')
			$("#poster"+clickedID_1).addClass('poster')

			$("#poster"+clickedID_2).removeClass('posterclicked')
			$("#poster"+clickedID_2).addClass('poster')

			clickedID_1 = null
			clickedID_2 = null
  		}
 //if you are in transition  mode, you  must  click two
	 //  	 if(this.state.twoclickedposters.length > 1) {


		//   	  var clickedID_1 = this.state.twoclickedposters[0].replace(/[^0-9]/ig,"");
		// 	  var clickedID_2 = this.state.twoclickedposters[1].replace(/[^0-9]/ig,"");



		//       console.log(noises)

		//       requestBody = {
		//           circle_1: noises[clickedID_1][0],
		//           square_1: noises[clickedID_1][1],
		//           triangle_1: noises[clickedID_1][2],
		//           bright_dark_1: noises[clickedID_1][3],
		//           soft_sharp_1: noises[clickedID_1][4],
		//           warm_cool_1: noises[clickedID_1][5],
		//           simple_complex_1: noises[clickedID_1][6],
		//           disorder_inorder_1: noises[clickedID_1][7],
		//           high_low_1: noises[clickedID_1][8],
		//           random_noise_1:noises[clickedID_1].slice(9),

		//           circle_2: noises[clickedID_2][0],
		//           square_2: noises[clickedID_2][1],
		//           triangle_2: noises[clickedID_2][2],
		//           bright_dark_2: noises[clickedID_2][3],
		//           soft_sharp_2: noises[clickedID_2][4],
		//           warm_cool_2: noises[clickedID_2][5],
		//           simple_complex_2: noises[clickedID_2][6],
		//           disorder_inorder_2: noises[clickedID_2][7],
		//           high_low_2: noises[clickedID_2][8],
		//           random_noise_2:noises[clickedID_2].slice(9)
		//       }

		//       console.log(requestBody)


		//       axios.post('http://127.0.0.1:5000/img_comparison', requestBody)
		//           .then(function (response) {
		//               getDataCallback(response.data, true, true)
		//           })
		//           .catch(function (error) {
		//               console.log(error);
		//           });
		// }
  	}

  }

  handleBackButton = () => {

 //if we are NOT in transition mode, then we set transition mode to true, and render the transition m ode
 //if we are in  explore mode, THEN back should take us back to the first page
  	if (!this.state.transitionmodeclicked) {

  		this.props.history.push('/');
 
  	} else if (this.state.transitionmodeclicked) {
  		

  		$("#poster"+clickedID_1).removeClass('posterclicked')
		$("#poster"+clickedID_1).addClass('poster')


  		$("#poster"+clickedID_2).removeClass('posterclicked')
		$("#poster"+clickedID_2).addClass('poster')


  		this.setState(prevState => ({
	      transitionmodeclicked: false
	    })) 
  	}


  }

  handleGreyClick = (e) => {

  	///TODO: make it so the image they clicked shows up larger

  	e.persist() //removes the event from the pool allowing references to the event to be retained asynchronously

  	this.setState(prevState => ({
      isGreyClicked: true,
      xout: false,
      popupimage: e.target
    }))

  }

  handleXout = () =>  {
  	this.setState(prevState => ({
      xout: true,
      isGreyClicked: false
    }))

  }

  handleFavorite = () => {
  	this.handleXout()
  }

//this will allow the image to be rendered larger when clicked
//CURRENTLY NOT FUNCTIONAL
  handlePopupClick = () => {

  	var indents = []
  	indents.push(<div>)
  	indents.push(this.popupimage)
  	indents.push(</div>)

  	return (indents)

  }



//if you click transition mode then the state will be changed to transition mode clicked
  handleTransitionModeClick = () => {
  	
  	$("#poster"+clickedID).removeClass('posterclicked')
	$("#poster"+clickedID).addClass('poster')

  	//if youare in transition mode, then you should have the CANCEL functionality
  	//when you cancel, the squares should turn grey
  	if(this.state.transitionmodeclicked) {
	  	

	  		$("#poster"+clickedID_1).removeClass('posterclicked')
			$("#poster"+clickedID_1).addClass('poster')


	  		$("#poster"+clickedID_2).removeClass('posterclicked')
			$("#poster"+clickedID_2).addClass('poster')

	  	this.setState(prevState => ({
		      twoclickedposters: []
		}))


		$(".square2").empty()

		//somehow  make it so that the squares rerender

//if you are in EXPLORE mode, you go the default setting of first two
  	} else {
	  	
	  	//set transitionmodeclicked to true because you just clicked it
		this.setState(prevState => ({
	      transitionmodeclicked: true,
	      twoclickedposters: []
	    })) 


	 //   	this.setState(prevState => ({
		//       twoclickedposters: ['poster1', ...prevState.twoclickedposters]
		// }))

		// this.setState(prevState => ({
		//       twoclickedposters: ['poster0', ...prevState.twoclickedposters]
		// }))

	   	console.log('lengththt', this.state.twoclickedposters.length)

	  //  if(this.state.twoclickedposters.length >=2) {

	  //  	//get  initial request of the first two
		 //   	var clickedID_1 = this.state.twoclickedposters[0].replace(/[^0-9]/ig,"");
			// var clickedID_2 = this.state.twoclickedposters[1].replace(/[^0-9]/ig,"");

			//       requestBody = {
			//           circle_1: noises[clickedID_1][0],
			//           square_1: noises[clickedID_1][1],
			//           triangle_1: noises[clickedID_1][2],
			//           bright_dark_1: noises[clickedID_1][3],
			//           soft_sharp_1: noises[clickedID_1][4],
			//           warm_cool_1: noises[clickedID_1][5],
			//           simple_complex_1: noises[clickedID_1][6],
			//           disorder_inorder_1: noises[clickedID_1][7],
			//           high_low_1: noises[clickedID_1][8],
			//           random_noise_1:noises[clickedID_1].slice(9),

			//           circle_2: noises[clickedID_2][0],
			//           square_2: noises[clickedID_2][1],
			//           triangle_2: noises[clickedID_2][2],
			//           bright_dark_2: noises[clickedID_2][3],
			//           soft_sharp_2: noises[clickedID_2][4],
			//           warm_cool_2: noises[clickedID_2][5],
			//           simple_complex_2: noises[clickedID_2][6],
			//           disorder_inorder_2: noises[clickedID_2][7],
			//           high_low_2: noises[clickedID_2][8],
			//           random_noise_2:noises[clickedID_2].slice(9)
			//       }
			//       axios.post('http://127.0.0.1:5000/img_comparison', requestBody)
			//           .then(function (response) {
			//               getDataCallback(response.data, true, true)
			//           })
			//           .catch(function (error) {
			//               console.log(error);
			//           });
		 // }


  	}



    //should do something else if it is supposed to be a "CANCEL" button

  }

//posters on the left side will be dynamically rendered
  dynamicallyRenderPosters = () => {
 
  	var indents = []

  	for (var i=0; i<100; i+=4) {

  		var name = 'poster'+i
  		var name2 = 'poster'+(i+1)
  		var name3 = 'poster'+(i+2)
  		var name4 = 'poster'+(i+3)

  		indents.push(
  			<div className='row' key={'poster'+(i+100)}>
	  			<div className='poster' key={name} id={name} onClick={ this.handleSVGClick }  > </div>
	  			<div className='poster' key={name2} id={name2} onClick={ this.handleSVGClick }  > </div>
	  			<div className='poster' key={name3} id={name3} onClick={ this.handleSVGClick }  > </div>
	  			<div className='poster' key={name4} id={name4} onClick={ this.handleSVGClick }  > </div>
  			</div>
  		) 

  	}
//set the variable of posters to indents
  	leftsideposters = indents
  	return (indents)
  }

//dynamically renders the Rows that appaer on the right side
  dynamicallyRenderTransitionRows = () => {

    var indents2 = []

    indents2.push(
      <div className='row'> 
        <div className='square3'> </div>
        <div className='square2' id='square0' ref='tryref'> </div>
        <div className='square2' id='square1'> </div>
        <div className='square2' id='square2'> </div>
        <div className='square2' id='square3'> </div>
      </div>
    )

    for(var i=4; i<20;  i+=5) {
      var name = 'square'+i
      var name2 = 'square'+(i+1)
      var name3 = 'square'+(i+2)
      var name4 = 'square'+(i+3)
      var name5 = 'square'+(i+4)

      indents2.push(
      <div className='row'>
        <div className='square2' id={name}> </div> 
        <div className='square2' id={name2}> </div>
        <div className='square2' id={name3}> </div>
        <div className='square2' id={name4}> </div>   
        <div className='square2' id={name5}> </div> 
      </div>
        )
    }

    indents2.push(
      <div className='row'> 
        <div className='square2' id='square24'> </div>
        <div className='square2' id='square25'> </div>
        <div className='square2' id='square26'> </div>
        <div className='square2' id='square27'> </div>
        <div className='square3'> </div>
      </div>
    )
    return (indents2)
  }
  

  async getDataAxios(){
      
    var hueVar = Number(localStorage.getItem('wc_pg1'))
    var satVar = Number(localStorage.getItem('hl_pg1'))
    var valVar = Number(localStorage.getItem('bd_pg1'))
    var cirVar = Number(localStorage.getItem('circle_pg1'))
    var squareVar = Number(localStorage.getItem('square_pg1'))
    var triVar = Number(localStorage.getItem('tri_pg1'))

   	console.log('variables from first page', hueVar, satVar, valVar, cirVar, squareVar, triVar)

    //TODO: you can send POST request in this way and get the returned CSV data, then you just pass response.data to getDataCallback() and render the images on the page

      requestBody = {
          circle : cirVar,
          square :  squareVar,
          triangle : triVar,
          bright_dark : valVar,
          soft_sharp : 0.5,
          warm_cool : hueVar,
          simple_complex : 0.5,
          disorder_inorder : 0.5,
          high_low : satVar
      }


      axios.post('http://127.0.0.1:5000/img_generator', requestBody)
      .then(function (response) {

          getDataCallback(response.data, true, false)

      })
      .catch(function (error) {
          console.log(error);
      });
  }

  handleRefresh = () => {
  	$(".poster").empty()
  	this.getDataAxios()
  }

  render() {
    return (
      
      <div className = 'lrcontainer2'>


	    <div className = 'leftside2'>
	      	
		      	<div className='buttflexrow'>
			      	<button className='button2' onClick={this.handleBackButton} > Back </button>
			      	<div className='instructions'> {this.state.transitionmodeclicked ? 'Click two to see the transition!' : 'Click a design to explore!'}   </div>
			      	<button className='button2' onClick={this.handleTransitionModeClick}  > {this.state.transitionmodeclicked ? 'Cancel' : 'Transition Mode'} </button>
		      	</div>

		      	<div className='refreshbuttoncontainer'>
		      		<button className='refreshbutton' onClick={this.handleRefresh}> Refresh </button>
		      	</div>

		      	<div className='posterrows'>


					{this.dynamicallyRenderPosters()}


		      	</div>

		    <div className='history'>
		    	<div className='historytitle' > Favorites </div>
	    		<Poster importedposter = {this.state.historyarray[0]} handleSelection={this.handleSelection}  />
	      		<Poster importedposter = {this.state.historyarray[1]} handleSelection={this.handleSelection}  />
	      		<Poster importedposter = {this.state.historyarray[2]} handleSelection={this.handleSelection}  />
	      		<Poster importedposter = {this.state.historyarray[3]} handleSelection={this.handleSelection}  />	
		    </div>

	    </div>

	    { !this.state.transitionmodeclicked &&
			    <div className = 'rightside2'>
			      	<div className='exploreconditional'>

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

				      <div className='sideflex'> 				  
					      <div className='simple'> Simple </div>

					      <div>

					      	<div className = 'topflex'>
						      	<div> Disorder</div> 
						      	<div> Sharp </div> 
						      	<div> Bright </div> 
					      	</div>

					      	<div className = 'row'>
					      		<div className='square2' onClick={this.handleGreyClick} id='square23' ></div>
					      		<div className="square3" id='null'></div>
					      		<div className="square3" id='null'></div>
					      		<div className="square2" onClick={this.handleGreyClick} id='square0' ></div>
					      		<div className="square3" id='null'></div>
					      		<div className="square3" id='null'></div>
					      		<div className="square2" onClick={this.handleGreyClick} id='square6'></div>
					      	</div>
					      	

					      	<div className = 'row'>
					      		<div className="square3" id='null'></div>
					      		<div className="square2" onClick={this.handleGreyClick} id='square22' ></div>			   
					      		<div className="square3" id='null'></div>
					      		<div className="square2" onClick={this.handleGreyClick} id='square1' ></div>
					      		<div className="square3" id='null'></div>
					      		<div className="square2" onClick={this.handleGreyClick} id='square7' ></div>
					      		<div className="square3" id='null'></div>
					      	</div>

					      	<div className = 'row'>
					      		<div className="square3" id='null'></div>
					      		<div className="square3" id='null'></div>
					      		<div className="square2" onClick={this.handleGreyClick} id='square21' ></div>
					      		<div className="square2" onClick={this.handleGreyClick} id='square2' ></div>
					      		<div className="square2" onClick={this.handleGreyClick} id='square8' ></div>
					      		<div className="square3" id='null'></div>
					      		<div className="square3" id='null'></div>

					      	</div>

					      	<div className = 'row'>
					      		<div className="square2" onClick={this.handleGreyClick} id='square17' ></div>
					      		<div className="square2" onClick={this.handleGreyClick} id='square16' ></div>			      
					      		<div className="square2" onClick={this.handleGreyClick} id='square15' ></div>

					      		<div className="square2" onClick={this.handleGreyClick} id='square24' ></div>

					      		<div className="square2" onClick={this.handleGreyClick} id='square14' ></div>
					      		<div className="square2" onClick={this.handleGreyClick} id='square13' ></div>
					      		<div className="square2" onClick={this.handleGreyClick} id='square12' ></div>
					      	</div>

					      	<div className = 'row'>
					      		<div className="square3" id='null'></div>
					      		<div className="square3" id='null'></div>			      	
					      		<div className="square2" onClick={this.handleGreyClick} id='square9' ></div>
					      		<div className="square2" onClick={this.handleGreyClick} id='square3' ></div>
					      		<div className="square2" onClick={this.handleGreyClick} id='square20' ></div>
					      		<div className="square3" id='null'></div>
					      		<div className="square3" id='null'></div>
					      	</div>

					      	<div className = 'row'>
					      		<div className="square3" id='null'></div>
					      		<div className="square2" onClick={this.handleGreyClick} id='square10' ></div>
					      		<div className="square3" id='null'></div>
					      		<div className="square2" onClick={this.handleGreyClick} id='square4' ></div>
					      		<div className="square3" id='null'></div>
					      		<div className="square2" onClick={this.handleGreyClick} id='square19' ></div>
					      		<div className="square3" id='null'></div>
					      	</div>

					      	<div className = 'row'>
					      		<div className="square2" onClick={this.handleGreyClick} id='square11' ></div>
					      		<div className="square3" id='null'></div>			      	
					      		<div className="square3" id='null'></div>
					      		<div className="square2" onClick={this.handleGreyClick} id='square5' ></div>
					      		<div className="square3" id='null'></div>
					      		<div className="square3" id='null'></div>
					      		<div className="square2" onClick={this.handleGreyClick} id='square18' ></div>
					      	</div>			      				      

					      	<div className = 'bottomflex'>
						      	<div> Dark </div> 
						      	<div> Soft </div> 
						      	<div> In order </div> 
					      	</div>


					      </div>

					      <div className='complex'> Complex </div>

				      </div>

				      <div className = 'toplefttriangle'>
				      	<Triangle width={10} height={10} fill={{color:'black'}} />
				      </div>


				      <div className = 'toptriangle'>
				      	<Triangle width={10} height={10} fill={{color:'black'}} />
				      </div>

				      <div className = 'toprighttriangle'>
				      	<Triangle width={10} height={10} fill={{color:'black'}} />
				      </div>		      

				      <div className = 'midlefttriangle'>
				      	<Triangle width={10} height={10} fill={{color:'black'}} />
				      </div>	

				      <div className = 'midrighttriangle'>
				      	<Triangle width={10} height={10} fill={{color:'black'}} />
				      </div>

				      <div className = 'leftbottriangle'>
				      	<Triangle width={10} height={10} fill={{color:'black'}} />
				      </div>	

				      <div className = 'midbottriangle'>
				      	<Triangle width={10} height={10} fill={{color:'black'}} />
				      </div>	

				      <div className = 'rightbottriangle'>
				      	<Triangle width={10} height={10} fill={{color:'black'}} />
				      </div>	

				      <div className='line'>
			      	  	<Line x1={44} x2={960} y1={28} y2={942}  stroke={{color:'black'}} strokeWidth={1} />
			      	  </div>

			      	  <div className='line2'> 
			      	  	<Line x1={40} x2={965} y1={485} y2={485}  stroke={{color:'black'}} strokeWidth={1} />
			      	  </div>

			      	  <div className='line3'> 
			      	  	<Line x1={505} x2={505} y1={22} y2={948}  stroke={{color:'black'}} strokeWidth={1} />
			      	  </div>

			      	  <div className='line4'> 
			      	  	<Line x1={962} x2={45} y1={28} y2={942}  stroke={{color:'black'}} strokeWidth={1} />
			      	  </div>



			      </div>
			    </div> 
			} 


			
			{
				this.state.transitionmodeclicked &&

				<div className='rightsidetransition'>
					<div className='row'> 
				        <div className='square2' id='square28'>  </div>
				        <div className='square2' id='square0'> </div>
				        <div className='square2' id='square1'> </div>
				        <div className='square2' id='square2'> </div>
				        <div className='square2' id='square3'> </div>
				    </div>

				    <div className='row'> 
				       
				        <div className='square2' id='square4'> </div>
				        <div className='square2' id='square5'> </div>
				        <div className='square2' id='square6'> </div>
				        <div className='square2' id='square7'> </div>
				        <div className='square2' id='square8'> </div>
				    </div>

				    <div className='row'> 
				    	<div className='square2' id='square9'> </div>
				        <div className='square2' id='square10'> </div>
				        <div className='square2' id='square11'> </div>
				        <div className='square2' id='square12'> </div>
				        <div className='square2' id='square13'> </div>
				    </div>
				    <div className='row'> 
				    	<div className='square2' id='square14'> </div>
				        <div className='square2' id='square15'> </div>
				        <div className='square2' id='square16'> </div>
				        <div className='square2' id='square17'> </div>
				        <div className='square2' id='square18'> </div>
				    </div>
				    <div className='row'> 
				    	<div className='square2' id='square19'> </div>
				        <div className='square2' id='square20'> </div>
				        <div className='square2' id='square21'> </div>
				        <div className='square2' id='square22'> </div>
				        <div className='square2' id='square23'> </div>
				    </div>			
		    	    
				    <div className='row'> 
				        <div className='square2' id='square24'> </div>
				        <div className='square2' id='square25'> </div>
				        <div className='square2' id='square26'> </div>
				        <div className='square2' id='square27'> </div>
				        <div className='square2' id='square29'>  </div>
				    </div>
				</div>	
			}
      </div>
    );
  }
}
 
export default SecondPage;