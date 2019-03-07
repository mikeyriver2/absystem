import {Row, Col} from 'react-bootstrap'
import React, { Component } from 'react';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import ReactDOM from 'react-dom';
import Example from '../Example';
import Singson from '../ticketing/venues/Singson'
import axios from 'axios';

export default class Home extends Component{
    constructor(props){
        super(props);
        this.state = {
            venue_name: "",
            venue: [],
            chosen_seats: [],
            total_price: 0,
            show_order_modal: false,
            dates: [],
            selected_date: "",
            event: {},
            sold_seats: {}
        }
        this.setVenue = this.setVenue.bind(this)
    }

    componentDidMount(){
        this.setVenue();

    }

    setVenue(){
        let array = [];
        var venue_object = {
            venue_name: "",
            venue: []
        }
        var sold_seats = {}

        axios.get('/api/ticketing/venue').then(res=>{
            venue_object.venue_name = res.data.venue.name;
            res.data.section_types.map((type)=>{
                venue_object.venue.push({
                    type: type.type,
                    number_of_sections: 0,
                    number_of_rows: [],
                    number_of_columns: [],
                    section_order: []
                })
            });
            res.data.venue.sections.map((section)=>{
                venue_object.venue.map((map,index)=>{
                    if(map.type == section.type){
                        venue_object.venue[index].number_of_sections += 1;
                        venue_object.venue[index].number_of_rows.push(section.number_of_rows);
                        venue_object.venue[index].number_of_columns.push(section.number_of_columns);
                        venue_object.venue[index].section_order.push(section.name);
                    }
                })
            });
            res.data.venue.event.event_days.map((date)=>{
                array.push(date.date)
            });
            res.data.venue.event.ticket_orders.map((order)=>{
                order.tickets.map((ticket)=>{
                    if(!sold_seats[order.event_day.date]){
                        sold_seats[order.event_day.date] = []
                    }
                    sold_seats[order.event_day.date].push(ticket.slug)
                })
            })

            console.log(venue_object);
            this.setState({
                sold_seats: sold_seats,
                dates:array,
                venue_name: venue_object.venue_name,
                venue: venue_object.venue,
                event: res.data.venue.event,
                selected_date:array[0]
            })
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
                    <div className="main-footer"> {/* it was a footer before I moved it hahah */}
                        <Link to={"/ticketing"}>Ticketing Module </Link>|
                        <Link to={"/dashboard"}> Ticket Sales </Link>|
                        <Link to={"/dashboard"}> Export Sales .xlsx </Link>
                    </div>
                    <div className="main-venue">
                        <Singson
                            venue={this.state.venue}
                            from_dashboard={true}
                            chosen_date = {this.state.selected_date}
                            sold_seats = {this.state.sold_seats}
                        />
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