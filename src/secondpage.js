import React, { Component } from "react";
import './secondpage.css';
import Poster from './poster.js'
import PosterSample from './postersamples.js'
// import exportedposters from './App.js'

import {Line, Triangle} from 'react-shapes';


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

class SecondPage extends Component {
  constructor(props) {
  	super(props)

  	this.state = {
  		parray: [],
  		clickedposter: null,
  		historyarray: [],
  		isGreyClicked: false,
  		xout: false,
  		favorites: []
  	}

  	this.handleSelection = this.handleSelection.bind(this)
  }

// sets up the posters that are displayed by putting them in an array
  componentDidMount() {
    this.setState(prevState => ({
      parray: [...prevState.parray, ii1, ii2, ii3, ii4, ii5, ii6, ii7, ii8, ii9, ii10],
    }))

//initially set the historyarray to white spaces
    this.setState(prevState => ({
      historyarray: [...prevState.historyarray, white, white, white, white],
    }))

// theoretically the intial state of the center poster should be the very first one in parray
    this.setState({
      clickedposter: ii1
    })

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
  	for (var i=0; i<100; i++) {
  		indents.push(<Poster importedposter = {this.state.parray[i%10]} handleSelection={this.handleSelection} />)
  	}

  	return (indents)
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
			      	{this.dynamicallyRenderPosters()}
		      	</div>

		    <div className='history'>
		    	<div className='historytitle' > Recently Clicked Designs </div>
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
			      		<span className="square2" onClick={this.handleGreyClick}></span>
			      		<span className="square3" id='null'></span>
			      		<span className="square3" id='null'></span>
			      		<span className="square2" ></span>
			      		<span className="square3" id='null'></span>
			      		<span className="square3" id='null'></span>
			      		<span className="square2"></span>
			      	</div>
			      	

			      	<div className = 'row'>
			      		<span className="square3" id='null'></span>
			      		<span className="square2"></span>			   
			      		<span className="square3" id='null'></span>
			      		<span className="square2"></span>
			      		<span className="square3" id='null'></span>
			      		<span className="square2"></span>
			      		<span className="square3" id='null'></span>
			      	</div>

			      	<div className = 'row'>
			      		<span className="square3" id='null'></span>
			      		<span className="square3" id='null'></span>
			      		<span className="square2"></span>
			      		<span className="square2"></span>
			      		<span className="square2"></span>
			      		<span className="square3" id='null'></span>
			      		<span className="square3" id='null'></span>

			      	</div>

			      	<div className = 'row'>
			      		<span className="square2"></span>
			      		<span className="square2"></span>			      
			      		<span className="square2"></span>
			      		<PosterSample posterselection={this.state.clickedposter} />
			      		<span className="square2"></span>
			      		<span className="square2"></span>
			      		<span className="square2"></span>
			      	</div>

			      	<div className = 'row'>
			      		<span className="square3" id='null'></span>
			      		<span className="square3" id='null'></span>			      	
			      		<span className="square2"></span>
			      		<span className="square2"></span>
			      		<span className="square2"></span>
			      		<span className="square3" id='null'></span>
			      		<span className="square3" id='null'></span>
			      	</div>

			      	<div className = 'row'>
			      		<span className="square3" id='null'></span>
			      		<span className="square2"></span>			      	
			      		<span className="square3" id='null'></span>
			      		<span className="square2"></span>
			      		<span className="square3" id='null'></span>
			      		<span className="square2"></span>
			      		<span className="square3" id='null'></span>
			      	</div>

			      	<div className = 'row'>
			      		<span className="square2"></span>
			      		<span className="square3" id='null'></span>			      	
			      		<span className="square3" id='null'></span>
			      		<span className="square2"></span>
			      		<span className="square3" id='null'></span>
			      		<span className="square3" id='null'></span>
			      		<span className="square2"></span>
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