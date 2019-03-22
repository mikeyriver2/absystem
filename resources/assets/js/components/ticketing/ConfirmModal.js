import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Dropdown,Col,Row, Modal} from 'react-bootstrap';
import Singson from './venues/Singson'
import Loader from '../miscellaneous/LoadAnimation'
import axios from 'axios';

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
            id_number: 0,
            year_course: "",
            error: true //there is error
        }
        this.toggleLoading = this.toggleLoading.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.submitOrder = this.submitOrder.bind(this);
        this.renderConfirm = this.renderConfirm.bind(this);
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.show_order_modal){
            setTimeout(()=>{
                document.getElementById('submit-order').disabled = true
            },10)
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

    submitOrder(){
        if(!this.state.error || this.state.error == "false"){
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
            axios.post('/api/ticketing/orderTicket',params).then(res=>{
                this.setState({
                    thanks: true,
                    last_name: "",
                    email: "",
                    cell_number: "",
                    id_number: 0,
                    year_course: "",
                    error: true //there is error
                })
                this.toggleLoading();
                this.props.clearOrder()
                setTimeout(()=>{
                    this.setState({
                        thanks: false,
                        first_name: "",
                    })
                },5000)
            }).catch(error=>{

            })
        }

        
    }

    handleChange(e){

        if (/\S/.test(this.state.first_name) && /\S/.test(this.state.last_name) && /\S/.test(this.state.email)){
            this.setState({error:false},()=>{
                document.getElementById('submit-order').disabled = false
            })
        }else{
            this.setState({error:true})
            document.getElementById('submit-order').disabled = true
        }

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
                this.setState({email: value});
                break;
            case "cell":
                this.setState({cell_number: value});
                break;
            case "id_number":
                this.setState({id_number: value});
                break;
            case "year_course":
                this.setState({year_course: value});
                break;
        }
    }

    renderInputs(){
        return(
            <div>
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
                    <input name="email" onChange={this.handleChange} type="text" required></input>
                </div>
                <div className="form-span cell">
                    <span>Cellphone Number:</span>
                    <input name="cell" onChange={this.handleChange} type="text"></input>
                </div>
                <div className="form-span-two">
                    <div className="id_number">
                        <span>ID Number</span>
                        <input name="id_number" onChange={this.handleChange} type="text"></input>
                    </div>
                    <div className="id_number">
                        <span>Year and Course</span>
                        <input name="year_course" onChange={this.handleChange} type="text"></input>
                    </div>
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

    renderConfirm(){
        return (
            <div className="confirm-container">
                <div className="confirm-message">
                    Please consult with an executive officer before proceeding. Confirm?
                </div>
                <div className="ok">
                    <button style={{marginTop: "2vh"}} class="btn btn-light">OK</button>    
                </div>
            </div>
        )
    }

    render(){
        let edit_mode = this.props.edit_mode;
        return (
        <Modal id="confirm-order-modal" show={this.props.show_order_modal} onHide={this.props.show_order_modal_fnc}>
          <Modal.Header closeButton>
            {edit_mode ? <h4>Confirm Seat Changes</h4> : <h4>Contact Information</h4>}
          </Modal.Header>
            <Modal.Body closeButton>    
                {!edit_mode ? !this.state.thanks ? this.renderInputs() : this.renderThankYou() : this.renderConfirm()}
            </Modal.Body>
        </Modal>
        )

        
    }
}