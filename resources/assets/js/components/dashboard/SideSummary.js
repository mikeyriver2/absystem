import {Row, Col} from 'react-bootstrap'
import React, { Component } from 'react';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import ReactDOM from 'react-dom';
import Example from '../Example';
import Singson from '../ticketing/venues/Singson'
import axios from 'axios';


export default class SideSummary extends Component{
    constructor(props){
        super(props)
        this.state={

        }
    }

    render(){
        return (
                <Col md={3} className="main-info">
                    <div className="summary-main-container">
                        <div className="summary-main">
                            <div className="rev-today">
                                <div className="amount">
                                    P50,000
                                </div>
                                <div className="label">
                                    Revenue Today
                                </div>
                            </div>
                            <div className="tickets-sold">
                                <div className="amount">
                                    100
                                </div>
                                <div className="label">
                                    Tickets sold
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="breakdown">
                        <h4>RECENT SALES</h4>
                        <div className="breakdown-sales">
                            {this.props.handleShowSales()}
                        </div>
                    </div>
                </Col>
            )
    }
}