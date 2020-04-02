import React, { Component,lazy, Suspense  } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
  Col,
  Alert,
  Progress,
  ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText,
  Table
} from "reactstrap";
import { Bar, Doughnut, Line, Pie, Polar, Radar } from 'react-chartjs-2';
import Moment from 'react-moment';

import { retrieveProjectDetails, retrieveDonorsByProject } from "../../../services/axios_api";

let dummy_Project = {
    project_id:"1",
    project_name: "project1",
    target_amount:"10000",
    actual_amount:"9000",
    expiry_data: "2020-05-20",
    project_description:"This is a good project",
    charity_id:"1"
};

const pie = {
    labels: [
      'Maintenance',
      'Donation',
      'Operation',
    ],
    datasets: [
      {
        data: [1000, 8000, 1000],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
        ],
      }],
  };

class ProjectDetails extends Component{
    constructor(props) {
      super(props);
      const project_id = this.props.match.params.projectId
      var tempDate = new Date()
      var date = tempDate.getFullYear() + '-' + (tempDate.getMonth()+1) + '-' + tempDate.getDate()
  
      this.state = {
        project_id : this.props.match.params.projectId,
        project: {},
        donors: [],
        today: date
      };
    }
  
    componentDidMount(){
  
        retrieveProjectDetails(this.state.project_id).then(response =>{
            console.log(response['data']);
            console.log(typeof response['data'])
            // console.log(response['data'])
            this.setState({
              project:response.data.result
            })
          })
          .catch(e => {
            console.log(e);
          })

          retrieveDonorsByProject(this.state.project_id).then(response =>{
            console.log(response['data']);
            console.log(typeof response['data'])
            // console.log(response['data'])
            this.setState({
              donors:response.data.latestDonors
            })
          })
          .catch(e => {
            console.log(e);
          })

    }

    render(){
        
        return(
            <div style={{height:"100%"}}>
                <style>
                    {`.custom-tag {
                        max-width: 100%;
                        height: 30rem;
                        background: black;
                        }`}
                </style>
                <Container fluid className="mt-3 mb-3 ml-5">
                    <Row style={{width:"95%", alignContent:"center"}}>
                        <Col xs="40" sm="12" md="8">
                            <div className="custome-tag">
                                <img src='../../assets/img/slider/background1.jpg' alt="project photo" style={{width:"100%", height: "100%"}}/>
                            </div>
                            <h1>About This Project</h1>
                            <p>
                                {this.state.project.description}    
                            </p>
                            <p style={{ marginLeft: '2rem', borderLeft: "6px solid", borderLeftColor: "SkyBlue"}}>
                            <p className = 'mt-3 mb-3' style={{ marginLeft: '.5rem', fontStyle: 'italic', fontSize:'15px'}}>Some descroption about this projectSome descroption about this projectSome descroption about this projectSome descroption about this projectSome descroption about this projectSome descroption about this projectSome descroption about this projectSome descroption about this projectSome descroption about this projectSome descroption about this projectSome descroption about this project</p>
                            </p>
                            <hr
                                style={{
                                    color: "primary",
                                    backgroundColor: "primary",
                                    height: 5
                                }}
                            />
                            <h1>About This Charity</h1>
                            <p style={{ marginLeft: '2rem', fontSize: "20px", }}>
                                {this.state.project.charity_description}    
                            </p>
                            <hr
                                style={{
                                    color: "primary",
                                    backgroundColor: "primary",
                                    height: 5
                                }}
                            />
                            <h1>
                                Money Allocation
                            </h1>
                            <div className="chart-wrapper">
                                <Pie data={pie} />
                            </div>
                            <hr
                                style={{
                                    color: "primary",
                                    backgroundColor: "primary",
                                    height: 5
                                }}
                            />
                            <h1>
                                Recent Donors
                            </h1>
                                <Card>
                                    <CardHeader>
                                        <i className="fa fa-align-justify"></i> Donors <small className="text-muted">latest 10 donors</small>
                                    </CardHeader>
                                    <CardBody>
                                        <Table responsive hover className="table table-striped">
                                        <thead>
                                            <tr>
                                            <th scope="col">Name</th>
                                            <th scope="col">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.donors.map(item =>{
                                                return(
                                                    <tr>
                                                        <td>{item.donor}</td>
                                                        <td>{item.amount}</td>
                                                    </tr>
                                                );
                                            })}
                                            
                                        </tbody>
                                        </Table>
                                    </CardBody>
                                </Card>
                        </Col>
                        <Col xs="12" sm="12" md="4" >
                            {/* <h2
                                style={{
                                borderBottom: "2px solid #000",
                                width: "fit-content",
                                margin: "auto"
                                }}
                            >
                                {project_id}                                  
                            </h2> */}
                            <p
                                style={{
                                fontSize: "40px",
                                fontFamily: "Arial",
                                width: "fit-content",
                                marginBottom: "20px"
                                }}
                            ><strong>{this.state.project.project_name}</strong></p>
                            <h3 style={{
                                width: "fit-content",
                                marginBottom: "20px"
                                }}>
                                <span style={{
                                    color:"grey"
                                }}>By  </span> 
                                <span style={{
                                    color:"black"
                                }}>
                                    {this.state.project.charity_name}{"\n"}
                                </span>
                            </h3>
                            <h3
                                style={{
                                width: "fit-content",
                                marginBottom: "10px"
                                }}
                            >
                                
                                <span style={{
                                    color:"grey"
                                }}>Expiry Date: </span>  {this.state.project.expiry_date}
                            </h3>
                            <p className = "mt-3 mb-0"
                                style={{
                                width: "fit-content",
                                fontFamily:"monospace",
                                fontSize: "35px"
                                }}
                            >
                                <strong>${this.state.project.actual_amount}/${this.state.project.target_amount}</strong>
                            </p>
                            <h6 className = 'mt-0'><strong>raised from {Object.keys(this.state.donors).length} donations</strong></h6>
                            <Progress animated color="info" value={this.state.project.actual_amount/this.state.project.target_amount*100} className="mb-3" >
                                {this.state.project.actual_amount/this.state.project.target_amount*100}%
                            </Progress>
                            <h6 className = 'mt-0' style={{textAlign: "right"}}><strong><Moment diff={this.state.today} unit="days">{this.state.project.expiry_date}</Moment> more days</strong></h6>
                            <hr
                                style={{
                                    color: "primary",
                                    backgroundColor: "primary",
                                    height: 5
                                }}
                            />
                            <h2>Donate Now!</h2>
                            <Row className="align-items-center">
                                <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                                    <Button block outline color="dark" disabled>$10</Button>
                                </Col>
                                <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                                    <Button block color="primary">Donate</Button>
                                </Col>
                            </Row>
                            <Row className="align-items-center mt-3">
                                <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                                    <Button block outline color="dark" disabled>$20</Button>
                                </Col>
                                <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                                    <Button block color="primary">Donate</Button>
                                </Col>
                            </Row>
                            <Row className="align-items-center mt-3">
                                <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                                    <Button block outline color="dark" disabled>$30</Button>
                                </Col>
                                <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                                    <Button block color="primary">Donate</Button>
                                </Col>
                            </Row>
                            <hr
                                style={{
                                    color: "primary",
                                    backgroundColor: "primary",
                                    height: 5
                                }}
                            />
                            {/* <Card className="mt-3">
                                <CardHeader>
                                    <i className="fa fa-align-justify"></i><strong>Contact Us</strong>
                                </CardHeader>
                                <CardBody> */}
                                    <ListGroup className="mt-3">
                                        <ListGroupItemHeading><h2>Contact Us</h2></ListGroupItemHeading>
                                        <ListGroupItem style={{backgroundColor: "#F8F8FF"}}><strong>Organization: </strong> {this.state.project.charity_name}</ListGroupItem>
                                        <ListGroupItem style={{backgroundColor: "#F8F8FF"}}><strong>Phone: </strong> {this.state.project.charity_number}</ListGroupItem>
                                        <ListGroupItem style={{backgroundColor: "#F8F8FF"}}><strong>Email: </strong> {this.state.project.charity_email}</ListGroupItem>
                                        <ListGroupItem style={{backgroundColor: "#F8F8FF"}}><strong>Address: </strong> {this.state.project.charity_address}</ListGroupItem>
                                    </ListGroup>
                                {/* </CardBody>
                            </Card> */}
                        </Col>
                    </Row>
                </Container>
            </div>
            
        )
    }
}
export default ProjectDetails