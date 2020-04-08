import React, { Component } from 'react';
import LoadingOverlay from 'react-loading-overlay';
import { 
  Badge, 
  Button, 
  Card, 
  CardBody, 
  CardFooter, 
  CardHeader, 
  Col, 
  Row, 
  Collapse, 
  Fade, 
  Alert 
} from 'reactstrap';
import { AppSwitch } from '@coreui/react'

import client, { 
  pendingCharityRetrieval, 
  charityApproval, 
  charityReject 
} from "../../../../services/axios_api";

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

      pendingOrganizations: null,
      approveCharity: false,
      rejectCharity: false, 
      inspectorAddress: this.getCookie("admin"),
      charityOrganizationAddress: null,

      visible: false,
      alertColor: "info",
      alertMessage: "I am an alert message",

      loading: false
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
    this.setState({ visible: !this.state.visible });
  };

  getCookie = (name) => {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

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
          this.setState({loading: true});
          let data = result.data
          if (data["code"] === 200){
            this.setState({
              loading: false,
              pendingOrganizations: data["items"]
            });
          }else{
            this.setState({
              loading: false
            })
          }
        },
      )
  }

  retrievePendingCharity = () =>{
    pendingCharityRetrieval()
      .then(
        (result) => {
          let data = result.data
          this.setState({loading: true}); 
          if (data["code"] === 200){
            this.setState({
              loading: false,
              pendingOrganizations: data["items"]
            });
          }else{
            this.setState({
              loading: false
            })
          }
        },
      )
    }

  approveCharity = approvingCharity => {
    var data = new FormData();
    data.set("charityAddress", approvingCharity.eth_address);
    data.set("inspectorAddress", this.state.inspectorAddress); 
    this.setState({ loading: true });
    charityApproval(data)
      .then(response => {
        if (response.data["code"] === 200) {
          this.setState({ 
            loading: false
          });
          this.retrievePendingCharity()
          this.triggerAlert("success", "Charity has been approved");
        } else {
          this.triggerAlert("danger", response.data["message"]);
        }
      })
      .catch(e => {
        console.log(e);
      })
      .then(() => {
        this.setState({ 
          loading: false
        });
      });
  }; 

  rejectCharity = rejectingCharity => {
    var data = new FormData();
    data.set("charityAddress", rejectingCharity.eth_address);
    data.set("inspectorAddress", this.state.inspectorAddress); 
    this.setState({ loading: true });
    charityReject(data)
      .then(response => {
        if (response.data["code"] === 200) {
          this.setState({ loading: false });
          this.retrievePendingCharity()
          this.triggerAlert("success", "Charity has been rejected");
        } else {
          this.triggerAlert("danger", response.data["message"]);
        }
      })
      .catch(e => {
        console.log(e);
      })
      .then(() => {
        this.setState({ loading: false });
      });
  }; 

  render() {
    const {pendingOrganizations } = this.state;
  
    if (!pendingOrganizations) { return [] }
    return (
      <LoadingOverlay
        active={this.state.loading}
        spinner
        text="Loading..."
        backgroundColor={"gray"}
        opacity="0.4"
        style={{width:"100%"}}
      >
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> Pending Charity Organizations  
          </CardHeader>
          <CardBody>
            <Alert color={this.state.alertColor} isOpen={this.state.visible} toggle={this.onDismiss}>
              {this.state.alertMessage}
            </Alert>
            {pendingOrganizations.map( organization => {
              return(
                // <Card className="mb-0" key = {organization.username} >
                <Card className="mx-auto my-2" key = {organization.username} >
                  <CardBody>
                    <h3>Username: {organization.username}</h3>
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
                      <Row>
                      <Col sm="6" style={{ textAlign: "center" }}>
                        <Button
                          outline
                          color="success"
                          onClick={() => this.approveCharity(organization)}
                        >
                          Approve
                        </Button>
                      </Col>
                      <Col sm="6" style={{ textAlign: "center" }}>
                        <Button
                          outline
                          color="danger"
                          onClick={() => this.rejectCharity(organization)}
                        >
                          Reject
                        </Button>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              );
            })}
          </CardBody>
        </Card>
      </div>
    </LoadingOverlay>
    )
  }
}
export default ManageCharities;
