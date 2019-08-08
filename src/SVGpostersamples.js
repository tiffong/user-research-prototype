import React from 'react';
import { withRouter} from 'react-router-dom'
import './SVGpostersamples.css';



class SVGPosterSamples extends React.Component{
  
  render(){
    return <svg className = 'SVGpostersamples' src = {this.props.SVGposterselection} />
  }
}



export default withRouter(SVGPosterSamples);
