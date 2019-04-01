import {Modal,Button, Dropdown} from 'react-bootstrap'
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
            student_id_number: "",
            show_saved_icon: false

        }
        this.handleVerify = this.handleVerify.bind(this);
        this.renderInfo = this.renderInfo.bind(this);
        this.handleEditInfo = this.handleEditInfo.bind(this);
        this.handleRedirectEdit = this.handleRedirectEdit.bind(this);
        this.handleSetPaid = this.handleSetPaid.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }

    componentWillUnmount(){
        this.setState({
            show_saved_icon: false
        })
    }

    componentDidUpdate(prevProps,prevState){
        if(prevProps.show_ticket_info != this.props.show_ticket_info){
            this.setState({
                buyer_first_name: this.props.ticket_info.buyer_first_name,
                buyer_last_name: this.props.ticket_info.buyer_last_name,
                buyer_email: this.props.ticket_info.buyer_email,
                paid: this.props.ticket_info.paid
            })
        }
    }

    listTickets(tickets){
        let from_tickets = this.props.hasOwnProperty('from_tickets');
        let edit_mode = this.props.edit_mode;
        return (
            <table className="table">
                <thead>
                    <tr>
                        <th>ticket id</th>
                        <th>section</th>
                        {
                            (from_tickets && !edit_mode) &&
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
                                {(from_tickets && !edit_mode) &&

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

    handleSetPaid(value){
        console.log(value);
        this.setState({
            paid: value
        })
    }

    handleEditSubmit(e){
        e.preventDefault();
        let params = {
            order_id: this.props.ticket_info.id,
            first_name: this.state.buyer_first_name,
            last_name: this.state.buyer_last_name,
            email: this.state.buyer_email,
            paid: this.state.paid
        }
        Axios.put('/api/dashboard/edit/order',params).then(()=>{
            this.setState({
                show_saved_icon: true
            },()=>{
                this.props.handleVerifyAttendance(this.props.ticket_info)
            })
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
                <form>
                <b><span>Buyer First Name:</span></b>
                <input id="buyer_first_name" onChange={this.handleEditInfo} type="text" value={this.state.buyer_first_name} class="form-control" placeholder="First Name"/><br/>
                
                <b>Buyer Last Name:</b>
                <input id="buyer_last_name" onChange={this.handleEditInfo} type="text" value={this.state.buyer_last_name} class="form-control" placeholder="Last Name"/><br/>
                
                <b>Email Address:</b>
                <input id="buyer_email" onChange={this.handleEditInfo} type="text" value={this.state.buyer_email} class="form-control" placeholder="Email Address"/><br/>

                <b>Date Chosen:</b> {ticket.event_day.date} <br/>

                <b>Paid Status:</b> 
                <Dropdown className="edit-dropdown" onSelect={(e)=>{this.handleSetPaid(e)}}>
                    <Dropdown.Toggle>
                        {this.state.paid == 1 ? <span>Paid</span> : <span>Not Paid</span>}    
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item eventKey={1}>Paid</Dropdown.Item>
                        <Dropdown.Item eventKey={0}>Not Paid</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown> {!this.state.show_saved_icon && <br/>}

                {this.state.show_saved_icon &&
                    <div>
                        <h4 style={{textAlign: "center", marginBottom: "15px", color:"green"}}>Saved :)</h4>
                    </div>
                }

                <b><Button type="submit" onClick={e=>{this.handleEditSubmit(e)}} style={style} variant="primary">Save Changes</Button></b>
                <b><Button type="submit" style={style} variant="danger">Delete Order</Button></b>

                </form>
                {this.listTickets(ticket.tickets)}

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
            </div>
        )
    }

    hideModal(){
        this.setState({
            show_saved_icon: false
        },()=>{
            this.props.toggle_show()
        })
        
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