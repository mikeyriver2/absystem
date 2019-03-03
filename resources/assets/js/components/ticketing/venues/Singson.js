import {Row, Col, OverlayTrigger} from 'react-bootstrap'
import React, { Component } from 'react';
import axios from 'axios';

export default class Singson extends Component{
    constructor(props){
        super(props)
        this.state = {
            price: {
                ol: 350.00,
                vip: 500.00,
                or: 350.00
            }
        }
        this.handleSeatClick = this.handleSeatClick.bind(this)
    }

    componentDidUpdate(prevProps){
        if(prevProps.chosen_seats){
            if(prevProps.chosen_seats.length != this.props.chosen_seats.length){
                prevProps.chosen_seats.map((seat)=>{
                    var bool = false;
                    this.props.chosen_seats.map((seat_1)=>{
                        if(seat_1.seat_id == seat.seat_id){
                            bool = true
                        }
                    })
                    if(!bool){
                        document.getElementById(seat.seat_id).classList.remove('seat-reserved');
                        document.getElementById(seat.seat_id).classList.add('seat-not-taken');                } 
                })
            }
        }
    }

    renderSeatPopOver(section,row,column_number){
        return(
        <div className="">
            {section+row+column_number}
        </div>
        )
    }

    handleSeatClick(e){
        /*axios.get('/api/test').then(res=>{
            console.log(res.data);
        })*/

        /*console.log('ive been reserved baby')
        console.log('className ='+e.target.className)
        console.log('className ='+e.target.id)*/

        var class_name = e.target.className;
        var id = e.target.id
        var section_name = "";
        var ticket_price = 350;
        var status = class_name.split(" ");
        
        if(id.includes('OL')){
            section_name = "Orchestra Left"
        }else if(id.includes('OR')){
            section_name = "Orchestra Right"
        }else if(id.includes('VIP')){
            section_name = "VIP"
            ticket_price = 500;
        }else if(id.includes('BL')){
            section_name = "Balcony Left"
            ticket_price = 250;
        }else if(id.includes('BC')){
            section_name = "Balcony Center"
            ticket_price = 250;
        }else if(id.includes('BR')){
            section_name = "Balcony Right"
            ticket_price = 250;
        }

        var seat = {
            section_name: section_name,
            seat_id: id,
            ticket_price: ticket_price
        }
        
        this.props.handleChosenSeats(seat);

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
        var from_dashboard = this.props.hasOwnProperty('from_dashboard')
        var rows = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O']

        const seat = (row_number,number_of_seats,section_number) => {
            var height = 3.5
            if(number_of_seats > 10){
                height = 2.5
            }

            var style = {
                height: height+"vh",
            }
            var seats = [];
            var sections = ['OL','VIP','OR']
            var sections_balcony = ['BL','BC','BR']
            var section = "";
            if(type == "balcony"){
                section = sections_balcony[section_number];
            }else{
                section = sections[section_number];
            }
            var row = rows[row_number];
            for(var i = 0; i < number_of_seats; i++){
                let class_name = "seat seat-not-taken" 
                var style={
                    height: from_dashboard ? "2.5vh" : ""
                }
                seats.push(
                    // <OverlayTrigger causes it to slow down for some stupid ass reason
                    //     placement="top"
                    //     delay={{ show: 250 }}
                    //     overlay={this.renderSeatPopOver(section,row,i+1)}
                    //     onClick={this.handleSeatClick}
                    // >
                        <div id={section+row+(i+1)} style={style} onClick={this.handleSeatClick} className={class_name}>
                        </div>
                    // </OverlayTrigger>
                )
            }
            return seats
        }

        const row_label = (number_of_rows,number_of_columns,numberOfSections) => {
            var row_labels = [];
            for(var i = 0; i < number_of_rows; i++){
                row_labels.push(
                    <div>
                        {rows[i]}
                    </div>
                )
            }
            return row_labels
        }

        

        const row = (number_of_rows,number_of_columns,numberOfSections) => {
            var rows_array = [];
            var spacing = from_dashboard ? " 2.2vh" : " 3vh"
            console.log('row called')
            for(var i = 0; i < number_of_rows; i++){
                rows_array.push(
                    <div style={{gridTemplateColumns: `repeat(${number_of_columns},${spacing})` }} id={i} className={"row-notBS row-"+i}>
                        {seat(i,number_of_columns,numberOfSections)}
                    </div>
                )
            }
            return rows_array
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
            let style = {
                marginTop: from_dashboard ? "2vh" : "",
            }
            let row_size = from_dashboard ? "3vh" : "5vh"
            

            if(i==0 && !this.props.hasOwnProperty('from_dashboard')){ //for row label
                console.log('rows label called bitch ass bitch')
                sections.push(
                    <div className="row-labels">
                        <h4 style={{color:'#f2f2f2'}} className="section-names"> a{/* this is really just a space place holder */}</h4>
                        <div style={{gridTemplateRows: "repeat("+numberOfRows[i]+", "+row_size+")",display:"grid"}}>
                            {row_label(type == "balcony" ? numberOfRows[i]+1 : numberOfRows[i]+1,numberOfColumns[i],i)}
                        </div>
                    </div>
                )    
            }
            sections.push(
                <div>
                    <h4 style={style} className="section-names">{type == "balcony" ? "balcony" : section}</h4>
                    <div style={{gridTemplateRows: "repeat("+numberOfRows[i]+", "+row_size+")"}}className={class_name}>
                        {row(numberOfRows[i],numberOfColumns[i],i)}
                    </div>
                </div>
            )
        }
        return sections
        
    }

    render(){
        return (
            <div>
                {this.props.venue.map((venue)=>{
                    let sections = venue.number_of_sections;
                    let rows = venue.number_of_rows;
                    let columns = venue.number_of_columns;
                    var type = venue.type;
                    //gridTemplateColumns:"repeat("+sections+", 1fr)" old grid template
                    var grid_template_size = ""
                    var from_dashboard = this.props.hasOwnProperty('from_dashboard')

                    if(from_dashboard){
                        if(venue.type == "balcony"){
                            grid_template_size = "18vw 23vw 18vw"
                        }else{
                            grid_template_size = "18vw 23vw 18vw"
                        }                    
                    }else{
                        if(venue.type == "balcony"){
                            grid_template_size = "20px 20vw 30vw 20vw"
                        }else{
                            grid_template_size = "20px 20vw 30vw 20vw"
                        }
                    }
                    return (
                        <div>
                            <div style={{display:"grid",gridTemplateColumns:grid_template_size}}className="clickables-container">
                                {this.renderVenue(sections,rows,columns,type)}
                            </div>
                            <hr />
                        </div>
                    )
                })
                }
            </div>
            
        )
    }
}