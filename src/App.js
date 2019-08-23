import React from 'react';
import './App.css';
import PosterSamples from './postersamples.js'
import {getDataCallback} from './autobg/generator.js'
import axios  from 'axios'
import {begun} from './secondpage.js'

var requestBody = {}

var start1;
var end1;

var taskAstart;

//for user study -- getting # of clicks
localStorage.setItem('hueClick_times',0)
localStorage.setItem('satClick_times',0)
localStorage.setItem('valClick_times',0)
localStorage.setItem('shapeClick_times',0)


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

      taskAbegun: false,
      taskAfinished: false, 
      taskBbegun: false,

    }

  }

  componentDidMount() {
  
    this.getDataAxios()

    if( localStorage.getItem('showinstructions') === 'donot') {
        this.setState( prevState => ({
          hasBegun: true
        }));
    }


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

    if(this.state.circle && !this.state.square && !this.state.triangle) {
        cirVar = 1
        triVar = 0
        squareVar = 0 
    } else if (this.state.circle && this.state.square && !this.state.triangle) { //curcke square
         cirVar = 0.5
        triVar = 0
        squareVar = 0.5     
      } else if (this.state.circle && !this.state.square && this.state.triangle) { //CT
        cirVar = 0.5
        triVar = 0.5
        squareVar = 0
      } else if (this.state.circle && this.state.square && this.state.triangle) {
        cirVar = 0.33
        triVar = 0.33
        squareVar = 0.33        
      } else if (!this.state.circle && !this.state.square && !this.state.triangle) {
        cirVar = 0.33
        triVar = 0.33
        squareVar = 0.33            
      } else if (!this.state.circle && this.state.square && this.state.triangle) { //square triangle
        cirVar = 0
        squareVar = 0.5
        triVar = 0.5       
      } else if (!this.state.circle && this.state.square && !this.state.triangle) { //only square
        squareVar= 1
        triVar = 0
        cirVar = 0
      } else if (!this.state.circle && this.state.triangle && !this.state.square) {
        cirVar = 0
        triVar = 1
        squareVar = 0        
      }

  //you can send POST requests in this way and get the returned CSV data, then you just pass response.data to getDataCallback() and render the images on the page

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


  handleStartTaskA = () => {
    taskAstart = new Date
        this.setState( prevState => ({
          taskAbegun: true
        }));
  }

  handleFinishTaskA = () => {
    
    this.setState( prevState => ({
      taskAfinished: true
    }));

    var taskAfinish = new Date
    var difference = taskAfinish - taskAstart
    localStorage.setItem('taskATime', difference)



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

      <div className='instructions'>
        <h3> 实验任务：</h3>
        <div> 您需要参与两组实验，分别用不同的方式创作两幅横版宣传图，宣传图具体要求如下：</div>
        <div> 主题：2020 ACM人机交互国际会议 </div>
        <div> 分辨率：1280*720 </div>
        <div> 内容：包含提供素材里面的文字和素材 </div>
        <h3> 实验步骤： </h3>
        <div> 熟悉创作主题背景 </div>
        <div className='description'> ACM人机交互国际会议（ACM Conference on
              Human Factors in Computing Systems，CHI）是人
              机交互领域顶级的国际会议。自1982年创办以来，
              CHI每年都吸引着来自世界各地的不同背景的参会
              者。参会者里有教授有学生，有研究者有实践者，
              有刚踏入该领域的新人，也有从事研究多年的资深
              人士。这是一个由设计师、技术人员、心理学家、
              社会科学家、生物学家、艺术家、工程师、人类学
              家和音乐家组成的多样性群体，而且这个群体还
              在不断地发展壮大中。CHI是一个非常注重创新、
              学习、分享和交互的群体。他们有着一个共同的目
              标：用技术创造人们生活和娱乐的 </div>
  
        <h4> 实验组A（手动）： </h4>
        <div> 1.  打开提供的素材文件，包含1组文字，243个元素。选取其中1-3个元素作为素材使用，且允许重复使用，并且包含给定的文字。 </div>
        <div> 2.  根据自己习惯的设计流程在20分钟内完成创作（推荐使用Sketch/Illustrator）</div>
        <div> 3.  按照宣传图的要求导出成 png </div>
        <div> 4.  填写问卷，并回答问题</div>

        <div className='taskAbuttons'>
          <button className={this.state.taskAbegun ? "clickToStart": "clickToStartUnclicked"} onClick={this.handleStartTaskA}> {this.state.taskAbegun ? 'Task A Begun' : 'Begin Task A'} </button>
          <button className={this.state.taskAfinished ? "clickToStart": "clickToStartUnclicked"} onClick={this.handleFinishTaskA}> {this.state.taskBbegun ? 'Finish Task A' : 'Task A Finished'} </button>
          <a href='https://www.wjx.cn/jq/44451886.aspx'> Click to Take Survey A </a>
        </div>

        <h4> 实验组B（w/ DesignFinder）： </h4>
        <div> 1.  熟悉DesignFinder（10分钟） </div>
        <div> 2.  尝试在工具中提供的功能，找到自己满意的背景素材，并下载。</div>
        <div> 3.  使用提供的文字素材以及下载的背景素材，在20分钟内完成创作（推荐使用Sketch/Illustrator）</div>
        <div> 4.  按照宣传图的要求导出成png </div>
        <div> 5.  填写问卷，并回答问题 </div>
        <div> </div>
    </div>


        <div className='startbuttonstyle'>
        <button className={this.state.taskBbegun ? "clickToStart": "clickToStartUnclicked"} onClick={this.handleClickToStart}> Start Task B </button>
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