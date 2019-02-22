import React, {Component} from 'react';
import ReactDOM from 'react-dom'
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import Example from './Example';
import Ticketing from './ticketing/Ticketing';
import Head from './dashboard/Head';




class Routes extends Component{
    render(){
        return (
            <Router>
                <div>
                    <Route exact path="/example" component={Example} />
                    <Route exact path="/ticket" component={Ticketing} />
                    <Route exact path="/head" component={Head} />
                </div>
            </Router>
            );
    }
}

export default Routes;