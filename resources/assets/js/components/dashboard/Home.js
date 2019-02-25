import {Row, Col} from 'react-bootstrap'
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class Home extends Component{
    constructor(props){
        super(props);
        this.state = {

        }
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
                        <img onMouseOver={this.showLabel} onMouseOut={this.showLabel} id="home-icon" src="/images/home.svg" />
                        <label id="label-home" htmlFor="home-icon" className="label-icon poopoo">Home</label>
                    </Row>
                    <Row className="side-icon ticket-icon">
                        <img onMouseOver={this.showLabel} onMouseOut={this.showLabel} src="/images/ticket.png" id="ticket-icon" />
                        <label id="label-ticket" htmlFor="ticket-icon" className="label-icon poopoo">Tickets</label>
                    </Row>
                    <Row className="side-icon event-icon">
                        <img onMouseOver={this.showLabel} onMouseOut={this.showLabel} src="/images/stage.png" id="event-icon"/>
                        <label id="label-event" htmlFor="event-icon" className="label-icon poopoo">Events</label>
                    </Row>
                    <Row className="side-icon member-icon">
                        <img onMouseOver={this.showLabel} onMouseOut={this.showLabel} src="/images/audience.png" id="member-icon"/>
                        <label id="label-member" htmlFor="member-icon" className="label-icon poopoo">Members</label>
                    </Row>
                </Col>
                <Col md={8} className="main">
                    main
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
                        {this.handleShowSales()}
                    </div>
                </Col>
            </Row>
        )
    }
}