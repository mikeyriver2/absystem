import {Row, Col} from 'react-bootstrap'
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Example from '../Example';
import Home from './Home'
import Tickets from './Tickets'
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import axios from 'axios';


export default class Head extends Component{
    constructor(props){
        super(props);
        this.state = {
            showLogout: false,
            user: {}
        }
        this.showLogout = this.showLogout.bind(this);
    }

    componentDidMount(){
        console.log(`${this.props.match.path}/example`)
        axios.get('/login-check').then(res=>{
            this.setState({
                user: res.data.user
            })
        });
    }

    showLogout(){
        var bool = false;
        if(!this.state.showLogout){
            bool = true
        }
        this.setState({
            showLogout: bool
        })
    }

    handleLogout(){
        axios.get('/logout').then(res=>{
            window.location.href = '/';
        });
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
                    <Col onClick={this.showLogout} md={4} className="hi-username">
                        <Row style={{height:"100%"}}>
                            <Col md={7} className="username">
                                Hi there, <br /> {this.state.user.email}!
                            </Col>
                            <Col md={5} className="dp">
                                <img src="/images/dp.svg" />
                            </Col>
                        </Row>
                    </Col>
                    {this.state.showLogout &&
                        <div onClick={this.handleLogout} id="logout" className="logout">Logout</div>
                    }
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