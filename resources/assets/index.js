import React, {Component} from 'react';
import ReactDOM from 'react-dom'
import App from './app';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import Example from './js/components/Example';
import Routes from './js/components/Routes';


export default class Index extends Component {
    render() {
        return (
            <div>
             <Routes />
            </div>
        );
    }
}

if(document.getElementById('abs')){
    ReactDOM.render(<Index />, document.getElementById('abs') )
}