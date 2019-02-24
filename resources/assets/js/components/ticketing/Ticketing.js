import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Dropdown,Col,Row} from 'react-bootstrap';

export default class Ticketing extends Component {
    constructor(){
        super();
        this.state = {
            venue_name: "",
            venue: [],
            chosen_seats: []
        }
        this.renderVenue = this.renderVenue.bind(this)
        this.test = this.test.bind(this)
        this.handleSeatClick = this.handleSeatClick.bind(this)
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

    handleSeatClick(e){
        console.log('ive been reserved baby')
        console.log('className ='+e.target.className)
        var class_name = e.target.className;
        var status = class_name.split(" ")

        if(status.includes("seat-not-taken")){
            document.getElementById(e.target.id).classList.add('seat-reserved');
            document.getElementById(e.target.id).classList.remove('seat-not-taken');
        }else if(status.includes("seat-reserved")){
            document.getElementById(e.target.id).classList.remove('seat-reserved');
            document.getElementById(e.target.id).classList.add('seat-not-taken');
        }
    }

    renderVenue(numberOfSections,numberOfRows,numberOfColumns,type){ //# of columns per Section, for now assuming all sections have = number of columns
        var sections = [];
        
        const seat = (row_number,number_of_seats,section_number) => {
            var height = 3.5
            if(number_of_seats > 10){
                height = 2.5
            }
            /*if(number_of_seats > 10){
                height = 2.5
            }else if (number_of_seats < 7){
                height = 3
            }else if (number_of_seats > 15){
                height = 2
            }*/
            var style = {
                height: height+"vh",
                /*width: number_of_seats < 7 ? "3vh" : "",
                margin:  number_of_seats < 7 ? "1.5vh auto" : ""*/
            }
            var seats = [];
            var sections = ['OL','VIP','OR']
            var rows = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O']
            var section = sections[section_number];
            var row = rows[row_number];
            for(var i = 0; i < number_of_seats; i++){
                let class_name = "seat seat-not-taken" 
                seats.push(
                    <div id={section+"-"+row+(i+1)} onClick={this.handleSeatClick} className={class_name}>
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
                    <div style={{gridTemplateColumns: "repeat("+number_of_columns+", 3vh)" }}className={"row-notBS row-"+i}>
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
                <div>
                    <h4 style={{textAlign:"center",marginBottom:"1.5rem"}}>{type == "balcony" ? "balcony" : section}</h4>
                    <div style={{gridTemplateRows: "repeat("+numberOfRows[i]+", 5vh)"}}className={class_name}>
                        {row(numberOfRows[i],numberOfColumns[i],i)}
                    </div>
                </div>
            )
        }
        return sections
        
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
                        {this.state.venue.map((venue)=>{
                            let sections = venue.number_of_sections;
                            let rows = venue.number_of_rows;
                            let columns = venue.number_of_columns;
                            var type = venue.type;
                            //gridTemplateColumns:"repeat("+sections+", 1fr)" old grid template
                            var grid_template_size = ""
                            if(venue.type == "balcony"){
                                grid_template_size = "20vw 30vw 20vw"
                            }else{
                                grid_template_size = "20vw 30vw 20vw"
                            }
                            return (
                            <div>
                                <div style={{gridTemplateColumns:grid_template_size}}className="clickables-container">
                                    {this.renderVenue(sections,rows,columns,type)}
                                </div>
                                <hr />
                            </div>
                            )
                        })
                        }
                        {/*
                        <div style={{gridTemplateColumns:"repeat("+numberOfSections+", 1fr)"}}className="clickables-container">
                            {this.renderVenue(3,number_of_rowSection,[6,16,6])}
                        </div>
                        */}
                    </div>
                        {/*this.test()*/}
                </div>
            </div>
        );
    }
}

