import {Row, Col} from 'react-bootstrap'
import React, { Component } from 'react';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import ReactDOM from 'react-dom';
import Example from '../Example';
import Singson from '../ticketing/venues/Singson'

export default class Home extends Component{
    constructor(props){
        super(props);
        this.state = {
            venue_name: "",
            venue: [],
            chosen_seats: []
        }
    }

    componentDidMount(){
        this.setState({
            venue_name: "Singson Hall",
            venue: [
                {
                    type: "ground floor",
                    number_of_sections: 3,
                    number_of_rows: [15,15,15],
                    number_of_columns: [10,15,10]
                },
                {
                    type: "balcony",
                    number_of_sections: 3,
                    number_of_rows: [4,5,4],
                    number_of_columns: [6,16,6]
                }
            ]
        })
    }

    handleShowSales(){
        var sales = [];
        for(var i = 0; i < 5; i++){
            sales.push(
                <Row className="breakdown-item">
                    <Col md={8} className="breakdown-order"> 
                        <div className="sale-order"> 
                            Order No. 12 | 4 tickets
                        </div>
                        <div className="sale-codes">
                            OLA1, OLA2, VIPA1, VIPA2
                        </div>
                    </Col>
                    <Col md={2} className="breakdown-functions"> 
                        view
                    </Col>
                </Row>
            )
        }
        return sales;
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
            <Row className="home">
                <Col md={1} className="side-bar">
                    <Row className="side-icon home-icon">
                        <Link to={`${this.props.match.url}`}>
                            <img onMouseOver={this.showLabel} onMouseOut={this.showLabel} id="home-icon" src="/images/home.svg" />
                        </Link>
                        <label id="label-home" htmlFor="home-icon" className="label-icon">Home</label>
                    </Row>
                    <Row className="side-icon ticket-icon">
                        <img onMouseOver={this.showLabel} onMouseOut={this.showLabel} src="/images/ticket.png" id="ticket-icon" />
                        <label style={{marginLeft:"6.9vw"}} id="label-ticket" htmlFor="ticket-icon" className="label-icon">Tickets</label>
                    </Row>
                    <Row className="side-icon event-icon">
                        <img onMouseOver={this.showLabel} onMouseOut={this.showLabel} src="/images/stage.png" id="event-icon"/>
                        <label style={{marginLeft:"6.7vw"}} id="label-event" htmlFor="event-icon" className="label-icon">Events</label>
                    </Row>
                    <Row className="side-icon member-icon">
                        <img onMouseOver={this.showLabel} onMouseOut={this.showLabel} src="/images/audience.png" id="member-icon"/>
                        <label style={{marginLeft:"7.4vw"}} id="label-member" htmlFor="member-icon" className="label-icon">Members</label>
                    </Row>
                </Col>
                <Col md={8} className="main">
                    <div className="main-top">
                        <h3>YEAR-END CONCERT 2019: SPIRIT</h3>
                        <h4>Live Status of Singson</h4>
                    </div>
                    
                    <div className="main-venue">
                        <Singson
                            venue={this.state.venue}
                            from_dashboard={true}
                        />
                    </div>
                    <div className="main-footer">
                        <Link to={"/ticketing"}>Ticketing Module </Link>|
                        <Link to={"/dashboard"}> Ticket Sales </Link>|
                        <Link to={"/dashboard"}> Export Sales .xlsx </Link>
                    </div>
                </Col>
                <Col md={3} className="main-info">
                    <div className="summary-main-container">
                        <div className="summary-main">
                            <div className="rev-today">
                                <div className="amount">
                                    P50,000
                                </div>
                                <div className="label">
                                    Revenue Today
                                </div>
                            </div>
                            <div className="tickets-sold">
                                <div className="amount">
                                    100
                                </div>
                                <div className="label">
                                    Tickets sold
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="breakdown">
                        <h4>RECENT SALES</h4>
                        <div className="breakdown-sales">
                            {this.handleShowSales()}
                        </div>
                    </div>
                </Col>
            </Row>
        )
    }
}