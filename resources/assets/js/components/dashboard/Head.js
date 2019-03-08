import {Row, Col} from 'react-bootstrap'
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Example from '../Example';
import Home from './Home'
import Tickets from './Tickets'
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';


export default class Head extends Component{
    constructor(props){
        super(props);
        this.state = {

        }
    }

    componentDidMount(){
        console.log(`${this.props.match.path}/example`)
    }

    render(){
        return (
            <div>
                <Row className="head">
                    <Col md={4} className="logo">
                        <img src="/images/abs-logo.png" />
                    </Col>
                    <Col md={4} className="abs-title">
                    ATENEO BLUE SYMPHONY ORCHESTRA
                    </Col>
                    <Col md={4} className="hi-username">
                        <Row style={{height:"100%"}}>
                            <Col md={7} className="username">
                                Hi there, <br /> Michael Rivera!
                            </Col>
                            <Col md={5} className="dp">
                                <img src="/images/dp.svg" />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Route exact path={`${this.props.match.url}`} component={Home}/>
                <Route exact path={`${this.props.match.url}/home`} component={Home}/>
                <Route exact path={`${this.props.match.url}/tickets`} component={Tickets}/>
                <Route exact path={`${this.props.match.url}/tickets/order/:id`} component={Tickets}/>
                <Route exact path={`${this.props.match.url}/tickets/ticket/:id`} component={Tickets}/>

            </div>
            
        )
    }
}