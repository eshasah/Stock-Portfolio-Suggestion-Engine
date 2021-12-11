import React,{Component} from 'react';
import {Route} from 'react-router-dom'; 
import Home from './Home/Home'
import Graph from './Graph/Graph'
import Stats from './Graph/Stats'
import '../App.css'

class Main extends Component{

    render(){
        return(
            <div>
                <Route exact path="/" component={Home}></Route>
                <Route exact path="/graph" component={Graph}></Route>
                <Route exact path="/suggest" component={Stats}></Route>
            </div>
        )
    }
}

export default Main;