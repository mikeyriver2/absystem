import {Row, Col, Dropdown} from 'react-bootstrap'
import React, { Component } from 'react';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import ReactDOM from 'react-dom';
import Example from '../Example';
import Singson from '../ticketing/venues/Singson';
import SideBar from './SideBar';
import SideSummary from './SideSummary';
import OrderInfoModal from './OrderInfoModal';
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
            sold_seats: {},
            show_ticket_info: false,
            ticket_info: {},
            associated_tickets: [],
            special_seats: []
        }
        this.setVenue = this.setVenue.bind(this);
        this.handleShowTicketInfo = this.handleShowTicketInfo.bind(this);
        this.getOrderInfo = this.getOrderInfo.bind(this);
        this.getAssociatedSeats = this.getAssociatedSeats.bind(this);
        this.resetAssociatedSeats = this.resetAssociatedSeats.bind(this);

    }

    componentDidMount(){
        this.setVenue()
        setInterval(()=>{this.setVenue()}, 10000)

    }

    componentWillUnmount(){
        this.resetAssociatedSeats();
    }

    setVenue(){
        let array = [];
        var venue_object = {
            venue_name: "",
            venue: []
        }
        var sold_seats = {}

        axios.get('/dashboard/venue').then(res=>{
            venue_object.venue_name = res.data.venue.name;
            venue_object.special_seats = [];
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
                if(section.special){
                    venue_object.special_seats.push(section.special)
                }
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
                selected_date:array[0],
                special_seats: venue_object.special_seats
            })
        })
    }

    getOrderInfo(code){
        this.setState({
            associated_tickets: []
        })
        console.log(code);
        let params = {
            code : code,
            chosen_date : this.state.selected_date
        }
        axios.post('/dashboard/view-order',params).then(res=>{
            this.getAssociatedSeats(res.data.ticket.ticket_order)
            //this.handleShowTicketInfo(null,res.data.order)
        });
    }

    resetAssociatedSeats(){
        this.setState({
            associated_tickets: []
        })
    }

    getAssociatedSeats(tickets){
        this.setState({
            associated_tickets: tickets
        })
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
    
    handleSetDate(e){
        this.setState({
            selected_date: e
        })
    }
      

    render(){
        return (
            <Row className="home">
                <SideBar 
                />
                <Col md={8} className="main">
                    <div className="main-top">
                        <h3>YEAR-END CONCERT 2019: ANIMA</h3>
                        <h4>Live Status of Singson</h4>
                    </div>
                    <div className="main-footer"> {/* it was a footer before I moved it hahah */}
                        <div className="main-functions">
                            <Link to={"/ticketing"}>Ticketing Module </Link>|
                            {/*<Link to={"/dashboard"}> Ticket Sales </Link>|*/}
                            <a href="/dashboard/report"> Export Sales .xlsx </a>
                        </div>
                        <div className="date-dropdown">
                            <Dropdown onSelect={(e)=>{this.handleSetDate(e)}}>
                                <Dropdown.Toggle id="dropdown-date">
                                    <div className="dropdown-container">
                                        <img src="/images/clapperboard.png"/>
                                        {this.state.selected_date == "" ?
                                            <span>Select Reservation Date</span>
                                            :
                                            <span>{this.state.selected_date}</span>
                                        }
                                    </div>
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    {this.state.dates.map((date,index)=>{
                                        return <Dropdown.Item eventKey={date}>{date}</Dropdown.Item>
                                    })
                                    }
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="main-venue">
                        <Singson
                            resetAssociatedSeats = {this.resetAssociatedSeats}
                            associated_seats = {this.state.associated_tickets.tickets ? this.state.associated_tickets.tickets : this.state.associated_tickets}
                            venue={this.state.venue}
                            from_dashboard={true}
                            chosen_date = {this.state.selected_date}
                            sold_seats = {this.state.sold_seats}
                            getOrderInfo = {this.getOrderInfo}
                            special_seats = {this.state.special_seats}
                        />
                    </div>
                </Col>
                <SideSummary
                    associated_seats = {this.state.associated_tickets}
                    chosen_date = {this.state.selected_date}
                    handleShowSales = {this.handleShowSales}
                />
                <OrderInfoModal 
                    show_ticket_info = {this.state.show_ticket_info}
                    toggle_show = {this.handleShowTicketInfo}
                    ticket_info = {this.state.ticket_info}
                />
            </Row>
        )
    }
}