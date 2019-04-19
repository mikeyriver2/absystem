import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Dropdown,Col,Row, Modal} from 'react-bootstrap';
import Singson from './venues/Singson'
import Loader from '../miscellaneous/LoadAnimation'
import axios from 'axios';
import {Redirect} from 'react-router-dom';

export default class ConfirmModal extends Component{
    constructor(){
        super();
        this.state={
            loading:false,
            thanks:false,
            first_name: "",
            last_name: "",
            email: "",
            cell_number: "",
            id_number: "",
            year_course: "",
            error: false, //there is network error
            show_new_tickets: false,
            new_tickets: [],
            valid_email: true,
            valid_cell: true,
            valid_student_id: true
        }
        this.toggleLoading = this.toggleLoading.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.submitOrder = this.submitOrder.bind(this);
        this.renderConfirm = this.renderConfirm.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.renderNewTickets = this.renderNewTickets.bind(this);
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.show_order_modal){
            setTimeout(()=>{
                document.getElementById('submit-order').disabled = true
            },10)
        }
    }

    componentDidUpdate(prevProps,prevState){
        console.log('Calling');
        try{
                if ((this.state.valid_student_id || !/\S/.test(this.state.id_number))  && this.state.valid_email && (this.state.valid_cell || !/\S/.test(this.state.cell_number)) && /\S/.test(this.state.first_name) && /\S/.test(this.state.last_name) && /\S/.test(this.state.email)){
                        document.getElementById('submit-order').disabled = false
                }else{
                    document.getElementById('submit-order').disabled = true
                }
        }catch(error){

        }
        
    }

    toggleLoading(){
        if(!this.state.loading){
            this.setState({
                loading:true
            })
        }else{
            this.setState({
                loading:false
            })
        }
    }

    submitOrder(e){
        //if(!this.state.error || this.state.error == "false"){
            setTimeout(()=>{ //gotta settime out because it's null right upon click for some reason
                document.getElementById('submit-order').disabled = true
            },10)
            this.toggleLoading();
            var params = {
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                email: this.state.email,
                cell_number: this.state.cell_number,
                id_number: this.state.cell_number,
                year_course: this.state.year_course,
                chosen_seats: this.props.chosen_seats,
                selected_date: this.props.chosen_date,
                event: this.props.event
            }
            axios.post('/ticketing/orderTicket',params).then(res=>{
                this.setState({
                    thanks: true,
                    last_name: "",
                    email: "",
                    cell_number: "",
                    id_number: 0,
                    year_course: "",
                    valid_email: true,
                    valid_cell: true,
                    valid_student_id: true,
                })
                this.toggleLoading();
                setTimeout(()=>{ 
                    document.getElementById('submit-order').disabled = false
                },10)
                this.props.clearOrder()
                setTimeout(()=>{
                    this.setState({
                        thanks: false,
                        first_name: "",
                    })
                },5000)
            }).catch(error=>{
                this.setState({
                    error: true,
                    thanks: true,
                    last_name: "",
                    email: "",
                    cell_number: "",
                    id_number: 0,
                    year_course: "",
                    valid_email: true,
                    valid_cell: true,
                    valid_student_id: true,
                    error: true //there is error
                })
                this.toggleLoading();
                setTimeout(()=>{ 
                    document.getElementById('submit-order').disabled = false
                },10)
                this.props.clearOrder()
                setTimeout(()=>{
                    this.setState({
                        thanks: false,
                        first_name: "",
                        error: false
                    })
                },10000)
            })
        //}
    }

    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    validateCell(cell){ //only checks if string ONLY contains numbers
        var isnum = /^\d+$/.test(cell);
        return isnum;
    }

    validateStudentId(student_id){
        let bool = this.validateCell(student_id);
        return (bool && student_id.length == 6);
    }

    handleChange(e,type=null){
        var value = e.target.value
        var name = e.target.name;
        switch(name){
            case "first_name":
                this.setState({first_name: value});
                break;
            case "last_name":
                this.setState({last_name: value});
                break;
            case "email":
                let valid_email = this.validateEmail(value);
                this.setState({
                    email: value,
                    valid_email: valid_email
                });
                break;
            case "cell":
                let valid_cell = this.validateCell(value);
                this.setState({
                    cell_number: value,
                    valid_cell: valid_cell
                });
                break;
            case "id_number":
                let valid_student_id = this.validateStudentId(value)
                this.setState({
                    id_number: value,
                    valid_student_id: valid_student_id
                });
                break;
            case "year_course":
                this.setState({year_course: value});
                break;
        }
    }

    renderInputs(){
        let total = 0;
        if(this.props.hasOwnProperty('chosen_seats')){
            this.props.chosen_seats.map((seat)=>{
                total += seat.ticket_price
            })
        }
        return(
            <div>
                <div className="note">
                    <b>*</b> <small>required</small>
                </div>
                <div className="form-span first-name">
                    <span>First Name*</span>
                    <input name="first_name" onChange={this.handleChange} type="text" required></input>
                </div>
                <div className="form-span last-name">
                    <span>Last Name*</span>
                    <input name="last_name" onChange={this.handleChange} type="text" required></input>
                </div>
                <div className="form-span email">
                    <span>Email Address*</span>
                    <div>
                        <input name="email" onChange={e=>this.handleChange(e,'email')} type="text" required></input><br/>
                        {!this.state.valid_email && <small>Please enter a valid email</small>}
                    </div>
                </div>
                <div className="form-span cell">
                    <span>Cellphone Number:</span>
                    <div>
                        <input name="cell" onChange={e=>this.handleChange(e,'cell')} type="text"></input><br/>
                        {!this.state.valid_cell && <small>Numbers only</small>}
                    </div>
                </div>
                <div className="form-span-two">
                    <div className="id_number">
                        <span>ID Number</span>
                       
                            <input name="id_number" onChange={this.handleChange} type="text"></input><br/>
                            {!this.state.valid_student_id && <small>Please enter a valid Ateneo ID Number</small>}
                       
                    </div>
                    <div className="id_number">
                        <span>Year and Course</span>
                        <input name="year_course" onChange={this.handleChange} type="text"></input>
                    </div>
                </div>
                <div className="total-confirm-modal">
                    <h6>TOTAL:</h6><span><b>P{total.toLocaleString()}.00</b></span>
                </div>
                <button id="submit-order" onClick={this.submitOrder} className="confirm-button btn btn-primary">
                    {!this.state.loading ? "Confirm Order" : <Loader />}
                </button>
            </div>
        )
    }

    renderThankYou(){
        return (
            <div className="thanks">
                <h5>THANK YOU FOR YOUR PURCHASE, {this.state.first_name}</h5>
                <p>We hope to heir duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations </p>
                <h5>ENJOY THE SHOW!</h5>
            </div>
        )
    }

    handleEdit(){
        this.setState({
            loading: true
        })
        let params = {
            new_chosen_seats: this.props.chosen_seats,
            order: this.props.order_to_edit
        }
        axios.put("/dashboard/edit/seats",params).then((res)=>{
            this.setState({
                new_tickets: res.data,
                show_new_tickets: true
            })
            //window.location.href = window.location.host+"/dashboard";
        })
    }

    renderNewTickets(){
        let tickets = this.state.new_tickets.tickets
        return (
            <div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>ticket id</th>
                            <th>section</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map((ticket)=>{
                            return (
                                <tr>
                                    <td>{ticket.slug}</td>
                                    <td>{ticket.section.name}</td>
                                </tr>
                            )
                        })
                        }
                    </tbody>
                </table>
            </div>
        )
    }

    renderConfirm(){
        let style = {
            display: "flex",
            justifyContent: "center",
            marginTop: "2vh"
        }
        return (
            <div className="confirm-container">
                <div className="confirm-message">
                    Please consult with an executive officer before proceeding. Confirm?
                </div>
                <div onClick={this.handleEdit}className="ok">
                    <button style={style} class="btn btn-light">
                        {!this.state.loading ? "Change my god damn seat bitch :)" : <Loader />}
                    </button>    
                </div>
            </div>
        )
    }

    renderError(){
        return (
            <div>
                Something went wrong :( . Please refresh the page and try again. Sorrrryyyyyyy.<br/>
                Most Likely cause: already existing ticket in database. Please choose another seat 
            </div>
        )
    }

    redirectBack(){
        window.location.href = window.location.origin+"/dashboard/tickets";
    }

    render(){
        let edit_mode = this.props.edit_mode;
        let show_new_tickets = this.state.show_new_tickets;
        return (
        <Modal id="confirm-order-modal" show={this.props.show_order_modal} onHide={show_new_tickets ? this.redirectBack : this.props.show_order_modal_fnc}>
          <Modal.Header closeButton>
            {this.state.error ? <h4 style={{color:"red"}}>Internal Error</h4> : show_new_tickets ? <h4>Summary of New Seats</h4> : edit_mode ? <h4>Confirm Seat Changes</h4> : <h4>Contact Information</h4>}
          </Modal.Header>
            <Modal.Body closeButton>    
                {this.state.error ? this.renderError() : show_new_tickets ? this.renderNewTickets() : !edit_mode ? !this.state.thanks ? this.renderInputs() : this.renderThankYou() : this.renderConfirm()}
            </Modal.Body>
        </Modal>
        )

        
    }
}