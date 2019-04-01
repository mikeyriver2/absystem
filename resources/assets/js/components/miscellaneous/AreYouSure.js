import React, { Component } from 'react';
import {Dropdown,Col,Row, Modal} from 'react-bootstrap';


export default class AreYouSure extends Component{
    constructor(props){
        super(props)
        this.state = {
            
        }
        this.confirmFunction = this.confirmFunction.bind(this);
    }

    confirmFunction(){

    }

    callFunction(){
        
    }

    render(){
        return(
        <Modal id="confirm-order-modal" show={this.props.are_you_sure} onHide={this.props.toggle}>
          <Modal.Header closeButton>
          </Modal.Header>
            <Modal.Body closeButton>    
            </Modal.Body>
        </Modal>
        )
    }
}