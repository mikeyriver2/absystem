import {Modal,Button} from 'react-bootstrap'
import React, { Component } from 'react';
import Axios from 'axios';

export default class OrderInfoModal extends Component{
    constructor(){
        super();
        this.state = {

        }
        this.handleVerify = this.handleVerify.bind(this);
    }

    listTickets(tickets){
        return (
            <table className="table">
                <thead>
                    <tr>
                        <th>ticket id</th>
                        <th>section</th>
                        <th>Attendance Status</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.map((ticket)=>{
                        return (
                            <tr>
                                <td>{ticket.slug}</td>
                                <td>{ticket.section.name}</td>
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

    renderModal(ticket){
        return (
            <Modal id="ticket-info-modal" show={this.props.show_ticket_info} onHide={this.props.toggle_show}>
            <Modal.Header closeButton>
                <h4>Order ID: {ticket.id}</h4>
            </Modal.Header>
                <Modal.Body>
                    <b>Buyer Name:</b>  {`${ticket.buyer_first_name} ${ticket.buyer_last_name}`}  <br/>
                    <b>Email Address:</b>  {`${ticket.buyer_email}`} <br/>
                    <b>Cell Number:</b>  {`${ticket.buyer_email}`} <br/>
                    <b>Event:</b>   {ticket.event.name} <br/>
                    <b>Date Chosen:</b> {ticket.event_day.date} <br/>
                    <b>Bought Tickets:</b> <br/><br/>
                        {this.listTickets(ticket.tickets)}
                    
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