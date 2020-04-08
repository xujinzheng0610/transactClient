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
  Table,
  Modal, ModalBody, ModalFooter, ModalHeader
} from "reactstrap";
import { Bar, Doughnut, Line, Pie, Polar, Radar } from 'react-chartjs-2';
import Moment from 'react-moment';
import { PaymentInputsContainer ,PaymentInputsWrapper } from 'react-payment-inputs';
import images from 'react-payment-inputs/images';
import {withRouter} from 'react-router-dom';


import { retrieveProjectDetails, retrieveDonorsByProject,makeDonation } from "../../../services/axios_api";


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
        today: date,
        modal: false,
        large: false,
        primary: false,
        amount:'0',
        custom:false,
        donationFinished:false,
        cardNumber:'',
        expiryDate:'',
        cvc:'',
        alertVisible: false,
        alertColor: "info",
        alertMessage: "I am an alert message",
        
      };
      this.togglePrimary = this.togglePrimary.bind(this);
    }
    setAmount(amt) {
        if(!this.state.primary&&!this.getCookie("donor_id")){
            this.props.history.push('/login/donor');
            return;
        }
        console.log(amt);
        this.setState({
          primary: !this.state.primary,
          amount:amt,
          custom:false,
          donationFinished:false,
          cardNumber:'',
          expiryDate:'',
          cvc:'',
        });
      }
      togglePrimary() {
          if(!this.state.primary&&!this.getCookie("donor_id")){
            this.props.history.push('/login/donor');
            return;
        }
        this.setState({
          primary: !this.state.primary,
          amount:'0',
          custom:true,
          donationFinished:false,
          cardNumber:'',
          expiryDate:'',
          cvc:'',
        });
      }
    // setAmount(amt){
    //     this.setState({amount:amt});
    // }

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

    handleChangeCardNumber=e =>{
        console.log(e);
        this.setState({ cardNumber: e.target.value });
    }
    handleChangeExpiryDate=e =>{
        console.log(e);
        this.setState({ expiryDate: e.target.value });
    }
    handleChangeCVC=e =>{
        console.log(e);
        this.setState({ cvc: e.target.value });
    }
    triggerAlert = (color, message) => {
        this.setState({
          alertColor: color,
          alertMessage: message
        });
        this.onDismiss();
        setTimeout(this.onDismiss, 3000);
      };
    onDismiss = () => {
    this.setState({ alertVisible: !this.state.alertVisible });
    };

    getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)===' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
        }
        return false;
      }

    updateValue = type => e => {
        this.setState({
          [type]: e.target.value
        });
      };

    makeDonation =() =>{

        
        var data = new FormData();
        data.set("amount", this.state.amount);
        data.set("project_id", this.state.project_id);
        data.set("donor_id", this.getCookie("donor_id"));

        console.log(data.get('amount'));
        console.log(this.getCookie("donor_id"))

        if(this.state.cardNumber==''){
            this.triggerAlert("danger", "Card Number Required!");
            return;
        }
        makeDonation(data).then(response=>{
            console.log(response)
            this.triggerAlert("success", "Donation will be processed!");
            this.setState({
                // primary: false
                donationFinished:true
            });
            this.componentDidMount();
            
        }).catch(e => {
            this.triggerAlert("danger", "Error!");
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
                <style type="text/css">
                    {'.hidden { display:none; }'}
                </style>
                
                <Container fluid className="mt-3 mb-3 ml-5">
                    <Row style={{width:"95%", alignContent:"center"}}>
                        <Col xs="40" sm="12" md="8">
                            <div className="custome-tag">
                                {/* <img src='../../assets/img/slider/background1.jpg' alt="project photo" style={{width:"100%", height: "100%"}}/> */}
                                <img src={"data:image/jpeg;charset=utf-8;base64," + this.state.project.image} alt="project cover" style={{width:"100%", height: "100%"}}/>
                            </div>
                            <h2>About This Project</h2>
                            <p style={{ marginLeft: '2rem', borderLeft: "6px solid", borderLeftColor: "SkyBlue"}}>
                            <p className = 'mt-3 mb-3' style={{ marginLeft: '.5rem', fontStyle: 'italic', fontSize:'15px'}}>{this.state.project.description}</p>
                            </p>
                            <hr
                                style={{
                                    color: "primary",
                                    backgroundColor: "primary",
                                    height: 5
                                }}
                            />
                            <h2>About This Charity</h2>
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
                            <h2>
                                Money Allocation
                            </h2>
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
                            <h2>
                                Recent Donors
                            </h2>
                                <Card>
                                    <CardHeader>
                                        <i className="fa fa-align-justify"></i> Donors <small className="text-muted">latest 10 donors</small>
                                    </CardHeader>
                                    <CardBody>
                                        <Table responsive hover className="table table-striped">
                                        <thead>
                                            <tr>
                                            <th scope="col">User Name</th>
                                            <th scope="col">Amount</th>
                                            <th scope="col">Time</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.donors.map(item =>{
                                                return(
                                                    <tr>
                                                        <td>{item.donor}</td>
                                                        <td>${item.amount}</td>
                                                        <td>{item.donation_time}</td>
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
                            
                            <div className={this.state.project.actual_amount>=this.state.project.target_amount?'hidden':''}>
                                <h2>Donate Now!</h2>
                                <Row className="align-items-center">
                                    <Col col="6" className="mb-3 mb-xl-0">
                                        <Button block outline color="dark" disabled>$10</Button>
                                    </Col>
                                    <Col col="6"className="mb-3 mb-xl-0">
                                        <Button block color="primary" onClick={()=>this.setAmount("10")}>Donate</Button>
                                    </Col>
                                </Row>
                                <Row className="align-items-center mt-3">
                                    <Col col="6"  className="mb-3 mb-xl-0">
                                        <Button block outline color="dark" disabled>$20</Button>
                                    </Col>
                                    <Col col="6" className="mb-3 mb-xl-0">
                                        <Button block color="primary" onClick={()=>this.setAmount("20")}>Donate</Button>
                                    </Col>
                                </Row>
                                <Row className="align-items-center mt-3">
                                    <Col col="6" className="mb-3 mb-xl-0">
                                        <Button block outline color="dark" disabled>$30</Button>
                                    </Col>
                                    <Col col="6" className="mb-3 mb-xl-0">
                                        <Button block color="primary" onClick={()=>this.setAmount("30")}>Donate</Button>
                                    </Col>
                                </Row>
                                <Row className="align-items-center mt-3">
                                    <Col col="6" className="mb-3 mb-xl-0">
                                        <Button block outline color="dark" disabled>Customised Amount</Button>
                                    </Col>
                                    <Col col="6" className="mb-3 mb-xl-0">
                                        {/* <Button block color="primary">Donate</Button> */}
                                        <Button block color="primary" onClick={this.togglePrimary} className="mr-1">Donate</Button>
                                    </Col>
                                </Row>
                                
                            </div>
                            <div className={this.state.project.actual_amount>=this.state.project.target_amount?'':'hidden'}>
                                <h2>Donation Closed</h2>
                                <h3 style={{color:"gray"}} >Thanks For Your Interest!</h3>
                            </div>
                            
                            <Modal isOpen={this.state.primary} toggle={this.togglePrimary} 
                                className={'modal-primary ' +'modal-lg ' +this.props.className} 
                                style={{height:"80vh"}}>
                            <ModalHeader toggle={this.togglePrimary}>Donation</ModalHeader>
                            <ModalBody>
                                <div className={this.state.donationFinished?'hidden':''}>
                                    <div className={this.state.custom?'hidden':''}>
                                        <h2 >Your donation amount will be {this.state.amount} $</h2>
                                        <br></br>
                                        <h4 style={{color:"gray"}}>Please type in your bank card information</h4>
                                    </div>
                                    
                                    <div className={this.state.custom?'':'hidden'}>
                                        <h4>Please type in your donation Amount and bank card information</h4>
                                        <br></br>
                                        <p style={{color:"gray"}}>Donation Amount:</p><Input style={{width:"40%"}} type="number" placeholder="100($)" value={this.state.amount} onChange={this.updateValue('amount')} ></Input>
                                    </div>
                                    <br></br>
                                    <p style={{color:"gray"}}>Bank Card Info:</p><PaymentInputsContainer >
                                        {({ meta,wrapperProps,getCardImageProps, getCardNumberProps, getExpiryDateProps, getCVCProps }) => (
                                            <PaymentInputsWrapper {...wrapperProps}>
                                            <svg {...getCardImageProps({ images })} />
                                            <input {...getCardNumberProps({ onChange: this.handleChangeCardNumber })} value={this.state.cardNumber} />
                                            <input {...getExpiryDateProps({ onChange: this.handleChangeExpiryDate })} value={this.state.expiryDate} />
                                            <input {...getCVCProps({ onChange: this.handleChangeCVC })} value={this.state.cvc} />
                                        </PaymentInputsWrapper>
                                        )}
                                    </PaymentInputsContainer>
                                    <br></br>
                                    <br></br>
                                </div>

                                <div className={this.state.donationFinished?'':'hidden'}>

                                <Col md="12" style={{textAlign:"center",fontSize:"100px",color:"green"}}>
                                    <i className="cui-check icons d-block mt-4"></i>
                                    <br></br>
                                    <h2>Donation finished!</h2>
                                </Col>
                                
                                </div>
                                
                                <Alert
                                    color={this.state.alertColor}
                                    isOpen={this.state.alertVisible}
                                    toggle={this.onDismiss}
                                    style={{ position: "fixed", top: "2rem", right: "1rem" }}
                                >
                                    {this.state.alertMessage}
                                </Alert>
                            </ModalBody>
                            <ModalFooter>
                                <Button className={this.state.donationFinished?'hidden':''} color="primary" onClick={this.makeDonation}>Donate!</Button>
                                <Button color="secondary" onClick={this.togglePrimary}>Cancel</Button>
                            </ModalFooter>
                            </Modal>
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