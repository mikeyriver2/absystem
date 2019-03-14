import {Row, Col} from 'react-bootstrap'
import React, { Component } from 'react';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import ReactDOM from 'react-dom';
import Example from '../Example';
import Singson from '../ticketing/venues/Singson'
import axios from 'axios';


export default class SideSummary extends Component{
    constructor(props){
        super(props)
        this.state={
            orders : [],
            total_revenue: 0,
            number_of_tickets_sold: 0
        }
    }

    componentDidMount(){
        axios.get('/api/ticketing/venue').then(res=>{
            this.setState({
                orders: res.data.venue.event.ticket_orders
            },function(){
                let rev = 0;
                let tix_count = 0;
                this.state.orders.map((order)=>{
                    order.tickets.map((ticket)=>{
                        rev += ticket.ticket_price
                        tix_count += 1
                    })
                })
                this.setState({
                    total_revenue: rev,
                    number_of_tickets_sold: tix_count
                })
            })
        })

    }

    handleShowSales(orders){
        var sales = [];
        for(let i = 0; i < 5; i++){
            let tix_ids = []
            if(orders[i]){
                orders[i].tickets.map((ticket)=>{
                    tix_ids.push(ticket.slug)
                })
                let string = tix_ids.join(" ").substr(0,19);
                sales.push(
                    <Row className="breakdown-item">
                        <Col md={8} className="breakdown-order"> 
                            <div className="sale-order"> 
                                Order No. {orders[i].id} | {orders[i].tickets.length} tickets
                            </div>
                            <div className="sale-codes">
                                {string.length >= 19 ? <span>{string}...</span> : string}
                            </div>
                        </Col>
                        <Col md={2} className="breakdown-functions"> 
                            view
                        </Col>
                    </Row>
                )
            }
        }
        return sales;
    }

    render(){
        return (
                <Col md={3} className="main-info">
                    <div className="summary-main-container">
                        <div className="summary-main">
                            <div className="rev-today">
                                <div className="amount">
                                    P{this.state.total_revenue}
                                </div>
                                <div className="label">
                                    Revenue Today
                                </div>
                            </div>
                            <div className="tickets-sold">
                                <div className="amount">
                                    {this.state.number_of_tickets_sold}
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
                            {this.handleShowSales(this.state.orders)}
                        </div>
                    </div>
                </Col>
            )
    }
}