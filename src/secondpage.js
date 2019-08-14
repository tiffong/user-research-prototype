import React, { Component } from "react";
import './secondpage.css';
import Poster from './poster.js'
import PosterSample from './postersamples.js'
import axios  from 'axios'
import {getDataCallback} from './autobg/generator.js'
import {Line, Triangle} from 'react-shapes';
//reactsvg stuff
import { render } from 'react-dom'
import ReactSVG from 'react-svg'

// assume these real posters that have been imported imported from the code
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
var svg_ex = <svg width="40" height="40" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <rect x="5" y="5" width="30" height="30" stroke="black" fill="transparent" stroke-width="5" />
</svg>


var requestBody = {}

class SecondPage extends Component {
  constructor(props) {
  	super(props)

  	this.state = {
  		parray: [],
  		clickedposter: null,
  		historyarray: [],
  		isGreyClicked: false,
  		xout: false,
  		favorites: [],
  		clickedid: 'poster8'
  	}

  	this.handleSelection = this.handleSelection.bind(this)
  }

// sets up the posters that are displayed by putting them in an array
  componentDidMount() {
    this.setState(prevState => ({
      parray: [...prevState.parray, svg_ex],
    }))

//initially set the historyarray to white spaces
    this.setState(prevState => ({
      historyarray: [...prevState.historyarray, white, white, white, white],
    }))

// theoretically the intial state of the center poster should be the very first one in parray
    this.setState({
      clickedposter: ii1
    })

   this.getDataAxios()
   console.log('requestbody')
   console.log(requestBody)

  }


  componentDidUpdate(prevProps, prevState) {

  }


// once you click a poster, this function handles the selection, 
// setting the clicked poster image to the one that was clicked
// chosenposter is found from within the poster component
  handleSelection(chosenposter) {
  	this.setState({
      clickedposter: chosenposter
    });

    this.setState(prevState => ({
      historyarray: [ chosenposter , ...prevState.historyarray],
    }))
  }

//this is used to handle when you click a svg, of class <Poster>
  handleSVGClick = () => {


  	//using the ID of the clicked poster, insert DIV
  	console.log('Clicked an SVG')

  }

  handleGreyClick =() => {
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

  dynamicallyRenderPosters = () => {
  	
  	var indents = []

  	for (var i=0; i<10; i++) {

  		var name = 'poster'+i
  		// indents.push(<Poster id={name} handleSelection={this.handleSelection} />)
  		indents.push(<Poster id={name}  />)

  	}

  	return (indents)
  }  

  async getDataAxios(){
      
    var hueVar = 0
    var satVar = 0
    var valVar = 0
    var cirVar = 0
    var squareVar = 0
    var triVar = 0

    //TODO: you can send POST request in this way and get the returned CSV data, then you just pass response.data to getDataCallback() and render the images on the page

      requestBody = {
          circle : 0.3,
          square : 0.3,
          triangle : 0.3,
          bright_dark : 0.5,
          soft_sharp : 0.5,
          warm_cool : 0.5,
          simple_complex : 0.5,
          disorder_inorder : 0.5,
          high_low : 0.5
      }


      axios.post('http://127.0.0.1:5000/sample_generator', requestBody)
      .then(function (response) {

          getDataCallback(response.data)

      })
      .catch(function (error) {
          console.log(error);
      });
  }

  render() {
    return (
      
      <div className = 'lrcontainer2'>


	     <div className = 'leftside2'>
	      	
		      	<div className='buttflexrow'>
			      	<button className='button2' onClick={()=>{this.props.history.push('/');}} > Back </button>
			      	<div className='instructions'> Click a design to explore!  </div>
			      	<button className='button2' onClick={()=> {this.props.history.push('/mergepage');}}  >  Transition Mode </button>
		      	</div>


		      	<div className='posterrows'>


				     <div className='row'>
				      	<Poster id='poster0' handleSVGClick={this.handleSVGClick } />
				      	<Poster id='poster1' handleSVGClick={this.handleSVGClick } />
				      	<Poster id='poster2' handleSVGClick={this.handleSVGClick } />
				      	<Poster id='poster3' handleSVGClick={this.handleSVGClick } />
				     </div>

				     <div className='row'>
				      	<Poster id='poster4' handleSVGClick={this.handleSVGClick } />
				      	<Poster id='poster5' handleSVGClick={this.handleSVGClick } />
				      	<Poster id='poster6' handleSVGClick={this.handleSVGClick } />
				      	<Poster id='poster7' handleSVGClick={this.handleSVGClick } />
				     </div>


		      	</div>

		    <div className='history'>
		    	<div className='historytitle' > Favorites </div>
	    		<Poster importedposter = {this.state.historyarray[0]} handleSelection={this.handleSelection}  />
	      		<Poster importedposter = {this.state.historyarray[1]} handleSelection={this.handleSelection}  />
	      		<Poster importedposter = {this.state.historyarray[2]} handleSelection={this.handleSelection}  />
	      		<Poster importedposter = {this.state.historyarray[3]} handleSelection={this.handleSelection}  />	
		    </div>

	     </div>


	      <div className = 'rightside2'>

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
			      		<div className="square2" onClick={this.handleGreyClick} id='square0' ></div>
			      		<div className="square3" id='null'></div>
			      		<div className="square3" id='null'></div>
			      		<div className="square2" onClick={this.handleGreyClick} id='square1' ></div>
			      		<div className="square3" id='null'></div>
			      		<div className="square3" id='null'></div>
			      		<div className="square2  onClick={this.handleGreyClick} id='square2' "></div>
			      	</div>
			      	

			      	<div className = 'row'>
			      		<div className="square3" id='null'></div>
			      		<div className="square2" onClick={this.handleGreyClick} id='square3' ></div>			   
			      		<div className="square3" id='null'></div>
			      		<div className="square2" onClick={this.handleGreyClick} id='square4' ></div>
			      		<div className="square3" id='null'></div>
			      		<div className="square2" onClick={this.handleGreyClick} id='square5' ></div>
			      		<div className="square3" id='null'></div>
			      	</div>

			      	<div className = 'row'>
			      		<div className="square3" id='null'></div>
			      		<div className="square3" id='null'></div>
			      		<div className="square2" onClick={this.handleGreyClick} id='square6' ></div>
			      		<div className="square2" onClick={this.handleGreyClick} id='square7' ></div>
			      		<div className="square2" onClick={this.handleGreyClick} id='square8' ></div>
			      		<div className="square3" id='null'></div>
			      		<div className="square3" id='null'></div>

			      	</div>

			      	<div className = 'row'>
			      		<div className="square2" onClick={this.handleGreyClick} id='square9' ></div>
			      		<div className="square2" onClick={this.handleGreyClick} id='square10' ></div>			      
			      		<div className="square2" onClick={this.handleGreyClick} id='square11' ></div>

			      		<Poster id={this.state.clickedid} id='square12' />

			      		<div className="square2" onClick={this.handleGreyClick} id='square12' ></div>
			      		<div className="square2" onClick={this.handleGreyClick} id='square13' ></div>
			      		<div className="square2" onClick={this.handleGreyClick} id='square14' ></div>
			      	</div>

			      	<div className = 'row'>
			      		<div className="square3" id='null'></div>
			      		<div className="square3" id='null'></div>			      	
			      		<div className="square2" onClick={this.handleGreyClick} id='square15' ></div>
			      		<div className="square2" onClick={this.handleGreyClick} id='square16' ></div>
			      		<div className="square2" onClick={this.handleGreyClick} id='square17' ></div>
			      		<div className="square3" id='null'></div>
			      		<div className="square3" id='null'></div>
			      	</div>

			      	<div className = 'row'>
			      		<div className="square3" id='null'></div>
			      		<div className="square2" onClick={this.handleGreyClick} id='square18' ></div>			      	
			      		<div className="square3" id='null'></div>
			      		<div className="square2" onClick={this.handleGreyClick} id='square19' ></div>
			      		<div className="square3" id='null'></div>
			      		<div className="square2" onClick={this.handleGreyClick} id='square20' ></div>
			      		<div className="square3" id='null'></div>
			      	</div>

			      	<div className = 'row'>
			      		<div className="square2" onClick={this.handleGreyClick} id='square21' ></div>
			      		<div className="square3" id='null'></div>			      	
			      		<div className="square3" id='null'></div>
			      		<div className="square2" onClick={this.handleGreyClick} id='square22' ></div>
			      		<div className="square3" id='null'></div>
			      		<div className="square3" id='null'></div>
			      		<div className="square2" onClick={this.handleGreyClick} id='square23' ></div>
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


    );
  }
}
 
export default SecondPage;