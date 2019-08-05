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
  		parray: []
  	}

  	this.handleCancel = this.handleCancel.bind(this)
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

	render() {
		return(

      <div className = 'lrcontainer2'>

	      <div className = 'leftside2'>
	      	
	      	<div className='buttflexrow'>
		      	<button className='button2' onClick={()=>{this.props.history.push('/secondpage');}} > Back </button>
		      	
		      	<div className='instr'> Click on two - see the transition! </div>

		      	<button className='button2' onClick={this.handleCancel}> Cancel </button>
	      	</div>

	      	
	      	<div className = 'row'>
	      		<MergePoster importedposter = {this.state.parray[0]} handleSelection={this.handleSelection.bind(this)}  />
	      		<MergePoster importedposter = {this.state.parray[1]} handleSelection={this.handleSelection.bind(this)}  />
	      		<MergePoster importedposter = {this.state.parray[2]} handleSelection={this.handleSelection.bind(this)}  />
	      		<MergePoster importedposter = {this.state.parray[3]} handleSelection={this.handleSelection.bind(this)}  />
	      	</div>
	      	<div className = 'row'>
	      		<MergePoster importedposter = {this.state.parray[4]} handleSelection={this.handleSelection.bind(this)}  />
	      		<MergePoster importedposter = {this.state.parray[5]} handleSelection={this.handleSelection.bind(this)}  />
	      		<MergePoster importedposter = {this.state.parray[6]} handleSelection={this.handleSelection.bind(this)}  />
	      		<MergePoster importedposter = {this.state.parray[7]} handleSelection={this.handleSelection.bind(this)}  />
	      	</div>
	      	<div className = 'row'>
	      		<MergePoster importedposter = {this.state.parray[8]} handleSelection={this.handleSelection.bind(this)}  />
	      		<MergePoster importedposter = {this.state.parray[9]} handleSelection={this.handleSelection.bind(this)}  />
	      		<MergePoster importedposter = {this.state.parray[1]} handleSelection={this.handleSelection.bind(this)}  />
	      		<MergePoster importedposter = {this.state.parray[2]} handleSelection={this.handleSelection.bind(this)}  />
	      	</div>
	      	<div className = 'row'>
	      		<MergePoster importedposter = {this.state.parray[3]} handleSelection={this.handleSelection.bind(this)}  />
	      		<MergePoster importedposter = {this.state.parray[4]} handleSelection={this.handleSelection.bind(this)}  />
	      		<MergePoster importedposter = {this.state.parray[5]} handleSelection={this.handleSelection.bind(this)}  />
	      		<MergePoster importedposter = {this.state.parray[6]} handleSelection={this.handleSelection.bind(this)}  />
	      	</div>
	      	<div className = 'row'>
	      		<MergePoster importedposter = {this.state.parray[7]} handleSelection={this.handleSelection.bind(this)}  />
	      		<MergePoster importedposter = {this.state.parray[8]} handleSelection={this.handleSelection.bind(this)}  />
	      		<MergePoster importedposter = {this.state.parray[9]} handleSelection={this.handleSelection.bind(this)}  />
	      		<MergePoster importedposter = {this.state.parray[1]} handleSelection={this.handleSelection.bind(this)}  />
	      	</div>
	      	<div className = 'row'>
	      		<MergePoster importedposter = {this.state.parray[2]} handleSelection={this.handleSelection.bind(this)}  />
	      		<MergePoster importedposter = {this.state.parray[3]} handleSelection={this.handleSelection.bind(this)}  />
	      		<MergePoster importedposter = {this.state.parray[4]} handleSelection={this.handleSelection.bind(this)}  />
	      		<MergePoster importedposter = {this.state.parray[5]} handleSelection={this.handleSelection.bind(this)}  />
	      	</div>	      	
	      	<div className = 'row'>
	      		<MergePoster importedposter = {this.state.parray[6]} handleSelection={this.handleSelection.bind(this)}  />
	      		<MergePoster importedposter = {this.state.parray[7]} handleSelection={this.handleSelection.bind(this)}  />
	      		<MergePoster importedposter = {this.state.parray[8]} handleSelection={this.handleSelection.bind(this)}  />
	      		<MergePoster importedposter = {this.state.parray[9]} handleSelection={this.handleSelection.bind(this)}  />
	      	</div>	 
	      	<div className = 'row'>
	      		<MergePoster importedposter = {this.state.parray[6]} handleSelection={this.handleSelection.bind(this)}  />
	      		<MergePoster importedposter = {this.state.parray[7]} handleSelection={this.handleSelection.bind(this)}  />
	      		<MergePoster importedposter = {this.state.parray[8]} handleSelection={this.handleSelection.bind(this)}  />
	      		<MergePoster importedposter = {this.state.parray[9]} handleSelection={this.handleSelection.bind(this)}  />
	      	</div>	 
	      	<div className = 'row'>
	      		<MergePoster importedposter = {this.state.parray[6]} handleSelection={this.handleSelection.bind(this)}  />
	      		<MergePoster importedposter = {this.state.parray[7]} handleSelection={this.handleSelection.bind(this)}  />
	      		<MergePoster importedposter = {this.state.parray[8]} handleSelection={this.handleSelection.bind(this)}  />
	      		<MergePoster importedposter = {this.state.parray[9]} handleSelection={this.handleSelection.bind(this)}  />
	      	</div>	 


	      </div>


	      <div className = 'rightside3'>

	      	<div className = 'row3'>
	      		<PosterSample posterselection={this.state.leftrightarray[0]} />
	      		<span className="square2"></span>
	  			<span className="square2"></span>
	  			<span className="square2"></span>
	  			<span className="square2"></span>
	  			<span className="square2"></span>
	      		
	      	</div>

	      	<div className = 'row3'>
	      		<span className="square2"></span>
	      		<span className="square2"></span>
	  			<span className="square2"></span>
	  			<span className="square2"></span>
	  			<span className="square2"></span>
	  			<span className="square2"></span>
	      		
	      	</div>
      	<div className = 'row3'>
	      		<span className="square2"></span>
	      		<span className="square2"></span>
	  			<span className="square2"></span>
	  			<span className="square2"></span>
	  			<span className="square2"></span>
	  			<span className="square2"></span>
	      		
	      	</div>
      	<div className = 'row3'>
	      		<span className="square2"></span>
	      		<span className="square2"></span>
	  			<span className="square2"></span>
	  			<span className="square2"></span>
	  			<span className="square2"></span>
	  			<span className="square2"></span>
	      		
	      	</div>
      	<div className = 'row3'>
	      		<span className="square2"></span>
	      		<span className="square2"></span>
	  			<span className="square2"></span>
	  			<span className="square2"></span>
	  			<span className="square2"></span>
	  			<PosterSample posterselection={this.state.leftrightarray[1]} />
	     </div>

	      		

		    
	      </div>

      </div>



		);
	}
}

export default MergePage;