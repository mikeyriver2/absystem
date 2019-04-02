import {Row, Col, Table, Dropdown, Button, Pagination, Modal} from 'react-bootstrap'
import React, { Component} from 'react';
import ReactDOM from 'react-dom';
import Example from '../Example';
import Home from './Home'
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import SideBar from './SideBar'
import SideSummary from './SideSummary';
import AreYouSure from '../miscellaneous/AreYouSure';
import OrderInfoModal from './OrderInfoModal';
import axios from 'axios';

export default class Tickets extends Component{
  constructor(props){
    super(props);
    this.state = {
      are_you_sure: false,
      orders: [],
      current_page: 1,
      total_pages: 1,
      show_ticket_info: false,
      ticket_info: {},
      dates: [],
      selected_date: "",
      search: "",
      edit_mode: false,
      to_verify_payment: {
        e: "",
        order: {}   
      }
    }
    this.renderSmallPaginate = this.renderSmallPaginate.bind(this);
    this.loadPaginatedData = this.loadPaginatedData.bind(this);
    this.handleShowTicketInfo = this.handleShowTicketInfo.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSetDate = this.handleSetDate.bind(this);
    this.handleVerify = this.handleVerify.bind(this);
    this.verifyPayment = this.verifyPayment.bind(this);
    this.handleVerifyAttendance = this.handleVerifyAttendance.bind(this);
    this.handleEditOrder = this.handleEditOrder.bind(this);
    this.toggleAreYouSure = this.toggleAreYouSure.bind(this);
  }

  componentDidMount(){
    axios.get('/api/dashboard/venue').then(res=>{
      let array = [];
      res.data.venue.event.event_days.map((date)=>{
        array.push(date.date)
      });
      this.setState({
        dates: array
      })
    })

    axios.post('/api/dashboard/orders').then(res=>{
      this.setState({
        orders: res.data.orders.data,
        total_pages: res.data.orders.last_page
      })
    }).catch(

    )
  }

  loadPaginatedData(page,order=null){ //order second param is from verify  attendance
    var values = {
      search: this.state.search,
      selected_date: this.state.selected_date
    }
    let url = `/api/dashboard/orders?page=${page}`
    axios.post(url,values).then((res)=>{
      this.setState({
        current_page: page,
        orders: res.data.orders.data,
      })
      if(order){
        res.data.orders.data.map((_order)=>{
          if(_order.id == order.id){
            this.handleShowTicketInfo(null,_order,true) //3rd param is to not reload modal
          }
        })
      }                                             
    })
  }

  toggleAreYouSure(){
    this.setState({
        are_you_sure: !this.state.are_you_sure
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

  handleSetDate(e){
    this.setState({
        selected_date: e
    },()=>{
      this.handleSearch();
    })
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

  handleShowTicketInfo(e,order={},just_refresh=false,close_and_refresh = false){
    let bool = false;
    if(!this.state.show_ticket_info){
      bool = true;
    }

    this.setState({
      show_ticket_info: just_refresh ? true : bool,
      ticket_info: order,
      edit_mode: false
    })
  }

  handleSearch(e=null){
    let value = null;
    if(e){
      value = e.target.value;
      console.log(value);
    }
    this.setState((prevState,props)=>({
      search: value || value == "" ? value : prevState.search
    }),()=>{
      var values = {
        search: this.state.search,
        selected_date: this.state.selected_date
      }
      axios.post('/api/dashboard/orders',values).then(res=>{
        this.setState({
          orders: res.data.orders.data,
          total_pages: res.data.orders.last_page
        })
      }).catch(
      )
    })
  }

  handleVerify(e,order){
    this.toggleAreYouSure();
    this.setState({
      to_verify_payment: {
        e: e,
        order: order
      }
    })
  }

  verifyPayment(e,order){
    axios.post('/api/dashboard/verify-payment',order).then(res=>{
      this.loadPaginatedData(this.state.current_page);
      this.toggleAreYouSure();
    })

  }

  handleVerifyAttendance(ticket){
    this.loadPaginatedData(this.state.current_page,ticket)
  }

  handleEditOrder(e,order){
    this.setState({
      edit_mode: !this.state.edit_mode,
      show_ticket_info: !this.state.show_ticket_info,
      ticket_info: order
    })
  }

  render(){
    return (
      <Row className="home">
        <SideBar />
        <Col md={8} className="tickets-container">
          <div className="stuff">
            <div className="search-table">
              <input onChange={this.handleSearch} type="text" class="form-control" placeholder="Search"/>
            </div>
            <div className="date-dropdown">
              <Dropdown onSelect={(e)=>{this.handleSetDate(e)}}>
                <Dropdown.Toggle id="dropdown-date">
                  <div className="dropdown-container">
                    <img src="/images/clapperboard.png"/>
                    {this.state.selected_date == "" ?
                      <span>Select Reservation Date</span>
                        :
                      <span>{this.state.selected_date}</span>
                    }
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item eventKey="all">All dates</Dropdown.Item>
                  {this.state.dates.map((date,index)=>{
                    return <Dropdown.Item eventKey={date}>{date}</Dropdown.Item>
                  })
                  }
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
          <div className="tickets-table">
            <Table hover>
              <thead>
                <tr>
                  <th>Bought at</th>
                  <th>Buyer Full Name</th>
                  <th>Email Address</th>
                  <th>Payment Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                  {this.state.orders.length > 0 && this.state.orders.map((order)=>{
                    let full_name = `${order.buyer_last_name}, ${order.buyer_first_name}`
                    return (
                      <tr>
                        <td>{order.created_at}</td>
                        <td>{full_name}</td>
                        <td>{order.buyer_email}</td>
                        <td>
                        {!order.paid ? 
                          <Button onClick={e => this.handleVerify(e,order)} variant="success">Verify Payment</Button>
                          :
                          <div className="verifed-payment">
                            <img src="/images/checked.svg" />
                            <span>Payment Verified</span>
                          </div>
                        }
                        </td>
                        <td><Button onClick={e => this.handleShowTicketInfo(e,order)} variant="primary">View</Button></td>
                        <td><Button onClick={e => this.handleEditOrder(e,order)} variant="secondary">Edit</Button></td>
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
        />
        <OrderInfoModal 
          from_tickets = {true}
          handleVerifyAttendance = {this.handleVerifyAttendance}
          show_ticket_info = {this.state.show_ticket_info}
          toggle_show = {this.handleShowTicketInfo}
          ticket_info = {this.state.ticket_info}
          edit_mode = {this.state.edit_mode}
          show_ticket_info = {this.state.show_ticket_info}
          loadPaginatedData = {this.loadPaginatedData}
        />
        <Modal id="are_you_sure" show={this.state.are_you_sure} onHide={this.toggleAreYouSure}>
          <Modal.Header closeButton>
            <b>Ey meng, u gotta make sure of dat</b>
          </Modal.Header>
          <Modal.Body closeButton>
            <p>Are you super duper ultra sure? There ain't no turnin' back yo.</p><b/><small>(..jk lng yeh der is)</small>  
            <button type="button" class="btn btn-success" onClick={()=>{this.verifyPayment(this.state.to_verify_payment.e,this.state.to_verify_payment.order)}}>Yeh Meng</button>
          </Modal.Body>
        </Modal>
      </Row>
    )
  }
}