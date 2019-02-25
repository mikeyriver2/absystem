import React, {Component} from 'react';
import ReactDOM from 'react-dom'
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import Example from './Example';
import Ticketing from './ticketing/Ticketing';
import Head from './dashboard/Head';
import Index from '../../index';


class Routes extends Component{
    render(){
        return (
            <Router>
                <div>
                    <Route path="/dashboard" component={Head} /> {/* Note u stupid bitch, nested routes no more in v4 and remove 'exact' from route if nested - u stupid bitch ass bitch*/}
                    <Route exact path="/ticketing" component={Ticketing} />
                    <Route exact path="/" component={Ticketing} />
                </div>
            </Router>
            );
    }
}

export default Routes;