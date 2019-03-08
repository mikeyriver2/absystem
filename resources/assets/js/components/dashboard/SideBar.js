import {Row, Col} from 'react-bootstrap'
import React, { Component } from 'react';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import ReactDOM from 'react-dom';
import Example from '../Example';
import Singson from '../ticketing/venues/Singson'
import axios from 'axios';


export default class SideBar extends Component{
    constructor(props){
        super(props)
        this.state={

        }
    }

    render(){
        return (
            <Col md={1} className="side-bar">
                <Row className="side-icon home-icon">
                        <Link to={`${this.props.current_url}`}>
                            <img onMouseOver={this.props.showLabel} onMouseOut={this.props.showLabel} id="home-icon" src="/images/home.svg" />
                        </Link>
                        <label id="label-home" htmlFor="home-icon" className="label-icon">Home</label>
                    </Row>
                    <Row className="side-icon ticket-icon">
                        <img onMouseOver={this.props.showLabel} onMouseOut={this.props.showLabel} src="/images/ticket.png" id="ticket-icon" />
                        <label style={{marginLeft:"6.9vw"}} id="label-ticket" htmlFor="ticket-icon" className="label-icon">Tickets</label>
                    </Row>
                    <Row className="side-icon event-icon">
                        <img onMouseOver={this.props.showLabel} onMouseOut={this.props.showLabel} src="/images/stage.png" id="event-icon"/>
                        <label style={{marginLeft:"6.7vw"}} id="label-event" htmlFor="event-icon" className="label-icon">Events</label>
                    </Row>
                    <Row className="side-icon member-icon">
                        <img onMouseOver={this.props.showLabel} onMouseOut={this.props.showLabel} src="/images/audience.png" id="member-icon"/>
                        <label style={{marginLeft:"7.4vw"}} id="label-member" htmlFor="member-icon" className="label-icon">Members</label>
                    </Row>
                </Col>
        )
    }
}