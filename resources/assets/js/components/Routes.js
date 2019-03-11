import React, {Component} from 'react';
import ReactDOM from 'react-dom'
import {BrowserRouter as Router, Link, Route, withRouter} from 'react-router-dom';
import Example from './Example';
import Ticketing from './ticketing/Ticketing';
import Head from './dashboard/Head';
import Index from '../../index';
import axios from 'axios'

class Routes extends Component{
    constructor(){
        super()
        this.state = {
            logged: false
        }
    }
    componentDidMount(){
        var current_path = window.location.pathname;
        console.log(current_path);
        axios.get('/login-check').then(res=>{
            let bool = res.data.logged
            if(!bool && current_path.includes("dashboard")){
                window.location.href = '/login';
            }else{
                this.setState({
                    logged:true
                })
            }
        }).catch(err=>{
            if(current_path.includes("dashboard")){
                window.location.href = '/login';
            }
        })
    }

    /* Note u stupid bitch, nested routes no more in v4 and remove 'exact' from route if nested - u stupid bitch ass bitch*/
    render(){
        return (
            <Router>
                <div>
                    {this.state.logged &&
                     <Route path="/dashboard" component={Head} /> 
                    }
                    <Route exact path="/ticketing" component={Ticketing} />
                    <Route exact path="/" component={Ticketing} />
                </div>
            </Router>
            );
    }
}

export default Routes;