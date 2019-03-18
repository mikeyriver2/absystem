import {Modal,Button} from 'react-bootstrap'
import React, { Component } from 'react';
import Axios from 'axios';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';

export default class OrderInfoModal extends Component{
    constructor(){
        super();
        this.state = {
            buyer_first_name: "",
            buyer_last_name: "",
            buyer_email: "",
            buyer_event_day: "",
            paid: false,
            student_id_number: ""

        }
        this.handleVerify = this.handleVerify.bind(this);
        this.renderInfo = this.renderInfo.bind(this);
        this.handleEditInfo = this.handleEditInfo.bind(this);
        this.handleRedirectEdit = this.handleRedirectEdit.bind(this);
    }

    componentDidUpdate(prevProps,prevState){
        if(prevProps.show_ticket_info != this.props.show_ticket_info){
            this.setState({
                buyer_first_name: this.props.ticket_info.buyer_first_name,
                buyer_last_name: this.props.ticket_info.buyer_last_name,
                buyer_email: this.props.ticket_info.buyer_email
            })
        }
    }

    listTickets(tickets){
        let from_tickets = this.props.hasOwnProperty('from_tickets');
        return (
            <table className="table">
                <thead>
                    <tr>
                        <th>ticket id</th>
                        <th>section</th>
                        {
                            from_tickets &&
                            <th>Attendance Status</th>
                        }
                    </tr>
                </thead>
                <tbody>
                    {tickets.map((ticket)=>{
                        return (
                            <tr>
                                <td>{ticket.slug}</td>
                                <td>{ticket.section.name}</td>
                                {from_tickets &&
                                <td>
                                    {ticket.status != "validated" ?
                                        <Button onClick={(e)=>{this.handleVerify(ticket)}} variant="success">Verify Attendance</Button>
                                    :
                                        <div className="verifed-payment">
                                            <img src="/images/checked.svg" />
                                            <span>Attended</span>
                                        </div>
                                    }
                                </td>
                                }
                            </tr>
                        )
                    })
                    }
                </tbody>
            </table>
        )
    }

    handleVerify(ticket){
        Axios.post('/api/dashboard/verify-attendance',ticket).then(res=>{
            this.props.handleVerifyAttendance(this.props.ticket_info)
        })
    }

    renderInfo(ticket){
        return (
            <div>
                <b>Buyer Name:</b>  {`${ticket.buyer_first_name} ${ticket.buyer_last_name}`}  <br/>
                <b>Email Address:</b>  {`${ticket.buyer_email}`} <br/>
                <b>Cell Number:</b>  {`${ticket.buyer_email}`} <br/>
                <b>Event:</b>   {ticket.event.name} <br/>
                <b>Date Chosen:</b> {ticket.event_day.date} <br/>
                <b>Bought Tickets:</b> <br/><br/>
                {this.listTickets(ticket.tickets)}
            </div>
        )
    }

    handleRedirectEdit(){
        return (
        <Link
            to={{
                pathname: "/",
                state:  
                { 
                    fromOrderInfo: true,
                    order: this.props.ticket_info
                }
            }}
        />
        )
    }

    handleEditInfo(e){
        let value = e.target.value;
        let input = e.target.id;
        this.setState({
            [input] : value
        })

    }

    renderEditInfo(ticket){
        let style={
            width: "100%",
            textAlign: "center",
            marginBottom: "15px"
        }
        return (
            <div>
                <b><span>Buyer First Name:</span></b>
                <input id="buyer_first_name" onChange={this.handleEditInfo} type="text" value={this.state.buyer_first_name} class="form-control" placeholder="First Name"/><br/>
                
                <b>Buyer Last Name:</b>
                <input id="buyer_last_name" onChange={this.handleEditInfo} type="text" value={this.state.buyer_last_name} class="form-control" placeholder="Last Name"/><br/>
                
                <b>Email Address:</b>
                <input id="buyer_email" onChange={this.handleEditInfo} type="text" value={this.state.buyer_email} class="form-control" placeholder="Email Address"/><br/>

                <b>Date Chosen:</b> {ticket.event_day.date} <br/><br/>

                <Link
                    to={{
                        pathname: `/dashboard/tickets/ticket/edit/${this.props.ticket_info.id}`,
                        state:  
                        { 
                            fromOrderInfo: true,
                            order: this.props.ticket_info
                        }
                    }}
                >
                <b><Button style={style} variant="primary">Edit Seatings</Button></b>
                </Link>
                {this.listTickets(ticket.tickets)}
            </div>
        )
    }

    renderModal(ticket){
        return (
            <Modal id="ticket-info-modal" show={this.props.show_ticket_info} onHide={this.props.toggle_show}>
            <Modal.Header closeButton>
                <h4>Order ID: {ticket.id}</h4>
            </Modal.Header>
                <Modal.Body>
                    {this.props.edit_mode ? 
                        this.renderEditInfo(ticket)
                        :
                        this.renderInfo(ticket)
                    }
                </Modal.Body>
            </Modal>
            )
    }

    render(){
        var ticket = this.props.ticket_info;
        return (
            <div>
                {this.props.show_ticket_info ? this.renderModal(ticket) : ""}
            </div>
        )
    }
} 