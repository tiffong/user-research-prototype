import React from 'react';
import './App.css';
import PosterSamples from './postersamples.js'
import {getDataCallback} from './autobg/generator.js'
import axios  from 'axios'
//google analytics
import ReactGA from 'react-ga';
import moment from 'moment' //for timing user

var requestBody = {}
var start1;
var end1;

//for user study -- getting # of clicks
localStorage.setItem('hueClick_times',0)
localStorage.setItem('satClick_times',0)
localStorage.setItem('valClick_times',0)
localStorage.setItem('shapeClick_times',0)


//timer per page attempt
// ReactGA.initialize('UA-145837746-1');
// ReactGA.pageview('/');


class App extends React.Component{
   
  constructor(props) {
    super(props);
    // this.handleCoolClick = this.handleCoolClick.bind(this)
    this.handleCoolWarmClick = this.handleCoolWarmClick.bind(this)
    this.handleWarmClick = this.handleWarmClick.bind(this)

    this.handleHighClick = this.handleHighClick.bind(this)
    this.handleHighLowClick = this.handleHighLowClick.bind(this)
    this.handleLowClick = this.handleLowClick.bind(this)

    this.handleBrightClick = this.handleBrightClick.bind(this)
    this.handleBrightDarkClick = this.handleBrightDarkClick.bind(this)
    this.handleDarkClick = this.handleDarkClick.bind(this)

    this.handleGenerate = this.handleGenerate.bind(this)

    this.state = {
      CoolClicked: false,
      CoolWarmClicked: true,
      WarmClicked: false,
      
      HighClicked: false,
      HighLowClicked: true,
      LowClicked: false,

      BrightClicked: false,
      BrightDarkClicked: true,
      DarkClicked: false,

      circle: false,
      square: false,
      triangle: false,

      posters: [],

      hasBegun: false,

    }

  }

  componentDidMount() {
  
    this.getDataAxios()
  } 

  componentDidUpdate(prevProps, prevState) {

    this.getDataAxios()

  }


  async getDataAxios(){
      
    var hueVar = 0
    var satVar = 0
    var valVar = 0
    var cirVar = 0.33
    var squareVar = 0.33
    var triVar = 0.33


    if(this.state.CoolClicked) {
      hueVar = 0.3
    } else if (this.state.CoolWarmClicked) {
      hueVar = 0.5
    } else {
      hueVar = 0.7
    }

    if(this.state.HighClicked) {
      satVar = 0.3
    } else if (this.state.HighLowClicked) {
      satVar = 0.5
    } else {
      satVar = 0.7
    }   

    if(this.state.BrightClicked) {
      valVar = 0.3
    } else if (this.state.BrightDarkClicked) {
      valVar = 0.5
    } else {
      valVar = 0.7
    }    

    if(this.state.circle) {
        cirVar = 1
      if(this.state.square && !this.state.triangle) { //circle square
        cirVar = 0.5
        triVar = 0.5
      } else if (!this.state.square && this.state.triangle) { //circle triangle 
        cirVar = 0.5
        triVar = 0.5
      } else { //all 3 shapes
        cirVar = 0.33
        triVar = 0.33
        squareVar = 0.33
      }
    }

    if (this.state.square && this.state.triangle) {
      squareVar = 0.5
      triVar = 0.5
    } else if (this.state.square && !this.state.triangle &&  !this.state.circle) { //only the square
      squareVar= 1
    } else if (this.state.triangle && !this.state.square && !this.state.circle) { //only the triangle
      triVar = 1
    }


    //you can send POST request in this way and get the returned CSV data, then you just pass response.data to getDataCallback() and render the images on the page

      requestBody = {
          circle : cirVar,
          square : squareVar,
          triangle : triVar,
          bright_dark : valVar,
          soft_sharp : 0.5,
          warm_cool : hueVar,
          simple_complex : 0.5,
          disorder_inorder : 0.5,
          high_low : satVar
      }

      localStorage.setItem('wc_pg1',hueVar)
      localStorage.setItem('hl_pg1',satVar)
      localStorage.setItem('bd_pg1',valVar)
      localStorage.setItem('circle_pg1',cirVar)
      localStorage.setItem('square_pg1',squareVar)
      localStorage.setItem('tri_pg1',triVar)

      //console.log(requestBody)
      axios.post('http://127.0.0.1:5000/sample_generator', requestBody)
      .then(function (response) {
          getDataCallback(response.data, false, false)
      })
      .catch(function (error) {
          console.log(error);
      });
  }



//using arrow function instead of binding the context
  handleCoolClick = () => {
    
    var times = Number(localStorage.getItem('hueClick_times'))
    localStorage.setItem('hueClick_times',(times+1))


    if ((!this.state.CoolClicked && this.state.CoolWarmClicked) || (!this.state.CoolClicked && this.state.WarmClicked)) {
        this.setState( prevState => ({
          CoolClicked: !prevState.CoolClicked
        }));
    }

    if(this.state.CoolWarmClicked) {
      this.setState( prevState => ({
        CoolWarmClicked: !prevState.CoolWarmClicked
      }));
    }

    if(this.state.WarmClicked) {
      this.setState( prevState => ({
        WarmClicked: !prevState.WarmClicked
      }));
    }
 
  }

  handleCoolWarmClick() {

    var times = Number(localStorage.getItem('hueClick_times'))
    localStorage.setItem('hueClick_times',(times+1))    
    
    if ((!this.state.CoolWarmClicked && this.state.CoolClicked) || (!this.state.CoolWarmClicked && this.state.WarmClicked)) {
      this.setState( prevState => ({
        CoolWarmClicked: !prevState.CoolWarmClicked
      }));      
    }

    if(this.state.CoolClicked) {
      this.setState({
        CoolClicked: false
      });
    }

    if(this.state.WarmClicked) {
      this.setState({
        WarmClicked: false
      });
    }
  }

  handleWarmClick() {

  var times = Number(localStorage.getItem('hueClick_times'))
  localStorage.setItem('hueClick_times',(times+1))
    
  if ((!this.state.CoolWarm && this.state.CoolClicked) || (!this.state.WarmClicked && this.state.CoolWarmClicked)) {
      this.setState({
        WarmClicked: !this.state.WarmClicked
      });
   }

    if(this.state.CoolClicked) {
      this.setState({
        CoolClicked: false
      });
    }

    if(this.state.CoolWarmClicked) {
      this.setState({
        CoolWarmClicked: false
      });
    }
  }


  handleHighClick() {

  var times = Number(localStorage.getItem('satClick_times'))
  localStorage.setItem('satClick_times',(times+1))    
    
  if ((!this.state.HighClicked && this.state.HighLowClicked) || (!this.state.HighClicked && this.state.LowClicked)) {
    this.setState({
      HighClicked: !this.state.HighClicked
    });
  }

    if(this.state.HighLowClicked) {
      this.setState({
        HighLowClicked: false
      });
    }

    if(this.state.LowClicked) {
      this.setState({
        LowClicked: false
      });
    }

  }

handleHighLowClick() {

  var times = Number(localStorage.getItem('satClick_times'))
  localStorage.setItem('satClick_times',(times+1))  

  if ((!this.state.HighLowClicked && this.state.LowClicked) || (!this.state.HighLowClicked && this.state.HighClicked)) {
    this.setState({
      HighLowClicked: !this.state.HighLowClicked
    });
  }

    if(this.state.HighClicked) {
      this.setState({
        HighClicked: false
      });
    }

    if(this.state.LowClicked) {
      this.setState({
        LowClicked: false
      });
    }

  }

handleLowClick() {

  var times = Number(localStorage.getItem('satClick_times'))
  localStorage.setItem('satClick_times',(times+1))  

  if ((!this.state.LowClicked && this.state.HighLowClicked) || (!this.state.LowClicked && this.state.HighClicked)) {
    this.setState({
      LowClicked: !this.state.LowClicked
    });

  }

    if(this.state.HighLowClicked) {
      this.setState({
        HighLowClicked: false
      });
    }

    if(this.state.HighClicked) {
      this.setState({
        HighClicked: false
      });
    }

}

handleBrightClick() {

  var times = Number(localStorage.getItem('valClick_times'))
  localStorage.setItem('valClick_times',(times+1))  

  if ((!this.state.BrightClicked && this.state.BrightDarkClicked) || (!this.state.BrightClicked && this.state.DarkClicked)) {
    this.setState({
      BrightClicked: !this.state.BrightClicked
    });
  }

    if(this.state.BrightDarkClicked) {
      this.setState({
        BrightDarkClicked: false
      });
    }

    if(this.state.DarkClicked) {
      this.setState({
        DarkClicked: false
      });
    }

}


handleBrightDarkClick() {
  
  var times = Number(localStorage.getItem('valClick_times'))
  localStorage.setItem('valClick_times',(times+1)) 

  if ((!this.state.BrightDarkClicked && this.state.BrightClicked) || (!this.state.BrightDarkClicked && this.state.DarkClicked)) {
 
    this.setState({
      BrightDarkClicked: !this.state.BrightDarkClicked
    });
  }

    if(this.state.BrightClicked) {
      this.setState({
        BrightClicked: false
      });
    }

    if(this.state.DarkClicked) {
      this.setState({
        DarkClicked: false
      });
    }

}

handleDarkClick() {
  
  var times = Number(localStorage.getItem('valClick_times'))
  localStorage.setItem('valClick_times',(times+1)) 

  if ((!this.state.DarkClicked && this.state.BrightDarkClicked) || (!this.state.DarkClicked && this.state.BrightClicked)) {
    this.setState({
      DarkClicked: !this.state.DarkClicked
    });
  }

    if(this.state.BrightClicked) {
      this.setState({
        BrightClicked: false
      });
    }

    if(this.state.BrightDarkClicked) {
      this.setState({
        BrightDarkClicked: false
      });
    }

}

checkItem(e, shape) {

  var times = Number(localStorage.getItem('shapeClick_times'))
  localStorage.setItem('shapeClick_times',(times+1)) 

  if (shape === 'circle') {
      this.setState ({
        circle: !this.state.circle
      })
  }

  if (shape === 'square') {
    this.setState ({
      square: !this.state.square
    })
  }

  if (shape === 'triangle') {
    this.setState ({
      triangle: !this.state.triangle
    })
  }

}

handleGenerate() {
  
  if(this.state.circle || this.state.square || this.state.triangle) {
      this.props.history.push('/secondpage');
  } else {
    console.log('Pick at least one shape')
  }

  end1 = new Date
  console.log('end time', end1)
  console.log('total time on page', (end1-start1) )

  //add time spent on page to local storage
  localStorage.setItem('page1_time', end1-start1 )
  


}

handleClickToStart = () => {
  this.setState ({
    hasBegun: true
  })

  //start time

  start1 = new Date;
  console.log('start time', start1)


}


  render(){
 
    return <div className='format'>


    <div className="App">

    { !this.state.hasBegun &&
      <div className='openingPage'>  
        <div className='welcomeText'>Welcome to DesignFinder! </div>
        
        <div className='startbuttonstyle'>
        <button className='clickToStart' onClick={this.handleClickToStart}> Click to Start </button>
        </div>
      </div>
    }
    
      <header className="leftside">
        <poster/>
        <h2 className='title'>  DesignFinder: Automated Design </h2>

        <div className='colshape'> Color Range </div>

        <div className = 'buttonflex'>
          <p className='hsv'> Hue:  </p>

          <div className = 'buttongroup'>

            <button className={this.state.CoolClicked ? "buttonClicked": "buttonUnclicked"} id='left' onClick={this.handleCoolClick}> Cool </button>
            <button className={this.state.CoolWarmClicked ? "buttonClicked": "buttonUnclicked"} onClick={this.handleCoolWarmClick}> Cool & Warm </button>
            <button className={this.state.WarmClicked ? "buttonClicked": "buttonUnclicked"} id='right' onClick={this.handleWarmClick}> Warm </button>
            
          </div>

        </div>
         <div className = 'buttonflex'>
          <p className='hsv'> Saturation:  </p>

          <div className = 'buttongroup2'> 
            <button className={this.state.HighClicked ? "buttonClicked": "buttonUnclicked"} id='left' onClick={this.handleHighClick}> High </button>
            <button className={this.state.HighLowClicked ? "buttonClicked": "buttonUnclicked"} onClick={this.handleHighLowClick}> Low & High </button>
            <button className={this.state.LowClicked ? "buttonClicked": "buttonUnclicked"} id='right' onClick={this.handleLowClick}> Low </button>
          </div>

        </div>
         <div className = 'buttonflex'>
          <p className='hsv'> Value:  </p>
          <div className ='buttongroup3'>
            <button className={this.state.BrightClicked ? "buttonClicked": "buttonUnclicked"} id='left' onClick={this.handleBrightClick} id='left'> Bright </button>
            <button className={this.state.BrightDarkClicked ? "buttonClicked": "buttonUnclicked"} onClick={this.handleBrightDarkClick}> Dark & Bright</button>
            <button className={this.state.DarkClicked ? "buttonClicked": "buttonUnclicked"} id='right' onClick={this.handleDarkClick}> Dark </button>
          </div>
        
        </div>


         <div className='colshape'> Shape Preference </div>

        <div className='checkboxes'>

         
          <input className='shapecheck' type = 'checkbox' onChange={ (e) => this.checkItem(e, 'circle') } /> 
          

          <span className={this.state.circle ? "circleClicked": "circleUnclicked" } ></span>

          <input className='shapecheck' type = 'checkbox' onChange={ (e) => this.checkItem(e, 'square') } / > 
          <span className={this.state.square ? "squareClicked": "squareUnclicked"}></span>

          <input className='shapecheck' type = 'checkbox' onChange={ (e) => this.checkItem(e, 'triangle') }/> 
          <span className={this.state.triangle ? "triangleClicked": "triangleUnclicked"}> </span>

        </div>

        <div className='text'>
          {(!this.state.circle && !this.state.square && !this.state.triangle) &&
            <div className='conditionaltext'>
              *Please choose at least one shape
            </div>
          }
        </div>



      </header>

      <header className = 'rightside'>
        
        <div className='rightsideflex'>
          <h2 id="samples"> Samples </h2>

          <div className ='rowp1'>
            <PosterSamples id="poster0" />
            <PosterSamples id="poster1" />
          </div>

          <div className ='rowp1'>
            <PosterSamples id="poster2" />
            <PosterSamples id="poster3" />
          </div>

          <div className ='rowp1'>
            <PosterSamples id="poster4" />
            <PosterSamples id="poster5" />
          </div>

          <div className ='rowp1'>
            <PosterSamples id="poster6" />
            <PosterSamples id="poster7" />
          </div>

          <div className ='rowp1'>
            <PosterSamples id="poster8" />
            <PosterSamples id="poster9" />
          </div>

          <button className='genbutton' onClick={this.handleGenerate}> See More Designs > </button>

        </div>
      </header>

    </div>


  </div>
  } 
}


export {App};
export default requestBody;