import {Row, Col} from 'react-bootstrap'
import React, { Component } from 'react';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import ReactDOM from 'react-dom';
import Example from '../Example';
import Singson from '../ticketing/venues/Singson'
import SideBar from './SideBar'
import SideSummary from './SideSummary'
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
        this.setVenue()
        setInterval(()=>{this.setVenue()}, 10000)

    }

    setVenue(){
        let array = [];
        var venue_object = {
            venue_name: "",
            venue: []
        }
        var sold_seats = {}

        axios.get('/api/dashboard/venue').then(res=>{
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


    render(){
        return (
            <Row className="home">
                <SideBar 
                />
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
                <SideSummary
                    handleShowSales = {this.handleShowSales}
                />
            </Row>
        )
    }
}