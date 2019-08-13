import React from 'react';
import { withRouter} from 'react-router-dom'
import './postersamples.css';



class PosterSamples extends React.Component{
  
  render(){
    //return <img alt='1pgposters' className = 'postersamples' src = {this.props.posterselection} />
    return <div alt='1pgposters' className = 'postersamples' id = {this.props.id} />
  }
}



export default withRouter(PosterSamples);
