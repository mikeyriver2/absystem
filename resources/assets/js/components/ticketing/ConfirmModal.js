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
        }
        this.toggleLoading = this.toggleLoading.bind(this)
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
        this.toggleLoading();
        setTimeout(()=>{
            this.setState({
                thanks: true
            })
            this.toggleLoading();
            this.props.clearOrder()
        },2000)
        //clearOrder will show thank you for 5 secs
        setTimeout(()=>{
            this.setState({
                thanks: false
            })
        },7000) //7000 because 2000+5000
        
    }

    renderInputs(){
        return(
            <div>
                <div className="form-span first-name">
                    <span>First Name*</span>
                    <input type="text"></input>
                </div>
                <div className="form-span last-name">
                    <span>Last Name*</span>
                    <input type="text"></input>
                </div>
                <div className="form-span email">
                    <span>Email Address*</span>
                    <input type="text"></input>
                </div>
                <div className="form-span cell">
                    <span>Cellphone Number:</span>
                    <input type="text"></input>
                </div>
                <div className="form-span-two">
                    <div className="id_number">
                        <span>ID Number</span>
                        <input type="text"></input>
                    </div>
                    <div className="id_number">
                        <span>Year and Course</span>
                        <input type="text"></input>
                    </div>
                </div>
                <button onClick={this.submitOrder.bind(this)} className="confirm-button btn btn-primary">
                    {!this.state.loading ? "Confirm Order" : <Loader />}
                </button>
            </div>
        )
    }

    renderThankYou(){
        return (
            <div className="thanks">
                <h5>THANK YOU FOR YOUR PURCHASE, MIKEY</h5>
                <p>We hope to heir duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations </p>
                <h5>ENJOY THE SHOW!</h5>
            </div>
        )
    }

    render(){
        return (
        <Modal id="confirm-order-modal" show={this.props.show_order_modal} onHide={this.props.show_order_modal_fnc}>
          <Modal.Header closeButton>
            <h4>Contact Information</h4>
          </Modal.Header>
            <Modal.Body closeButton>    
                {!this.state.thanks ? this.renderInputs() : this.renderThankYou()}
            </Modal.Body>
        </Modal>
        )

        
    }
}