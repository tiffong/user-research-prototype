import React from 'react';
import { withRouter} from 'react-router-dom'
import './postersamples.css';



class PosterSamples extends React.Component{
  

  render(){
    return <img alt='firstpagepostersamples' className = 'postersamples' src = {this.props.posterselection} />
  }
}



export default withRouter(PosterSamples);
