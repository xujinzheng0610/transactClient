import React, { Component } from 'react';
import { Badge, Button, Card, CardBody, CardFooter, CardHeader, Col, Row, Collapse, Fade, Alert } from 'reactstrap';
import { AppSwitch } from '@coreui/react'

import client, { pendingDonorRetrieval, donorApproval, pendingCharityRetrieval, charityApproval, charityReject } from "../../../../services/axios_api";
class ManageCharities extends Component {
  constructor(props) {
    super(props);
    this.onEntering = this.onEntering.bind(this);
    this.onEntered = this.onEntered.bind(this);
    this.onExiting = this.onExiting.bind(this);
    this.onExited = this.onExited.bind(this);
    this.toggleAccordion = this.toggleAccordion.bind(this);
    this.toggleCustom = this.toggleCustom.bind(this);
    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);

    this.state = {
      collapse: false,
      accordion: [true, false, false],
      custom: [true, false],
      status: 'Closed',
      fadeIn: true,
      timeout: 300,

      error: null, 
      isLoaded: false, 

      pendingOrganizations: null,
      approveCharity: false,
      rejectCharity: false, 
      inspectorAddress: '0xc3D2b233F2238Af0c0c01430b2582FBBA583b67C', 
      charityOrganizationAddress: null,

      alertVisible: false,
      alertColor: "info",
      alertMessage: "I am an alert message",
    };
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

  onEntering() {
    this.setState({ status: 'Opening...' });
  }

  onEntered() {
    this.setState({ status: 'Opened' });
  }

  onExiting() {
    this.setState({ status: 'Closing...' });
  }

  onExited() {
    this.setState({ status: 'Closed' });
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleAccordion(tab) {

    const prevState = this.state.accordion;
    const state = prevState.map((x, index) => tab === index ? !x : false);

    this.setState({
      accordion: state,
    });
  }

  toggleCustom(tab) {

    const prevState = this.state.custom;
    const state = prevState.map((x, index) => tab === index ? !x : false);

    this.setState({
      custom: state,
    });
  }

  toggleFade() {
    this.setState({ fadeIn: !this.state.fadeIn });
  }

  
  componentDidMount() {
    pendingCharityRetrieval()
      .then(
        (result) => {
          let data = result.data
          if (data["code"] === 200){
            this.setState({
              isLoaded: true,
              pendingOrganizations: data["items"]
            });
          }else{
            this.setState({
              isLoaded: true
            })
          }
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  retrievePendingCharity = () =>{
    pendingCharityRetrieval()
      .then(
        (result) => {
          let data = result.data
          console.log('retrieval after rejecting/approving')
          console.log(data)
          if (data["code"] === 200){
            this.setState({
              isLoaded: true,
              pendingOrganizations: data["items"]
            });
          }else{
            this.setState({
              isLoaded: true
            })
          }
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
      }


  approveCharity = approvingCharity => {
    var data = new FormData();
    data.set("charityAddress", approvingCharity.eth_address);
    data.set("inspectorAddress", this.state.inspectorAddress); 
    console.log("charityAddress");
    console.log(approvingCharity.eth_address);
    this.setState({ isLoaded: true });
    charityApproval(data)
      .then(response => {
        if (response.data["code"] === 200) {
          console.log("should be fine");
          console.log(response.data["code"])
          this.setState({ approveCharity: true });
          this.retrievePendingCharity()
          this.triggerAlert("success", "Charity has been approved");
        } else {
          console.log("What's wrong with you")
          console.log(response.data["code"])
          this.triggerAlert("danger", response.data["message"]);
        }
      })
      .catch(e => {
        console.log(e);
      })
      .then(() => {
        this.setState({ approveCharity: false });
      });
  }; 

  rejectCharity = rejectingCharity => {
    var data = new FormData();
    data.set("charityAddress", rejectingCharity.eth_address);
    data.set("inspectorAddress", this.state.inspectorAddress); 
    console.log("charityAddress");
    console.log(rejectingCharity.eth_address);
    this.setState({ isLoaded: true });
    charityReject(data)
      .then(response => {
        if (response.data["code"] === 200) {
          console.log("should be fine");
          console.log(response.data["code"])
          this.setState({ rejectCharity: true });
          this.retrievePendingCharity()
          this.triggerAlert("success", "Charity has been rejected");
        } else {
          console.log("What's wrong with you")
          console.log(response.data["code"])
          this.triggerAlert("danger", response.data["message"]);
        }
      })
      .catch(e => {
        console.log(e);
      })
      .then(() => {
        this.setState({ rejectCharity: false });
      });
  }; 

  render() {
    const {pendingOrganizations } = this.state;
  
    if (!pendingOrganizations) { return [] }
    return (
      <div className="animated fadeIn">
        <Alert
          color={this.state.alertColor}
          isOpen={this.state.alertVisible}
          toggle={this.onDismiss}
          style={{ position: "fixed", top: "10rem", right: "5rem" }}
        >
          {this.state.alertMessage}
        </Alert>
        <Row>
          {
          pendingOrganizations.map( organization => {return(
          <Col md="12" lg="1l2" xl="12">
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Pending Charity Organizations  
                <div className="card-header-actions">
                  <Badge>NEW</Badge>
                </div>
              </CardHeader>
              <CardBody>
                <div id="accordion">
                  <Card className="mb-0">
                    <CardHeader id="headingOne">
                      <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordion(0)} aria-expanded={this.state.accordion[0]} aria-controls="collapseOne">
                        <h5 className="m-0 p-0">
                          <ul>
                            <li key={organization.username}>Username: {organization.username}</li>
                          </ul>
                        </h5>
                      </Button>
                    </CardHeader>
                    <Collapse isOpen={this.state.accordion[0]} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                      <CardBody>
                      <ul>
                          <li key={organization.username}>Email Address: {organization.email}</li>
                          <li key={organization.username}>Eth Address: {organization.eth_address}</li>
                          <li key={organization.username}>Bank Account: {organization.bank_account}</li>
                          <li key={organization.username}>Physical Address: {organization.physical_address}</li>
                          <li key={organization.username}>Full Name: {organization.name}</li>
                          <li key={organization.username}>Contact Number: {organization.contact_number}</li>
                          <li key={organization.username}>Financial Information: {organization.financial_info}</li>
                          <li key={organization.username}>Description: {organization.description}</li>
                          <li key={organization.username}>Registration Hash: {organization.registration_hash}</li>
                        </ul>
                      </CardBody>
                      <Button block outline color="success" onClick={() => this.approveCharity(organization)} >Approve</Button>
                      <Button block outline color="danger" onClick={() => this.rejectCharity(organization)} >Reject</Button>
                    </Collapse>
                  </Card>
                </div>
              </CardBody>
            </Card>
          </Col>
          )})
          }
        </Row>
      </div>
    )
  }
}
export default ManageCharities;
