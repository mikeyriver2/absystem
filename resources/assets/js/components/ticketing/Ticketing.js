import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Dropdown,Col,Row} from 'react-bootstrap';
import Singson from './venues/Singson'
import axios from 'axios';

export default class Ticketing extends Component {
    constructor(props){
        super(props);
        this.state = {
            venue_name: "",
            venue: [],
            chosen_seats: [],
        }
        this.test = this.test.bind(this);
        this.handleChosenSeats = this.handleChosenSeats.bind(this);
        this.displayOrders = this.displayOrders.bind(this);
        this.removeSeat = this.removeSeat.bind(this);
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

    handleChosenSeats(seat){
        var chosen_seats = this.state.chosen_seats;
        var bool = false; //id is not yet selected, meaning this should be selected
        var found_index;
        chosen_seats.map((chosen_seat,index)=>{
            if(chosen_seat.seat_id == seat.seat_id){
                bool = true // id is already selected, meaning this should be unselected
                found_index = index
            }
        })

        if(bool){
            var unSetSeat = chosen_seats.filter((value, index, arr)=>{
                return index != found_index;
            });
            this.setState({
                chosen_seats : unSetSeat
            })
        }else{
            chosen_seats.push(seat);
            this.setState({
                chosen_seats : chosen_seats
            })
        }
        
    }

    showSales(){
        var sales_htmls = []
        const sale_container = (
                <div className="sale-container">
                    <span className="sale-ticket-section">3x Orchestra Center</span>
                    <span className="total-price">P100,000.000</span>
                </div>
        )
        for(var i = 0; i < 3; i++){
            sales_htmls.push(sale_container)
        }
        return (
            <div className="sale">
                {sales_htmls}
            </div>
        )
    }
    
    removeSeat(seat){
        var chosen_seats = this.state.chosen_seats;
        chosen_seats.map((chosen_seat,index)=>{
            if(chosen_seat.seat_id == seat.seat_id){
                var filtered = chosen_seats.filter((value,f_index)=>{
                    return f_index != index;
                })
                this.setState({
                    chosen_seats: filtered
                })
            }
        })
    }

    displayOrders(){
        console.log("displaying orders")
        var rows = [];
        const row = (seat) => { return (
            <Row className="order">
                <Col md={7} className="order-text">
                    <div className="order-text-section">
                        {seat.section_name}
                    </div>
                    <div className="order-text-seatNo">
                        SEAT NO. {seat.seat_id}
                    </div>
                </Col>
                <Col md={4} className="order-price">
                    <div className="price">
                        P{seat.ticket_price}.00
                    </div>
                    <div onClick={()=>this.removeSeat(seat)} className="cancel">
                        <img style={{height:"2vh",marginRight:".3vw"}} src="/images/error.svg"/><span>Cancel</span>
                    </div>
                </Col>
            </Row>
        )}

        this.state.chosen_seats.map((seat)=>{
            rows.push(row(seat))
        })

        return rows;
    }

    test(){
        console.log('Fok me baby one more time')
        const ass = [];
        var fuckass = function() {for(var i = 0; i < 5; i++){
            ass.push(<div key={i}>Asss Fuck</div>)
            }
        }
        console.log(ass)
        fuckass()
        return ass;
    }

    render() {
        var window_width = window.innerWidth+"px";
        var window_height = window.innerHeight+"px";
        var number_of_columnSection = [10,13,10] //# of items must match number of sections
        var number_of_rowSection = [4,5,4] //same rule
        var numberOfSections = 3;
        var numberOfRows = 15;

        return (
            <div className="container-vanilla">
                <div className="ticket-module">
                    <div className="ticket-module-head">
                        <div className="date-dropdown">
                            <Dropdown>
                                <Dropdown.Toggle id="dropdown-date">
                                    <div className="dropdown-container">
                                        <img src="/images/clapperboard.png"/>
                                        <span>Select Reservation Date</span>
                                    </div>
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item>Day 1 [May 5, 2019]</Dropdown.Item>
                                    <Dropdown.Item>Day 2 [May 6, 2019]</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className="concert-detail">
                            <Row>
                                <Col md={3} className="abs-logo">
                                    <img src="/images/ABS_Full-Logo_Circle.png"/>
                                </Col>
                                <Col md={9} className='concert-title'>
                                    YEAR-END CONCERT 2019: SPIRIT
                                </Col>
                            </Row>
                        </div>
                        <div className="orders-title">
                            <span>Orders</span>
                        </div>
                        <div className="orders">
                            <div className="orders-container">
                                {this.displayOrders()}
                            </div>
                        </div>
                        <div className="orders-title">
                            <span>Summary</span>
                        </div>
                        <div className="summary">
                            <div className="summary-container">
                                {this.showSales()}
                            </div>
                            <div className="total-price">
                                <hr style={{margin:"10px 1vw"}} className="summary-hr"/>
                                <div className="price"><b>P300,000.00</b></div>
                                <div className="btn-container">
                                    <button className="btn btn-default">
                                        <b>Order Now</b>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{maxHeight:window_height}} className="venue">
                    <div className="stage-container">
                        <div className="stage">
                            STAGE
                        </div>
                    </div>
                    <div className="clickables">
                        <Singson 
                            venue = {this.state.venue}
                            handleChosenSeats = {this.handleChosenSeats}
                            chosen_seats = {this.state.chosen_seats}
                        />
                    </div>
                        {/*this.test()*/}
                </div>
            </div>
        );
    }
}

