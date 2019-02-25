import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Dropdown,Col,Row} from 'react-bootstrap';
import Singson from './venues/Singson'

export default class Ticketing extends Component {
    constructor(){
        super();
        this.state = {
            venue_name: "",
            venue: [],
            chosen_seats: []
        }
        this.test = this.test.bind(this)
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

    showSales(){
        var sales = []
        const sale_container = (
                <div className="sale-container">
                    <span className="sale-ticket-section">3x Orchestra Center</span>
                    <span className="total-price">P100,000.000</span>
                </div>
        )
        for(var i = 0; i < 3; i++){
            sales.push(sale_container)
        }
        return (
            <div className="sale">
                {sales}
            </div>
        )
    }

    displayOrders(){
        var rows = [];
        const row = (
            <Row className="order">
                <Col md={7} className="order-text">
                    <div className="order-text-section">
                        Orchestra Center
                    </div>
                    <div className="order-text-seatNo">
                        SEAT NO. ORA1
                    </div>
                </Col>
                <Col md={4} className="order-price">
                    <div className="price">
                        P100,000
                    </div>
                    <div className="cancel">
                        <img style={{height:"2vh",marginRight:".3vw"}} src="/images/error.svg"/><span>Cancel</span>
                    </div>
                </Col>
            </Row>
        )

        for(var i = 0; i < 5; i++){
            rows.push(
                row
            )
        }

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
                        />
                    </div>
                        {/*this.test()*/}
                </div>
            </div>
        );
    }
}

