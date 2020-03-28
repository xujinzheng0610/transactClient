import React, { Component,lazy, Suspense  } from 'react';
import { Link } from 'react-router-dom';
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
  Alert
} from "reactstrap";
import { retrieveAllProjects } from "../../services/axios_api";


let dummy_projects =[
  {
    project_id:"1",
    project_name: "project1",
    target_amout:"10000",
    expiry_data: "2020-05-20",
    project_description:"This is a good project",
  },{
    project_id:"2",
    project_name: "project2",
    target_amout:"10000",
    expiry_data: "2020-05-20",
    project_description:"This is a good project",
  },{
    project_id:"3",
    project_name: "project3",
    target_amout:"10000",
    expiry_data: "2020-05-20",
    project_description:"This is a good project",
  },{
    project_id:"4",
    project_name: "project4",
    target_amout:"10000",
    expiry_data: "2020-05-20",
    project_description:"This is a good project",
  },{
    project_id:"5",
    project_name: "project5",
    target_amout:"10000",
    expiry_data: "2020-05-20",
    project_description:"This is a good project",
  },{
    project_id:"6",
    project_name: "project6",
    target_amout:"10000",
    expiry_data: "2020-05-20",
    project_description:"This is a good project",
  },{
    project_id:"7",
    project_name: "project7",
    target_amout:"10000",
    expiry_data: "2020-05-20",
    project_description:"This is a good project",
  },{
    project_id:"8",
    project_name: "project8",
    target_amout:"10000",
    expiry_data: "2020-05-20",
    project_description:"This is a good project",
  },{
    project_id:"9",
    project_name: "project9",
    target_amout:"10000",
    expiry_data: "2020-05-20",
    project_description:"This is a good project",
  },{
    project_id:"10",
    project_name: "project10",
    target_amout:"10000",
    expiry_data: "2020-05-20",
    project_description:"This is a good project",
  }
];


class Project extends Component{
  constructor(props) {
    super(props);

    this.state = {
      projects : []
    };
  }

  componentDidMount(){
    retrieveAllProjects().then(response =>{
      console.log(response['data']);
      console.log(typeof response['data'])
      // console.log(response['data'])
      this.setState({
        projects:response['data']
      })
    })
    .catch(e => {
      console.log(e);
    })
  }

  render(){
    
    return<div>
      <h1>Projects</h1>
      <Container className="mt-3 mb-3">
          <h2
            style={{
              borderBottom: "2px solid #000",
              width: "fit-content",
              margin: "auto"
            }}
          >
            Latest Projects
          </h2>
          <Row>
            {this.state.projects.map(item =>{
            return (
              <Col xs="12" sm="6" md="4">
                <Card  className="card-accent-primary">
                    <CardHeader>
                      <h2>{item.project_name}</h2>
                    </CardHeader>
                    <CardBody>
                      <p>{item.target_amount}</p>
                      <p>{item.expiry_date}</p>
                      <p>{item.description}</p>
                      <Link to={`/projects/${item._id}`}><p>--To find more details </p></Link>
                    </CardBody>
                  </Card>   
                </Col>  
              );
             })} 
          </Row>
          
          
        </Container>
    </div>
  }

}

export default Project