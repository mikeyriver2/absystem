import {Row, Col, Table, Button, Pagination} from 'react-bootstrap'
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Example from '../Example';
import Home from './Home'
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import SideBar from './SideBar'
import SideSummary from './SideSummary'
import axios from 'axios';

export default class Tickets extends Component{
  constructor(props){
    super(props);
    this.state = {
      orders: [],
      current_page: 1,
      total_pages: 1,
    }
    this.handleShowSales = this.handleShowSales.bind(this);
    this.renderSmallPaginate = this.renderSmallPaginate.bind(this);
    this.loadPaginatedData = this.loadPaginatedData.bind(this);
  }

  componentDidMount(){
    axios.get('/api/dashboard/orders').then(res=>{
      this.setState({
        orders: res.data.orders.data,
        total_pages: res.data.orders.last_page
      })
    }).catch(

    )
  }

  handleShowSales(){
    var sales = [];
    for(var i = 0; i < 5; i++){
        sales.push(
            <Row className="breakdown-item">
                <Col md={8} className="breakdown-order"> 
                    <div className="sale-order"> 
                        Order No. 12 | 4 tickets
                    </div>
                    <div className="sale-codes">
                        OLA1, OLA2, VIPA1, VIPA2
                    </div>
                </Col>
                <Col md={2} className="breakdown-functions"> 
                    view
                </Col>
            </Row>
        )
    }
    return sales;
  }

  loadPaginatedData(page){
    let url = `/api/dashboard/orders?page=${page}`
    axios.get(url).then((res)=>{
      this.setState({
        current_page: page,
        orders: res.data.orders.data,
      })
    })
  }

  renderSmallPaginate(){
    let items = [];
    for(let foo = 1; foo <= this.state.total_pages; foo++){
      console.log(window.location.hostname)
      items.push(
        <Pagination.Item onClick={()=>this.loadPaginatedData(foo)} key={foo} active={foo === this.state.current_page}>
          {foo}
        </Pagination.Item>
      )
    }
    return (
      <Pagination>
        {items}
      </Pagination>
    )
  }

  renderBigPaginate(){
    return (
      <Pagination>
        <Pagination.First />
        <Pagination.Prev />
        <Pagination.Item>{1}</Pagination.Item>
        <Pagination.Ellipsis />

        <Pagination.Item>{10}</Pagination.Item>
        <Pagination.Item>{11}</Pagination.Item>
        <Pagination.Item active>{12}</Pagination.Item>
        <Pagination.Item>{13}</Pagination.Item>
        <Pagination.Item disabled>{14}</Pagination.Item>

        <Pagination.Ellipsis />
        <Pagination.Item>{20}</Pagination.Item>
        <Pagination.Next />
        <Pagination.Last />
      </Pagination>
    )
  }

  render(){
    return (
      <Row className="home">
        <SideBar />
        <Col md={8} className="tickets-container">
          <div className="search-table">
            I'm a search bar
          </div>
          <div className="tickets-table">
            <Table hover>
              <thead>
                <tr>
                  <th>Buyer Full Name</th>
                  <th>Email Address</th>
                  <th>Cell Number</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                  {this.state.orders.length > 0 && this.state.orders.map((order)=>{
                    let full_name = `${order.buyer_last_name}, ${order.buyer_first_name}`
                    return (
                      <tr>
                        <td>{full_name}</td>
                        <td>{order.buyer_email}</td>
                        <td>{order.buyer_cell_number}</td>
                        <td><Button variant="success">Verify Payment</Button></td>
                    </tr> )
                  })
                  }
              </tbody>
            </Table>
          </div>
          <div className="table-paginate">
              {this.renderSmallPaginate()}
            </div>
        </Col>
        <SideSummary
          handleShowSales = {this.handleShowSales}
        />
      </Row>
    )
  }
}