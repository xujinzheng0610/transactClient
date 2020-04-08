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
  Alert,
  Progress
} from "reactstrap";
import { retrieveAllProjects } from "../../services/axios_api";
import { FaCalendar } from 'react-icons/fa';


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
      console.log(response['data'].result)
      this.setState({
        projects:response.data.result
      })
    })
    .catch(e => {
      console.log(e);
    })
  }

  render(){
    
    return<div>
      {/* <p style={{
              width: "fit-content",
              marginLeft: "180px",
              fontSize: "50px",
              fontFamily: "Anton"
            }}><strong>Projects</strong></p> */}
      
      <Container className="mt-3 mb-3">
          <Row style={{textAlign:"center"}}>
            <h1
            style={{
              width: "fit-content",
              margin: "auto"
            }}
          >
           Projects
          </h1>
          </Row>
          <Row className="mt-3 mb-3">
            {this.state.projects.map(item =>{
            return (
              <Col xs="12" sm="8" md="4">
                <Card  className="card-accent-primary">
                    <div className="custome-tag">
                      <img src='../../assets/img/slider/background1.jpg' alt="project photo" style={{width:"100%", height: "100%"}}/>
                    </div>
                    <CardBody>
                      <h2 className = 'mt-0 mb-3'>{item.project_name}</h2>
                      <p><strong>Target: </strong>${item.target_amount}<FaCalendar style={{ marginLeft: '5rem' }}/><strong>Due: </strong>{item.expiry_date}</p>
                      <Progress animated color="info" value={item.actual_amount/item.fundTarget*100} className="mb-3" >
                        {item.actual_amount/item.fundTarget*100}%
                      </Progress>
                      <p>{item.description}</p>
                      <Col style = {{textAlign: "center"}}><Link to={`/project/${item._id}`}><Button outline color="primary">KNOW PROJECT BETTER</Button></Link></Col>
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