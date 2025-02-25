import React, { Component, useState } from "react";
import './secondpage.css';
import Poster from './poster.js'
import PosterSample from './postersamples.js'
import axios  from 'axios'
import {getDataCallback,constructPoster2,getfavorite,noises,features2} from './autobg/generator.js'
import {Line, Triangle, Rectangle} from 'react-shapes';
//reactsvg stuff
import { ReactDOM, render } from 'react-dom'
import $ from 'jquery'
import download from 'downloadjs'


//for user study recording number of clicks
localStorage.setItem('disorderInorderClick_times',0) //top left to right bottom
localStorage.setItem('softSharpClick_times',0) //vertical
localStorage.setItem('brightDarkClick_times',0) //top right to bottom left
localStorage.setItem('simpleComplexClick_times',0) //horizontal
localStorage.setItem('favoritesClick_times',0) //number of favorites saved
localStorage.setItem('transitionClick_times',0) //number of transition pairs chosen
localStorage.setItem('exploreClick_times',0) //number of svgs clicked in explore mode


const loading = require('./img/loading.gif')
const loading2 = require('./img/blueloading.gif')
const loading3 = require('./img/loading3.gif')

var requestBody = {}
var leftsideposters = []

var clickedID;

var clickedID_1;
var clickedID_2;

var favorites_filled = 0; //how many images are within the favorites box
var fileDownload = require('js-file-download');

var start2;
var end2;

var start3;
var end3;

var veryend;

var favoriteList = []
var favoriteID

var hasEmptied = false;



class SecondPage extends Component {
  constructor(props) {
  	super(props)

  	this.state = {
  		parray: [],
  		historyarray: [], // currently not in use
  		isGreyClicked: false, //is a grey square clicked on the right side -- triggerspopup
  		xout: false,//for pop up -- do we need to x out the popup
  		favorites: [],
  		clickedid: 'poster8',//in explore mode, which poster is clicked on left side/
  		transitionmodeclicked: false, //are we in transition  mode?
  		twoclickedposters: [], //the ids of the two clicked posters in transition mode
  		popupimage: null,
  		popupid: '', //the id of the clicked poster on the right side
  		canclickpopup: false,
      isFinished: false,

  	}

  	this.handleGreyClick = this.handleGreyClick.bind(this) //causes currentTarget to be able to be accessed
  }

//initially sets up the posters that are displayed by putting them in an array
  componentDidMount() {
   //set timer here
   start2 = new Date
   console.log(start2)

   $('.littleloading').hide()
   $('.littleloading2').hide()

//so instructions only show up when the user has begun for the very first time
    localStorage.setItem('showinstructions', 'donot')


   this.getDataAxios()
  }


  componentDidUpdate(prevProps, prevState) {
    //printing to see states immediately as they update 
    // console.log('-------------------')
  	console.log('state of transition mode', this.state.transitionmodeclicked)
    console.log('length of clicked posters array: ', this.state.twoclickedposters.length) 
  	console.log('first of the clicked posters: ', this.state.twoclickedposters[0])
  	console.log('second of the clicked posters: ', this.state.twoclickedposters[1])
  	console.log('ID of POPUP that was just clicked: ', this.state.popupimage)
  	console.log('ID of left side poster that was clicked:', this.state.clickedid)
  	console.log('ID of right  side poster that was clicked: ', this.state.popupid)
    console.log('clickedID: ', clickedID, "clicked id1", clickedID_1,  "clickedid2", clickedID_2)
    console.log('--------------------')



    //if(this.state.transitionmodeclicked)

//if the length of posters clicked array is greater than 2 AND is an even number,
// then will send a request to load the merge page with transition svgs
  	if(this.state.transitionmodeclicked) {

           if (this.state.twoclickedposters.length === 1) {
              clickedID_1 = this.state.twoclickedposters[0].replace(/[^0-9]/ig,"");

           } else if(this.state.twoclickedposters.length>1) {
	  	  	    
  		  	 	//update times that the posters were clicked
	  	  	    var times = Number(localStorage.getItem('transitionClick_times'))
				      localStorage.setItem('transitionClick_times',(times+2))

  			  	  clickedID_1 = this.state.twoclickedposters[0].replace(/[^0-9]/ig,"");
  				    clickedID_2 = this.state.twoclickedposters[1].replace(/[^0-9]/ig,"");

				    //console.log('from x to y',  clickedID_2, clickedID_1)
			      //console.log(noises)

			      requestBody = {
			          circle_1: noises[clickedID_1][30],
			          square_1: noises[clickedID_1][31],
			          triangle_1: noises[clickedID_1][32],
			          bright_dark_1: noises[clickedID_1][33],
			          soft_sharp_1: noises[clickedID_1][34],
			          warm_cool_1: noises[clickedID_1][35],
			          simple_complex_1: noises[clickedID_1][36],
			          disorder_inorder_1: noises[clickedID_1][37],
			          high_low_1: noises[clickedID_1][38],
			          random_noise_1:noises[clickedID_1].slice(0,30),

			          circle_2: noises[clickedID_2][30],
			          square_2: noises[clickedID_2][31],
			          triangle_2: noises[clickedID_2][32],
			          bright_dark_2: noises[clickedID_2][33],
			          soft_sharp_2: noises[clickedID_2][34],
			          warm_cool_2: noises[clickedID_2][35],
			          simple_complex_2: noises[clickedID_2][36],
			          disorder_inorder_2: noises[clickedID_2][37],
			          high_low_2: noises[clickedID_2][38],
			          random_noise_2:noises[clickedID_2].slice(0,30)
			      }

			      //console.log(requestBody)
			      axios.post('http://127.0.0.1:5000/img_comparison', requestBody)
			          .then(function (response) {
			          	  
                    $(".littleloading2").hide()

                    var clickedArrays= [clickedID_2,clickedID_1]
                        getDataCallback(response.data, true, true, clickedArrays)
			          })
			          .catch(function (error) {
			              console.log(error);
			          });


                this.setState(prevState => ({
                  twoclickedposters: [],
                }))

                hasEmptied = true   

			}
		}
  }	


//this is used to handle when you click a svg
  handleSVGClick = (e) => {

//now you can click on popups
    this.setState(prevState => ({
      canclickpopup: true,
    }))

//handling loading symbol in both explore and transition modes 
    if(!this.state.transitionmodeclicked) {
      $('.littleloading').show()
    } else if (this.state.transitionmodeclicked && (this.state.twoclickedposters.length+1)%2 === 0) {
      $('.littleloading2').show()
    }

//remove border of last clicked image
  	$("#poster"+clickedID).removeClass('posterclicked')
    $("#poster"+clickedID).addClass('poster')
  	// set clicked id to the poster you have currently clicked clicked poster
    //highlight this current clicked  image 
  	var id_of_clicked_poster = e.currentTarget.id
  	e.currentTarget.className = 'posterclicked'

//add clicked image to front of 'twoclicked posters' and clickedid state
  	this.setState(prevState => ({
      twoclickedposters: [id_of_clicked_poster ,...prevState.twoclickedposters],
      clickedid: id_of_clicked_poster,
	  }))

//using the number ID of the clicked poster, insert DIV
//if you are in explore mode, then senda request
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
                
                var times = Number(localStorage.getItem('exploreClick_times'))
                localStorage.setItem('exploreClick_times',(times+1))

                console.log("features2", features2)

          $(".littleloading").hide()
  		  })
  		  .catch(function (error) {
  			  console.log(error);
  		  }); 		
  	} else { //if you're in transitionmode and you click an SVG, 
  		//still a little confused on what this does



      if(this.state.twoclickedposters.length == 2 || hasEmptied) {
        $("#poster"+clickedID_1).removeClass('posterclicked')
        $("#poster"+clickedID_1).addClass('poster')        
        $("#poster"+clickedID_2).removeClass('posterclicked')
        $("#poster"+clickedID_2).addClass('poster')   
        hasEmptied = false      
      }


  			// clickedID_1 = null
  			// clickedID_2 = null
  	}

  }

  handleBackButton = () => {

 //if we are NOT in transition mode, then we set transition mode to true, and render the transition m ode
 //if we are in  explore mode, THEN back should take us back to the first page
    
    if (!this.state.transitionmodeclicked) {
  		this.props.history.push('/');
      
  	} else if (this.state.transitionmodeclicked) {
  		
      end3 = new Date
      localStorage.setItem('transitionPage_time',(end3-start3) )

    	$("#poster"+clickedID_1).removeClass('posterclicked')
      $("#poster"+clickedID_1).addClass('poster')   
    	$("#poster"+clickedID_2).removeClass('posterclicked')
      $("#poster"+clickedID_2).addClass('poster')

  		this.setState(prevState => ({
	      transitionmodeclicked: false,
        canclickpopup: false
	    })) 
  	}


  }

//what happens when you click a square on the right side -- it enlarges
  handleGreyClick = (e) => {

  	e.persist() //removes the event from the pool allowing references to the event to be retained asynchronously

    if(this.state.canclickpopup) {
      var id_of_clicked_grey = e.currentTarget.id
      var replace = Number(id_of_clicked_grey.replace('square', ''))
      favoriteID = replace

      setTimeout(function () {
          constructPoster2(features2[replace])
      },100)

    }




//recording number of clicks
	// if(this.state.canclickpopup) {
	// }

  	if(replace <= 5) {
	    var times = Number(localStorage.getItem('softSharpClick_times'))
		localStorage.setItem('softSharpClick_times',(times+1))
  	} else if (replace <= 11) {
	    var times = Number(localStorage.getItem('brightDarkClick_times'))
		localStorage.setItem('brightDarkClick_times',(times+1))
  	} else if (replace <= 17) {
	    var times = Number(localStorage.getItem('simpleComplexClick_times'))
		localStorage.setItem('simpleComplexClick_times',(times+1))
  	} else {
	    var times = Number(localStorage.getItem('disorderInorderClick_times'))
		localStorage.setItem('disorderInorderClick_times',(times+1))
  	}

  	this.setState(prevState => ({
      isGreyClicked: true,
      xout: false,
      popupid: id_of_clicked_grey,
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
  	//add 1 to number already in favorites list
  	favorites_filled = favorites_filled + 1
  	if (favorites_filled === 4) {
  		favorites_filled = 0
  	}
	if(favoriteList.length<4){
  		favoriteList.push(features2[favoriteID])
	}
  	else{
        favoriteList.splice(0,1)
		favoriteList.push(features2[favoriteID])
	}

  	getfavorite(favoriteList)
  	//record number of clicks for favorite
	var times = Number(localStorage.getItem('favoritesClick_times'))
	localStorage.setItem('favoritesClick_times',(times+1))


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
  	

//remove last clicked poster if you're coming from explore mode
    if(clickedID) {
     $("#poster"+clickedID).removeClass('posterclicked')
     $("#poster"+clickedID).addClass('poster')
    }

//if you are in transition mode, then you should have the CANCEL functionality
//when you click CANCEL: GETS RID OF borders of poster
  	if(this.state.transitionmodeclicked) {
	  	
//remove border from last two clicked posters
      //remove border of last clicked poster 1
	  	$("#poster"+clickedID_1).removeClass('posterclicked')
      $("#poster"+clickedID_1).addClass('poster')
      //remove border of last clicked poster 2
	  	$("#poster"+clickedID_2).removeClass('posterclicked')
      $("#poster"+clickedID_2).addClass('poster')


	  	this.setState(prevState => ({
		      twoclickedposters: []
		  }))

		  $(".square2").empty()

//if you are in EXPLORE mode --> TRANSITION MODE
  	} else {


      end2 = new Date
      start3 = end2
      console.log('explore time', (end2-start2))
      localStorage.setItem('explore_time',(end2-start2))
	  	
	  	//set transitionmodeclicked to true because you just clicked it
		this.setState(prevState => ({
	      transitionmodeclicked: true,
	      twoclickedposters: [],
        canclickpopup: false,
	    })) 
	   	
  	}

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

      console.log(requestBody)


      axios.post('http://127.0.0.1:5000/img_generator', requestBody)
      .then(function (response) {

          $(".loading").hide()
          
          getDataCallback(response.data, true, false)

      })
      .catch(function (error) {
          console.log(error);
      });
  }

//remove clicked poster border then refresh entire page
  handleRefresh = () => {
  	

    $(".loading").show()


    $("#poster"+clickedID).removeClass('posterclicked')
    $("#poster"+clickedID).addClass('poster')
    

    //if you're in transision mode
    if(this.state.transitionmodeclicked) {
      $("#poster"+clickedID_1).removeClass('posterclicked')
      $("#poster"+clickedID_1).addClass('poster')
      
      $("#poster"+clickedID_2).removeClass('posterclicked')
      $("#poster"+clickedID_2).addClass('poster')
    
    }

    $(".poster").empty()
  	this.getDataAxios()
  }


  handledownload= (e) => {


  	var downloadID = (e.target.id).replace("download","")
    if(favoriteList[downloadID]) { //only download if square has content
       var downloadContent = $("#favorite"+downloadID).children()[0].outerHTML
      console.log(downloadContent)

      download(downloadContent,"sample.svg", "text/html")     
    }
  }

  handleFinished = () => {
    console.log('finished')

    this.setState(prevState => ({
      isFinished: true,
    }))
    var page1_time = Number(localStorage.getItem('page1_time'))
    
    var veryend = new Date //when they finished the application
    var page2_time = veryend - start2

    localStorage.setItem('overallTime', (page1_time + page2_time)) //top left to right bottom
    

  }

  render() {
    return (

    <div className = 'lrcontainer2'>
	    <div className = 'leftside2'>
	      	
		      	<div className='buttflexrow'>
			      	<button className='button2' onClick={this.handleBackButton} > Back  </button>     	
			      	<button className='button2' onClick={this.handleTransitionModeClick}  > {this.state.transitionmodeclicked ? 'Cancel' : 'Transition Mode'} </button>
		      	</div>   

              <div className='loading'>
                <img src={loading}/>
              </div>
		      	<div className='posterrows'>
					     {this.dynamicallyRenderPosters()}
		      	</div>

			<button className='refreshbutton' onClick={this.handleRefresh}>  More ☟ </button>

		    <div className='favorites'>
		    	<div className='favoritestitle' > Favorites </div>

		    	<div className='downloadbuttonsrow'>
		    		<div className='colly'>
				    	<div className='favsquare' id='favorite0'> </div>
				    	<a className='download' id='download0' onClick={this.handledownload}> ⤓ </a>
			    	</div>
		    	
		    		<div className='colly'>
				    	<div className='favsquare' id='favorite1'> </div>
				    	<a className='download' id='download1' onClick={this.handledownload}> ⤓ </a>
			    	</div>

		    	
		    		<div className='colly'>
				    	<div className='favsquare' id='favorite2'> </div>
				    	<a className='download' id='download2' onClick={this.handledownload}> ⤓ </a>
			    	</div>			    
		    	
		    		<div className='colly'>
				    	<div className='favsquare' id='favorite3'> </div>
				    	<a className='download' id='download3' onClick={this.handledownload}> ⤓ </a>
			    	</div>
			
				</div>
				
        

		    </div>w


        {this.state.isFinished &&
          
          <div className='finishedbanner'>
          <div > Thank you for completing the study! </div>
          <a shref='https://www.wjx.cn/jq/44451886.aspx'> Click to Take Survey </a>
          </div>


        }

        <button className = 'finishedbutton' onClick={this.handleFinished}> Finished </button>


	    </div>


	    { !this.state.transitionmodeclicked && 
			    <div className = 'rightside2'>
			      	<div className='exploreconditional'>

				      <div className = 'conditionalpopupdiv'>
				          {this.state.isGreyClicked && !this.state.xout &&

					            <div className='popup' > 
					            	<button className='cancelbutton' onClick={this.handleXout}> X </button>
					            	
					            	<div className='popupimage' id="choosed"> </div>


					            	
					            	<div className='popuprow'>
						            	<button className='favoritebutton' onClick={this.handleFavorite}> Add to Favorites </button>		            	</div> 
					            </div> }
			          </div>

				      <div className='sideflex'> 				  
					      <div className='complex'> Complex </div>

					      <div>

					      	<div className = 'topflex'>
						      	<div> Disorder</div> 
						      	<div className='sharp'> Sharp </div> 
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
					      		
                    <div className='square2 centersquare' onClick={this.handleGreyClick} id='square24' ></div>
                
     
                    <div className='littleloading'>
                       <img src={loading3} />  
                    </div>

                    
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
						      	<div className='soft'> Soft </div> 
						      	<div> In order </div> 
					      	</div>


					      </div>

					      <div className='simple'> Simple </div>

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
			      	  	<Line x1={46} x2={969} y1={22} y2={948}  stroke={{color:'black'}} strokeWidth={1} />
			      	  </div>

			      	  <div className='line2'> 
			      	  	<Line x1={40} x2={970} y1={485} y2={485}  stroke={{color:'black'}} strokeWidth={1} />
			      	  </div>

			      	  <div className='line3'> 
			      	  	<Line x1={507} x2={507} y1={22} y2={948}  stroke={{color:'black'}} strokeWidth={1} />
			      	  </div>

			      	  <div className='line4'> 
			      	  	<Line x1={962} x2={50} y1={30} y2={942}  stroke={{color:'black'}} strokeWidth={1} />
			      	  </div>



			      </div>
			    </div> 
			} 
			{
				this.state.transitionmodeclicked &&
				<div className='rightsidetransition'>

			      <div className = 'conditionalpopupdiv'>
			          {this.state.isGreyClicked && !this.state.xout && 

				            <div className='popup' > 
				            	<button className='cancelbutton' onClick={this.handleXout}> X </button>
				            	
				            	<div className='popupimage' id="choosed"> </div>



				            	<div className='popuprow'>
					            	<button className='favoritebutton' onClick={this.handleFavorite}> Add to Favorites </button>		            	</div> 
				            </div> }
		          </div>


					<div className='row'> 
				        <div className='square2 sidesquare' id='square29' onClick={this.handleGreyClick}>  </div>
				        <div className='square2' id='square0' onClick={this.handleGreyClick}> </div>
				        <div className='square2' id='square1' onClick={this.handleGreyClick}> </div>
				        <div className='square2' id='square2' onClick={this.handleGreyClick}> </div>
				        <div className='square2' id='square3' onClick={this.handleGreyClick}> </div>
				    </div>

				    <div className='row'> 
				       
				        <div className='square2' id='square4' onClick={this.handleGreyClick}> </div>
				        <div className='square2' id='square5' onClick={this.handleGreyClick}> </div>
				        <div className='square2' id='square6' onClick={this.handleGreyClick}> </div>
				        <div className='square2' id='square7' onClick={this.handleGreyClick}> </div>
				        <div className='square2' id='square8' onClick={this.handleGreyClick}> </div>
				    </div>

				    <div className='row'> 
				    	<div className='square2' id='square9' onClick={this.handleGreyClick}> </div>
				        <div className='square2' id='square10' onClick={this.handleGreyClick}> </div>
				        <div className='square2' id='square11' onClick={this.handleGreyClick}> </div>
				        <div className='square2' id='square12' onClick={this.handleGreyClick}> </div>
				        <div className='square2' id='square13' onClick={this.handleGreyClick}> </div>
				    </div>
				    <div className='row'> 
				    	  <div className='square2' id='square14' onClick={this.handleGreyClick}> </div>
				        <div className='square2' id='square15' onClick={this.handleGreyClick}> </div>
				        <div className='square2' id='square16' onClick={this.handleGreyClick}> </div>

                     
                  <div className='littleloading2'>
                    <img src={loading3}/>
                  </div>
                    

				        <div className='square2' id='square17' onClick={this.handleGreyClick}> </div>
				        <div className='square2' id='square18' onClick={this.handleGreyClick}> </div>
				    </div>
				    <div className='row'> 
				    	<div className='square2' id='square19' onClick={this.handleGreyClick}> </div>
				        <div className='square2' id='square20' onClick={this.handleGreyClick}> </div>
				        <div className='square2' id='square21' onClick={this.handleGreyClick}> </div>
				        <div className='square2' id='square22' onClick={this.handleGreyClick}> </div>
				        <div className='square2' id='square23' onClick={this.handleGreyClick}> </div>
				    </div>			
		    	    
				    <div className='row'> 
				        <div className='square2' id='square24' onClick={this.handleGreyClick}> </div>
				        <div className='square2' id='square25' onClick={this.handleGreyClick}> </div>
				        <div className='square2' id='square26' onClick={this.handleGreyClick}> </div>
				        <div className='square2' id='square27' onClick={this.handleGreyClick}> </div>
				        <div className='square2 sidesquare' id='square28' onClick={this.handleGreyClick}>  </div>
				    </div>
				</div>	
			}

      </div>
    );
  }
}
 
export default SecondPage;