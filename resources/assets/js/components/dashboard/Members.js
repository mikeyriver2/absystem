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

export default class Members extends Component{
  constructor(props){
    super(props);
    this.state = {
      members : [],
      chosen_user : {}
    }
    this.setChosenUser = this.setChosenUser.bind(this);
  }

  componentDidMount(){
    axios.get('/dashboard/users').then(res=>{
      this.setState({
        members: res.data,
        chosen_user: res.data[0]
      })
    });
  }

  setChosenUser(index){
    this.setState({
      chosen_user: this.state.members[index]
    })
  }

  render(){
    return (
      <Row className="home">
        <SideBar />
        <Col md={8} className="tickets-container">
          <div className="stuff">
            <div className="search-table">
              <input type="text" class="form-control" placeholder="Not Functional Yet"/>
            </div>
            
          </div>
          <div style={{maxHeight:"70vh",overflow:"auto"}} className="tickets-table">
            <Table hover>
              <thead>
                <tr>
                  <th>Member Name</th>
                  <th>Last Activity</th>
                  <th>Time of Last Activity</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {this.state.members.map((member,index)=>{
                  return (
                    <tr style={{cursor:"pointer"}} onClick={e=>this.setChosenUser(index)}>
                      <td>{member.name}</td>
                      {member.last_activity ?
                        <td>{member.last_activity.action}</td>
                      :
                        <td></td>
                      }
                      {member.last_activity ?
                        <td>{member.last_activity.created_at}</td>
                      :
                        <td></td>
                      }
                    </tr>
                  )
                  })
                }    
              </tbody>
            </Table>
          </div>
        </Col>
        <SideSummary
          chosen_user = {this.state.chosen_user}
        />
      </Row>
    )
  }
}