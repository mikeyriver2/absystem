import {Row, Col} from 'react-bootstrap'
import React, { Component } from 'react';

export default class Singson extends Component{
    constructor(props){
        super(props)
        this.state = {

        }
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
        var from_dashboard = this.props.hasOwnProperty('from_dashboard')

        
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
                var style={
                    height: from_dashboard ? "2.5vh" : ""
                }
                seats.push(
                    <div id={section+"-"+row+(i+1)} style={style} onClick={this.handleSeatClick} className={class_name}>
                        {/*"r"+row_number+"-s"+i+" "*/}
                        {/*section+"-"+row+(i+1)*/}
                    </div>
                )
            }
            return seats
        }

        const row = (number_of_rows,number_of_columns,numberOfSections) => {
            var rows = [];
            var spacing = from_dashboard ? " 2.2vh" : " 3vh"
            for(var i = 0; i < number_of_rows; i++){
                rows.push(
                    <div style={{gridTemplateColumns: `repeat(${number_of_columns},${spacing})` }}className={"row-notBS row-"+i}>
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
            let style = {
                marginTop: from_dashboard ? "2vh" : ""
            }
            let row_size = from_dashboard ? "3vh" : "5vh"
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
                            grid_template_size = "20vw 30vw 20vw"
                        }else{
                            grid_template_size = "20vw 30vw 20vw"
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