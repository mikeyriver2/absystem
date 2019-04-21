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
            show_ticket_info: false,
            user: {}
        }
        this.showLabel = this.showLabel.bind(this)
    }

    componentDidMount(){
        axios.get('/login-check').then(res=>{
            this.setState({
                user: res.data.user
            })
        });
    }

    showLabel(e){
        var labels = document.getElementsByTagName('LABEL');
        for (var i = 0; i < labels.length; i++) {
            if (labels[i].htmlFor == e.target.id) {
                var label_classes = document.getElementById(labels[i].id).classList   
                if(label_classes.contains("show")){
                    label_classes.remove('show')
                }else{
                    label_classes.add('show')
                }          
            }
        }
    }

    render(){
        return (
            <Col md={1} className="side-bar">
                <Row className="side-icon home-icon">
                    <Link to={`/dashboard`}>
                        <img onMouseOver={this.showLabel} onMouseOut={this.showLabel} id="home-icon" src="/images/home.svg" />
                    </Link>
                    <label id="label-home" htmlFor="home-icon" className="label-icon">Home</label>
                </Row>
                <Row className="side-icon ticket-icon">
                    <Link to={`/dashboard/tickets`}>
                        <img onMouseOver={this.showLabel} onMouseOut={this.showLabel} src="/images/ticket.png" id="ticket-icon" />
                    </Link>
                    <label style={{marginLeft:"6.9vw"}} id="label-ticket" htmlFor="ticket-icon" className="label-icon">Tickets</label>
                </Row>
                <Row className="side-icon event-icon">
                    <img style={{cursor:"not-allowed"}} onMouseOver={this.showLabel} onMouseOut={this.showLabel} src="/images/stage.png" id="event-icon"/>
                    <label style={{marginLeft:"6.7vw"}} id="label-event" htmlFor="event-icon" className="label-icon">Events</label>
                </Row>
                <Row className="side-icon member-icon">
                    {this.state.user.type == "eb" ?
                        <Link to={`/dashboard/members`}>
                            <img onMouseOver={this.showLabel} onMouseOut={this.showLabel} src="/images/audience.png" id="member-icon"/>
                        </Link>
                    :
                        <img style={{cursor:"not-allowed"}} onMouseOver={this.showLabel} onMouseOut={this.showLabel} src="/images/audience.png" id="member-icon"/>
                    }
                    
                    <label style={{marginLeft:"7.4vw"}} id="label-member" htmlFor="member-icon" className="label-icon">Members</label>
                </Row>
            </Col>
        )
    }
}