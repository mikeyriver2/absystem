import React, {Component} from 'react';
import ReactDOM from 'react-dom'
import App from './app';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import Example from './js/components/Example';
import Routes from './js/components/Routes';
import Head from './js/components/dashboard/Head';


export default class Index extends Component {
    render() {
        return (
            <div>
                <Head 
                    match={this.props.match}
                />
            </div>
        );
    }
}

if(document.getElementById('abs')){
    ReactDOM.render(<Routes />, document.getElementById('abs') )
}