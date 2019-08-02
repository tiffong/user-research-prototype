import React, { Component } from "react";

import {
  Route
} from "react-router-dom";

import {Switch} from 'react-router';
import {App} from "./App";
import SecondPage from "./secondpage.js";
import MergePage from "./mergepage.js"

// if you want to put img, which was exported from another page, in put in {img} within divs
//this is the router than controls 

class Main extends Component {
  // React.Component
  render() {
    return (
      <Switch>
/* exact means the router only renders the app component */ 
        <Route exact path='/' component={App}/>
        <Route path='/secondpage' component={SecondPage}/>
        <Route path='/mergepage' component = {MergePage}/>
      
      </Switch>


    );
  }
}


export default Main;