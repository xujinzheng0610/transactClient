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
  
      this.state = {
        project_id : this.props.match.params.projectId,
        project: {},
        donors: []
      };
    }
  
    componentDidMount(){
  
        retrieveProjectDetails(this.state.project_id).then(response =>{
            console.log(response['data']);
            console.log(typeof response['data'])
            // console.log(response['data'])
            this.setState({
              project:response['data']
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
              donors:response['data']
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
                <Container className="mt-3 mb-3">
                    <Row>
                        <Col xs="12" sm="12" md="8" >
                            <div className="custome-tag">
                                <img src='../../assets/img/slider/background1.jpg' alt="project photo" style={{opacity:0.5, width:"100%", height: "100%"}}/>
                            </div>
                            <h1>About This Project</h1>
                            <h2>
                                {this.state.project.description}    
                            </h2>
                            <p>
                            Some descroption about this projectSome descroption about this projectSome descroption about this projectSome descroption about this projectSome descroption about this projectSome descroption about this projectSome descroption about this projectSome descroption about this projectSome descroption about this projectSome descroption about this projectSome descroption about this project
                            </p>
                            <h1>About This Charity</h1>
                            <h2>
                                {this.state.project.charity_description}    
                            </h2>
                            <h1>
                                Money Allocation
                            </h1>
                            <div className="chart-wrapper">
                                <Pie data={pie} />
                            </div>
                            <h1>
                                Recent Donors
                            </h1>
                                <Card>
                                    <CardHeader>
                                        <i className="fa fa-align-justify"></i> Donors <small className="text-muted">example</small>
                                    </CardHeader>
                                    <CardBody>
                                        <Table responsive hover>
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
                            <h1
                                style={{
                                width: "fit-content",
                                marginBottom: "20px"
                                }}
                            >                                 
                                {this.state.project.project_name}
                            </h1>
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
                            <h2
                                style={{
                                width: "fit-content",
                                margin: "auto",
                                fontFamily:"'Gill Sans', sans-serif"
                                }}
                            >
                                ${dummy_Project.actual_amount}/${this.state.project.target_amount}
                            </h2>
                            <Progress animated color="info" value={dummy_Project.actual_amount/dummy_Project.target_amount*100} className="mb-3" >
                                {dummy_Project.actual_amount/this.state.project.target_amount*100}%
                            </Progress>
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
                            {/* <Card className="mt-3">
                                <CardHeader>
                                    <i className="fa fa-align-justify"></i><strong>Contact Us</strong>
                                </CardHeader>
                                <CardBody> */}
                                    <ListGroup className="mt-3">
                                        <ListGroupItemHeading><h2>Contact Us</h2></ListGroupItemHeading>
                                        <ListGroupItem><strong>Organization: </strong> {this.state.project.charity_name}</ListGroupItem>
                                        <ListGroupItem><strong>Phone: </strong> {this.state.project.charity_number}</ListGroupItem>
                                        <ListGroupItem><strong>Email: </strong> {this.state.project.charity_email}</ListGroupItem>
                                        <ListGroupItem><strong>Address: </strong> {this.state.project.charity_address}</ListGroupItem>
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