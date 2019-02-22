import {Row, Col} from 'react-bootstrap'
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class Head extends Component{
    constructor(){
        super();
        this.state = {

        }
    }

    render(){
        return (
            <Row className="head">
                <Col md={4} className="logo">
                    <img src="/images/abs-logo.png" />
                </Col>
                <Col md={4} className="abs-title">
                    ATENEO BLUE SYMPHONY ORCHESTRA
                </Col>
                <Col md={4} className="hi-username">
                    <Row style={{height:"100%"}}>
                        <Col md={7} className="username">
                            Hi there, <br /> Michael Rivera!
                        </Col>
                        <Col md={5} className="dp">
                            <img src="/images/dp.svg" />
                        </Col>
                    </Row>
                </Col>
            </Row>
        )
    }
}