import {Row, Col} from 'react-bootstrap'
import React, { Component } from 'react';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import ReactDOM from 'react-dom';
import Example from '../Example';
import Singson from '../ticketing/venues/Singson';
import OrderInfoModal from './OrderInfoModal';
import axios from 'axios';


export default class SideSummary extends Component{
    constructor(props){
        super(props)
        this.state={
            orders : [],
            total_revenue: 0,
            number_of_tickets_sold: 0,
            show_ticket_info: false
        }
        this.getOrderInfo = this.getOrderInfo.bind(this);
        this.handleShowTicketInfo = this.handleShowTicketInfo.bind(this);
    }

    componentDidMount(){
        axios.get('/ticketing/venue').then(res=>{
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

    getOrderInfo(e,date){
        let code = e.target.id
        let params = {
            code : code,
            chosen_date : date
        }
        axios.post('/dashboard/view-order',params).then(res=>{
            this.handleShowTicketInfo(null,res.data.order)
        });
    }

    handleShowTicketInfo(e=null,order={}){
        let bool = false;
        if(!this.state.show_ticket_info){
          bool = true;
        }
        this.setState({
          show_ticket_info: bool,
          ticket_info: order
        })
    }

    handleShowSales(orders){
        let associated_seats = this.props.associated_seats;
        let associated_bool = false;
        if(this.props.hasOwnProperty('associated_seats')){
            if(associated_seats.length > 0){
                associated_bool = true
            }
        }
        var sales = [];
        if(!associated_bool){
            for(let i = 0; i < 5; i++){
                let tix_ids = []
                if(orders[i]){
                    orders[i].tickets.map((ticket,index)=>{
                        tix_ids.push(ticket.slug)
                    })
                    let string = tix_ids.join(" ").substr(0,19);
                    sales.push(
                        <Row style={{marginTop: i == 0 ? "5px" : ""}} className="breakdown-item">
                            <Col md={8} className="breakdown-order"> 
                                <div className="sale-order"> 
                                    Order No. {orders[i].id} | {orders[i].tickets.length} tickets
                                </div>
                                <div className="sale-codes">
                                    {string.length >= 19 ? <span>{string}...</span> : string}
                                </div>
                            </Col>
                            <Col style={{cursor:"pointer"}} onClick={e=>{this.getOrderInfo(e,orders[i].event_day.date)}} id={orders[i].tickets[0].slug} md={2} className="breakdown-functions"> 
                                view
                            </Col>
                        </Row>
                    )
                }
            }
        }else{
            associated_seats.map((seat, index)=>{
                sales.push(
                    <Row style={{marginTop: index == 0 ? "5px" : ""}} className="breakdown-item">
                        <Col md={12} className="breakdown-order"> 
                            <div className="sale-order"> 
                                Seat Code: {seat.slug}
                            </div>
                            <div className="sale-codes">
                                Seat Section: {seat.section.name}
                            </div>
                        </Col>
                    </Row>
                )
            })
        }
        return sales;
    }

    render(){
        let associated_seats = this.props.associated_seats;
        let associated_bool = false;
        if(this.props.hasOwnProperty('associated_seats')){
            if(associated_seats.length > 0){
                associated_bool = true
            }
        }
        return (
                <Col md={3} className="main-info">
                    <div className="summary-main-container">
                        <div className="summary-main">
                        {!associated_bool ?
                            <div>  
                                <div className="rev-today">
                                    <div className="amount">
                                        P{this.state.total_revenue}
                                    </div>
                                    <div className="label">
                                        Total Revenue
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
                        :
                            <div className="associated-tickets-side">
                                <div className="rev-today">
                                    <div className="amount">
                                        Order no. {associated_seats[0].ticket_order.id}
                                    </div>
                                    <div className="label">
                                      {associated_seats[0].ticket_order.created_at}
                                    </div>
                                </div>
                                <div style={{cursor:"pointer", fontSize:".90em"}} onClick={this.getOrderInfo} id={associated_seats[0].slug} className="tickets-sold">
                                    view more
                                </div>
                            </div>
                        }
                        </div>
                    </div>
                    <div className="breakdown">
                        <h4>{associated_bool ? "TICKETS BOUGHT" : "RECENT SALES"}</h4>
                        <div className="breakdown-sales">
                            {this.handleShowSales(this.state.orders)}
                        </div>
                    </div>
                    <OrderInfoModal 
                        show_ticket_info = {this.state.show_ticket_info}
                        toggle_show = {this.handleShowTicketInfo}
                        ticket_info = {this.state.ticket_info}
                    />
                </Col>
            )
    }
}