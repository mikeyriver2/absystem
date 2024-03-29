import {Row, Col, OverlayTrigger, Popover} from 'react-bootstrap'
import React, { Component } from 'react';
import axios from 'axios';

export default class HyundaiHall extends Component{
    constructor(props){
        super(props)
        this.state = {
            price: {
                ol: 350.00,
                vip: 500.00,
                or: 350.00
            },
            adjust_seats: { //show number of seats per row (each index represents 1 row)
                ol: [7,7,7,8,8,9,9,9,10,10,10,11,11,11],
                vip: [14,14,14,14,14,14,14,14,14,14,14,13,13,14],
                or: [7,7,7,8,8,9,9,9,10,10,10,11,11,11]
            },
            venue: [] //re-arranged section (if needed)
        }
        this.handleSeatClick = this.handleSeatClick.bind(this)
    }

    componentWillReceiveProps(nextProps){
        //this.reArrangeSeats(nextProps)
    }


    reArrangeSeats(){
         //code to rearrange seats. Fixed in backend side instead. Could be unnecessarily taxing on front end side
        /*var proper_order = {
            balcony: ["Balcony Left","Balcony Center","Balcony Right"],
            ground_floor: ["Orchestra Left","Orchestra Center","Orchestra Right"]
        }
        var cloned_venue = nextProps.venue.slice(0)

        nextProps.venue.map((venue,parent_index)=>{
            for(var key in proper_order){
                if(key == venue.type){
                    console.log('asd')
                    var swap_obj = {}
                    proper_order[key].map((section,index_of_proper)=>{
                        var bool_index = (index_of_proper == venue.section_order.indexOf(section)) //check if section_order index is same as proper_order
                        if(!bool_index){
                            var index_to_swap = venue.section_order.indexOf(section)
                            cloned_venue[parent_index].section_order[index_of_proper] = section;
                        }
                    })
                }
            }
        })

        this.setState({
            venue: cloned_venue
        })
        */
    }


    componentDidUpdate(prevProps){
        let from_dashboard = this.props.hasOwnProperty('from_dashboard');
        if(!from_dashboard){
            if(prevProps.chosen_seats){ //handle delete from ticketing component (original code)
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
                            document.getElementById(seat.seat_id).classList.add('seat-not-taken');                
                        } 
                    })
                }
            }
            //incoming weird ass code
            if((prevProps.chosen_seats[0] && !this.props.chosen_seats[0]) || //handle on selected seat based on date
            (!prevProps.chosen_seats[0] && this.props.chosen_seats[0])){
                console.log(prevProps.chosen_seats);
                console.log(this.props.chosen_seats);
                prevProps.chosen_seats.map((seat)=>{
                    document.getElementById(seat.seat_id).classList.remove('seat-reserved');
                    document.getElementById(seat.seat_id).classList.add('seat-not-taken');
                });
                this.props.chosen_seats.map((seat)=>{
                    document.getElementById(seat.seat_id).classList.add('seat-reserved');
                    document.getElementById(seat.seat_id).classList.remove('seat-not-taken');
                })
            }

            else if(prevProps.chosen_seats[0] && this.props.chosen_seats[0]){
                if(prevProps.chosen_seats[0].date != this.props.chosen_seats[0].date){
                    prevProps.chosen_seats.map((seat)=>{
                        document.getElementById(seat.seat_id).classList.remove('seat-reserved');
                        document.getElementById(seat.seat_id).classList.add('seat-not-taken');
                    });
                    this.props.chosen_seats.map((seat)=>{
                        document.getElementById(seat.seat_id).classList.add('seat-reserved');
                        document.getElementById(seat.seat_id).classList.remove('seat-not-taken');
                    })
                }
            }
        }else{
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
                            document.getElementById(seat.seat_id).classList.add('seat-not-taken');                
                        } 
                    })
                }
            }
        }
    }

    renderSeatPopOver(e,status){
        //if(status == "sold"){
            this.props.getOrderInfo(e.target.id)
        //}
        /*return(
            <Popover id="popover-seat-info">
                {section+row+column_number}{status != "free"  && <div onClick={e => {this.props.getOrderInfo(section+row+column_number)}}><a href="#">View Order</a></div>}
            </Popover>
        )*/
    }

    handleSeatClick(e){
        var class_name = e.target.className;
        var id = e.target.id
        var section_name = "";
        var ticket_price = 350;
        var status = class_name.split(" ");
        var seat_exists = false;
        
        if(this.props.sold_seats[this.props.chosen_date]){
            if(this.props.sold_seats[this.props.chosen_date].includes(id)){
                seat_exists = true
            }
        }
        
        if(!this.props.hasOwnProperty('from_dashboard') && !seat_exists){
            if(id.includes('OL')){
                section_name = "Orchestra Left"
            }else if(id.includes('OR')){
                section_name = "Orchestra Right"
            }else if(id.includes('VIP')){
                section_name = "VIP"
                ticket_price = 500;
            }else if(id.includes('BEOL')){
                section_name = "Balcony Left"
                ticket_price = 250;
            }else if(id.includes('BEOC')){
                section_name = "Balcony Center"
                ticket_price = 250;
            }else if(id.includes('BEOR')){
                section_name = "Balcony Right"
                ticket_price = 250;
            }else if(id.includes('LO')){
                section_name = "Poor"
                ticket_price = 150;
            }

            var seat = {
                section_name: section_name,
                seat_id: id,
                ticket_price: ticket_price,
                date: this.props.chosen_date
            }
            
            this.props.handleChosenSeats(seat);

            if(status.includes("seat-not-taken")){
                document.getElementById(e.target.id).classList.add('seat-reserved');
                document.getElementById(e.target.id).classList.remove('seat-not-taken');
            }else if(status.includes("seat-reserved")){
                document.getElementById(e.target.id).classList.remove('seat-reserved');
                document.getElementById(e.target.id).classList.add('seat-not-taken');
            }
        }else{
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
            var sections = ['OL','VIP','OR'];
            var sections_behind = ['BEOL','BEOC','BEOR'];
            var sections_loners = ['LO'];
            var section = "";
            var selected_date = this.props.chosen_date;
            let status = "";

            if(type == "ground_floor_behind"){
                section = sections_behind[section_number];
            }else if(type == "ground_floor_long_ass_row"){
                section = sections_loners[section_number];
            }else{
                section = sections[section_number];
            }
            var row = rows[row_number];
            for(var i = 0; i < number_of_seats; i++){
                let class_name = "seat"
                if(this.props.sold_seats[selected_date]){
                    if(this.props.sold_seats[selected_date].includes(section+row+(i+1))){
                        if(this.props.edit_mode){
                            let chosen_seats = this.props.chosen_seats.map((seat)=>{
                                return seat.seat_id
                            });
                            let being_edit = false;
                            if(chosen_seats.includes(section+row+(i+1))){
                                being_edit = true
                            }
                            if(!being_edit){
                                class_name+=" seat-taken"
                                status = "sold"
                            }else{
                                class_name+=" seat-reserved editing"
                            }
                        }else{
                            class_name+=" seat-taken"
                            status = "sold"
                        }
                    }else{
                        class_name+=" seat-not-taken"
                        status = "free"
                    }
                }else{
                    class_name+=" seat-not-taken"
                    status = "free"
                }
                var style={
                    height: from_dashboard ? "2.5vh" : "",
                    cursor: from_dashboard ? "pointer" : ""
                }
                seats.push(
                    from_dashboard ?
                        // <OverlayTrigger 
                        //     placement="top"
                        //     trigger="click" 
                        //     overlay={e=>{this.renderSeatPopOver(section,row,i+1,status)}}
                        // >
                            <div onClick={(e)=>{this.renderSeatPopOver(e,status)}} id={section+row+(i+1)} style={style} className={class_name}>
                            
                            </div>
                        //</OverlayTrigger>
                    :
                        <div id={section+row+(i+1)} style={style} onClick={this.handleSeatClick} className={class_name}>
                            {!this.props.hasOwnProperty('from_dashboard') ? i+1 : ""}
                        </div>
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
            let index_type = 0;
            let gap = "";
            if(type == "ground_floor_behind"){
                index_type = 1;
            }if (type == "ground_floor_long_ass_row"){
                gap = "3px";
            }
            let abbreviation = this.props.venue[0].section_order[numberOfSections];
            var rows_array = [];
            var spacing = from_dashboard ? " 2.2vh" : " 20px"
            for(var i = 0; i < number_of_rows; i++){
                let new_number_of_columns;
                if(type != "ground_floor_behind" && type != "ground_floor_long_ass_row"){
                    if(abbreviation ==  "Orchestra Left"){
                        number_of_columns = this.state.adjust_seats.ol[i]
                    }else if(abbreviation ==  "VIP"){
                        number_of_columns = this.state.adjust_seats.vip[i]
                    }else if(abbreviation ==  "Orchestra Right"){
                        number_of_columns = this.state.adjust_seats.or[i]
                    }
                }
                //let columns = new_number_of_columns;
                rows_array.push(
                    <div style={{gridColumnGap: gap, gridTemplateColumns: `repeat(${number_of_columns},${spacing})` }} id={i} className={"row-notBS row-"+i}>
                        {seat(i,number_of_columns,numberOfSections)}
                    </div>
                )
            }
            return rows_array
        }

        for(var i = 0; i < numberOfSections; i++){
            var section = " "
            if(type == "ground_floor"){
                if(i == 0){
                    section = "ol"
                }else if(i == 1){
                    section = "vip"
                }else{
                    section = "or"
                }
            }else if (type == "ground_floor_behind"){
                if(i == 0){
                    section = "bol"
                }else if(i == 1){
                    section = "bvip"
                }else{
                    section = "bor"
                }
            }else if (type == "ground_floor_long_ass_row"){
                if(i == 0){
                    section = "loners"
                }
            }

            var class_name = "section section-"+section
            let style = {
                marginTop: from_dashboard ? "2vh" : "",
            }
            let row_size = from_dashboard ? "3vh" : "5vh"
            

            if(i==0 && !this.props.hasOwnProperty('from_dashboard')){ //for row label
                sections.push(
                    <div className="row-labels">
                        <h4 style={{color:'#f2f2f2'}} className="section-names"> a{/* this is really just a space place holder */}</h4>
                        <div style={{gridTemplateRows: "repeat("+numberOfRows[i]+", "+row_size+")",display:"grid"}}>
                            {row_label(type == "balcony" ? numberOfRows[i]+1 : numberOfRows[i]+1,numberOfColumns[i],i)}
                        </div>
                    </div>
                )    
            }

            let align =  "center";
            if(type != "ground_floor_behind"){
                if(i == 0){
                    align = "right";
                }else if (i == 2){
                    align = "left";
                }
            }else if(type == "ground_floor_long_ass_row"){
                align = "center"
            }else{
                align = "";
            }

            sections.push(
                <div>
                    <h4 style={style} className="section-names">{type == "balcony" ? "balcony" : section}</h4>
                    <div style={{justifyItems: align, gridTemplateRows: "repeat("+numberOfRows[i]+", "+row_size+")"}}className={class_name}>
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
                        }else if(venue.type == "ground_floor_long_ass_row"){
                            grid_template_size = "20px 69vw"
                        }
                        else{
                            grid_template_size = "20px 20vw 30vw 20vw"
                        }
                    }
                    return (
                        <div>
                            <div style={{display:"grid",gridTemplateColumns:grid_template_size}}className="clickables-container">
                                {this.renderVenue(sections,rows,columns,type)}
                            </div>
                        </div>
                    )
                })
                }
            </div>
            
        )
    }
}