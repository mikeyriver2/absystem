import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Dropdown,Col,Row} from 'react-bootstrap';

export default class Ticketing extends Component {
    constructor(){
        super();
        this.state = {

        }
        this.renderVenue = this.renderVenue.bind(this)
        this.test = this.test.bind(this)
        this.handleSeatClick = this.handleSeatClick.bind(this)
    }

    componentDidMount(){

    }

    handleSeatClick(){
        console.log('ive been reserved baby')
    }

    renderVenue(numberOfSections,numberOfRows,numberOfColumns){ //# of columns per Section, for now assuming all sections have = number of columns
        var sections = [];
        
        const seat = (row_number,number_of_seats,section_number) => {
            var seats = [];
            var sections = ['OL','VIP','OR']
            var rows = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O']
            var section = sections[section_number];
            var row = rows[row_number];
            for(var i = 0; i < number_of_seats; i++){
                seats.push(
                    <div onClick={this.handleSeatClick} className={"seat"}>
                        {/*"r"+row_number+"-s"+i+" "*/}
                        {/*section+"-"+row+(i+1)*/}
                    </div>
                )
            }
            return seats
        }

        const row = (number_of_rows,number_of_columns,numberOfSections) => {
            var rows = [];
            for(var i = 0; i < number_of_rows; i++){
                rows.push(
                    <div className={"row-notBS row-"+i}>
                        {seat(i,number_of_columns,numberOfSections)}
                    </div>
                )
            }
            return rows
        }

        for(var i = 0; i < numberOfSections; i++){
            var section = " "
            if(i == 0){
                section = "ol"
            }else if(i == 1){
                section = "vip"
            }else{
                section = "or"
            }
            var class_name = "section section-"+section
             sections.push(
                <div className={class_name}>
                    {row(numberOfRows,numberOfColumns,i)}
                </div>
            )
        }
        return sections
        
    }

    test(){
        console.log('fuck this shit so much')
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
                                    <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                    <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                    <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className="concert-detail">
                            <Row>
                                <Col md={3} className="abs-logo">
                                    <img src="/images/abs-logo.png"/>
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
                        
                        </div>
                    </div>
                </div>
                <div className="venue">
                    <div className="stage">
                        stage
                    </div>
                    <div className="clickables">
                    {this.renderVenue(3,15,15)}
                    </div>
                    {/*this.test()*/}
                </div>
            </div>
        );
    }
}

