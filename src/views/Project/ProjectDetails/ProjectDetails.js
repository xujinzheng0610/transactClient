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
  Progress
} from "reactstrap";

import { retrieveProjectDetails } from "../../../services/axios_api";

let dummy_Project = {
    project_id:"1",
    project_name: "project1",
    target_amount:"10000",
    actual_amount:"9000",
    expiry_data: "2020-05-20",
    project_description:"This is a good project",
    charity_id:"1"
  };

class ProjectDetails extends Component{
    constructor(props) {
      super(props);
      const project_id = this.props.match.params.projectId
  
      this.state = {
        project_id : this.props.match.params.projectId,
        project: {}
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
                        </Col>
                    </Row>
                </Container>
            </div>
            
        )
    }
}
export default ProjectDetails