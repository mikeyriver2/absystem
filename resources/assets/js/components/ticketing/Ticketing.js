import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Dropdown,Col,Row} from 'react-bootstrap';
import Singson from './venues/Singson'
import HyundaiHall from './venues/HyundaiHall'
import ConfirmModal from './ConfirmModal'
import AreYouSure from '../miscellaneous/AreYouSure'
import axios from 'axios';

export default class Ticketing extends Component {
    constructor(props){
        super(props);
        this.state = {
            are_you_sure: false,
            venue_name: "",
            venue: [],
            chosen_seats: [],
            chosen_seats_buffer: [], //didn't want to touch original chosen_seats state code too much, hence dis 
            total_price: 0,
            show_order_modal: false,
            dates: [],
            selected_date: "",
            event: {},
            sold_seats: {},
            from_dashboard: false,
            special_seats: []
        }
        this.test = this.test.bind(this);
        this.handleChosenSeats = this.handleChosenSeats.bind(this);
        this.displayOrders = this.displayOrders.bind(this);
        this.removeSeat = this.removeSeat.bind(this);
        this.handleOrder = this.handleOrder.bind(this);
        this.clearOrder = this.clearOrder.bind(this);
        this.handleSetDate = this.handleSetDate.bind(this);
        this.setVenue = this.setVenue.bind(this);
        this.toggleAreYouSure = this.toggleAreYouSure.bind(this);

    }

    componentWillMount(){
        if(this.props.location.state){
            if(this.props.location.state.fromOrderInfo){
                let order = this.props.location.state.order
                let chosen_seats = [];
                order.tickets.map((ticket)=>{
                    chosen_seats.push({
                        date: order.event_day.date,
                        seat_id: ticket.slug,
                        section_name: ticket.section.name,
                        ticket_price: ticket.ticket_price,
                        from_edit: true
                    })
                });
                this.setState({
                    chosen_seats: chosen_seats,
                    from_dashboard: true
                })
            }
        }
    }
    componentDidMount(){
        this.setVenue();
        /*
            sold_seats: {
                date1: [tickets]
                date2: [tickets]
            }
        */
        /*
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
        });
        */
    }

    componentDidUpdate(prevProps, prevState){
        if(prevState.selected_date != this.state.selected_date){
            let edit_mode = this.props.location.state ? this.props.location.state.fromOrderInfo ? true :false : false
            let buffer = prevState.chosen_seats_buffer.splice(0);
            let prev_chosen = prevState.chosen_seats;
            if(buffer.length > 0){
                buffer.map((bufer)=>{
                    if(bufer.selected_date == this.state.selected_date){
                        this.setState({
                            chosen_seats: bufer.chosen_seats
                        })
                    }else{
                        this.setState({
                            chosen_seats: []
                        })
                        buffer.push({
                            selected_date: prevState.selected_date,
                            chosen_seats: prev_chosen
                        })
                    }
                })    
            }else{
                buffer.push({
                    selected_date: prevState.selected_date,
                    chosen_seats: prev_chosen
                })
            }
            this.setState({
                chosen_seats_buffer: buffer
            });
        }
        //https://github.com/facebook/react/issues/2914 || in regards to my issue of prevstate and this.state being the same
        //IMPORTANCE OF CLONING ELEMENT FIRST
        //https://medium.freecodecamp.org/handling-state-in-react-four-immutable-approaches-to-consider-d1f5c00249d5

        //good habit of including prevState when setting state -> https://teamtreehouse.com/community/react-docs-now-recommends-using-function-with-prevstate-inside-of-setstate
        if(prevState.chosen_seats.length != this.state.chosen_seats.length){
            var total_price = 0;
            this.state.chosen_seats.map((seat)=>{
                total_price += seat.ticket_price;
            })          
            this.setState((prevState)=>({
                total_price: total_price
            }));
        }
    }

    toggleAreYouSure(){
        this.setState({
            are_you_sure: !this.state.are_you_sure
        })
    }

    setVenue(){
        let edit_mode = this.props.location.state ? this.props.location.state.fromOrderInfo ? true :false : false
        let array = [];
        var venue_object = {
            venue_name: "",
            venue: []
        }
        var sold_seats = {}

        axios.get('/ticketing/venue').then(res=>{
            venue_object.venue_name = res.data.venue.name;
            venue_object.special_seats = [];
            res.data.section_types.map((type)=>{
                venue_object.venue.push({
                    type: type.type,
                    number_of_sections: 0,
                    number_of_rows: [],
                    number_of_columns: [],
                    section_order: [],
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

            let fromOrderInfo;
            if(this.state.from_dashboard){
                fromOrderInfo = this.props.location.state.order
                let flattened = fromOrderInfo.tickets.map((ticket)=>{
                    return ticket.slug
                })
                let new_array = sold_seats[fromOrderInfo.event_day.date].filter((ticket,index)=>{
                    return flattened.indexOf(ticket) < 0;
                })
                // console.log(flattened);
                // console.log(new_array);
                sold_seats[fromOrderInfo.event_day.date] = new_array;
            }

            this.setState({
                sold_seats: sold_seats,
                dates:array,
                venue_name: venue_object.venue_name,
                venue: venue_object.venue,
                event: res.data.venue.event,
                selected_date: edit_mode ? this.props.location.state.order.event_day.date : array[0],
                special_seats: venue_object.special_seats
            })
        })
    }

    clearOrder(){
        this.setVenue();
        this.setState({
            chosen_seats: [],
            total_price: 0,
            selected_date: ""
        })
        setTimeout(()=>{
            this.setState({
                show_order_modal: false
            })
        },5000)
    }

    handleOrder(){
        var show = false
        if(!this.state.show_order_modal){
            show = true
        }
        this.setState({
            show_order_modal: show
        })
    }


    handleChosenSeats(seat){
        var chosen_seats = this.state.chosen_seats.slice(0); //slice is needed to CLONE the array. If using the same array referened as the state will not be recognized as prevState
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
        var chosen_seats = this.state.chosen_seats;
        const seats = [];
        chosen_seats.map((seat)=>{
            var bool = false
            seats.map((seet,index)=>{
                if(seet.section_name == seat.section_name){
                    bool = true
                    seats[index].total_price += seat.ticket_price
                    seats[index].total_amount += 1
                }
            })
            if(!bool){
                seats.push({
                    section_name: seat.section_name,
                    total_price: seat.ticket_price,
                    total_amount: 1,
                })
            }
        })
        
        const sale_container = (seat) => {
            return (
                <div className="sale-container">
                    <span className="sale-ticket-section">{`${seat.total_amount}x ${seat.section_name}`}</span>
                    <span className="total-price">P{seat.total_price}.00</span>
                </div>
        )}
        
        seats.map((seat)=>{
            sales_htmls.push(sale_container(seat))
        })

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

    handleSetDate(e){
        this.setState({
            selected_date: e
        })
        let edit_mode = this.props.location.state ? this.props.location.state.fromOrderInfo ? true :false : false;
        if(edit_mode){
            alert(`You've changed your date to ${e}`);            
        }
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

    changeDateFormat(dateTime){
        let unixTime = Date.parse(dateTime);
        let newDateTimeFormat = new Date(unixTime)
        let explodedTime = newDateTimeFormat.toString().split(" ");
        let dateArray =  explodedTime.filter((date,index) => {
            return index < 5;
        });
        return dateArray.join(" ");
    }

    render() {
        var window_width = window.innerWidth+"px";
        var window_height = window.innerHeight+"px";
        var number_of_columnSection = [10,13,10] //# of items must match number of sections
        var number_of_rowSection = [4,5,4] //same rule
        var numberOfSections = 3;
        var numberOfRows = 15;
        let edit_mode = this.props.location.state ? this.props.location.state.fromOrderInfo ? true :false : false
        let orders_from_edit = edit_mode ? this.props.location.state.fromOrderInfo : {}
        return (
            <div className="container-vanilla">
                <div className="ticket-module">
                    <div className="ticket-module-head">
                        <div className="date-dropdown">
                            <Dropdown onSelect={(e)=>{this.handleSetDate(e)}}>
                                <Dropdown.Toggle id="dropdown-date">
                                    <div className="dropdown-container">
                                        <img src="/images/clapperboard.png"/>
                                        {this.state.selected_date == "" ?
                                            <span>Select Reservation Date</span>
                                            :
                                            <span>{this.changeDateFormat(this.state.selected_date)}</span>
                                        }
                                    </div>
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    {this.state.dates.map((date,index)=>{
                                        return <Dropdown.Item eventKey={date}>{this.changeDateFormat(date)}</Dropdown.Item>
                                    })
                                    }
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className="concert-detail">
                            <Row>
                                <Col md={3} className="abs-logo">
                                    <img src="/images/ABS_Full-Logo_Circle.png"/>
                                </Col>
                                <Col md={9} className='concert-title'>
                                    YEAR-END CONCERT 2019: ANIMA
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
                            {/*<div className="total-price">*/}
                                <hr style={{margin:"10px 1vw"}} className="summary-hr"/>
                                <span onClick={this.state.chosen_seats.length > 0 && this.clearOrder} className="clear-order">Clear Orders</span>
                                <div className="price"><b>P{this.state.total_price}.00</b></div>
                                <div className="btn-container">
                                    {this.state.chosen_seats.length > 0 ?
                                        <button style={{left: edit_mode ? "6%" : ""}}onClick={this.handleOrder} className="btn btn-default">
                                            {edit_mode ? <b>Confirm Seat Change</b> : <b>Order Now</b>}
                                        </button>
                                    :
                                        <button className="btn btn-default" disabled>
                                            <b>Order Now</b>
                                        </button>
                                    }
                                </div>
                            {/*</div>*/}
                        </div>
                    </div>
                </div>
                <div style={{maxHeight:window_height}} className="venue">
                    <div className="stage-container">
                        <div className="seat-previews"> 
                            <h4 style={{marginTop: "20px",marginRight:"20px",display:'inline-block'}}>LEGEND:</h4>
                            <div className="seat-prev-item">
                                <span>Taken</span>
                                <div className="seat seat-taken">
                                    
                                </div>
                            </div>
                            <div md={4} className="seat-prev-item">
                                <span>Selected Seat</span>
                                <div className="seat seat-reserved">
                                    
                                </div>
                            </div>
                            <div md={4} className="seat-prev-item">
                                <span>VIP</span>
                                <div className="seat vip">
                                    
                                </div>
                            </div>
                        </div>
						<div className="stage">
                            STAGE
                        </div>
                    </div>
                    <div className="clickables">
                        <Singson 
                            venue = {this.state.venue}
                            handleChosenSeats = {this.handleChosenSeats}
                            chosen_seats = {this.state.chosen_seats}
                            chosen_date = {this.state.selected_date}
                            sold_seats = {this.state.sold_seats}
                            edit_mode = {edit_mode}
                            orders_from_edit = {orders_from_edit}
                            special_seats = {this.state.special_seats}
                        /> 
                        {/*<HyundaiHall 
                            venue = {this.state.venue}
                            handleChosenSeats = {this.handleChosenSeats}
                            chosen_seats = {this.state.chosen_seats}
                            chosen_date = {this.state.selected_date}
                            sold_seats = {this.state.sold_seats}
                            edit_mode = {this.props.location.state ? this.props.location.state.fromOrderInfo ? true :false : false}
                        />*/}
                    </div>
                        {/*this.test()*/}
                </div>
                <ConfirmModal 
                    show_order_modal = {this.state.show_order_modal}
                    show_order_modal_fnc = {this.handleOrder}
                    clearOrder = {this.clearOrder}
                    chosen_seats = {this.state.chosen_seats}
                    chosen_date = {this.state.selected_date}
                    event = {this.state.event}
                    edit_mode = {edit_mode}
                    orders_from_edit = {orders_from_edit}
                    order_to_edit = {edit_mode ? this.props.location.state.order : null}
                />
                <AreYouSure
                    show = {this.state.are_you_sure}
                    toggle = {this.toggleAreYouSure}
                />
            </div>
        );
    }
}

