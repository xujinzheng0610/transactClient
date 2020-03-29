import React, { Component } from 'react';
import { Badge, Button, Card, CardBody, CardFooter, CardHeader, Col, Row, Collapse, Fade } from 'reactstrap';
import { AppSwitch } from '@coreui/react'

import client, { pendingDonorRetrieval, donorApproval, pendingCharityRetrieval, charityApproval, charityReject } from "../../../../services/axios_api";
class ManageRecords extends Component {
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
      pendingDonors: null,
      error: null, 
      isLoaded: false, 
      approveDonor: false, 

      pendingOrganizations: null,
      approveCharity: false,
      rejectCharity: false, 

      inspectorAddress: '0x17cdE956d17e885Bb5D59F9addA34AD4cb530E7e', 
      donorAddress: null,
      charityOrganizationAddress: null 
    };
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
    pendingDonorRetrieval()
      .then(
        (result) => {
          console.log('checkinginging')
          let data = result.data
          console.log(data)
          if (data["code"] === 200){
            console.log('checking')
            console.log(data['items'])
            this.setState({
              isLoaded: true,
              pendingDonors: data["items"]
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

  triggerAlert = (color, message) => e => {
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

  approveDonor = approvingDonor => {
    var data = new FormData();
    data.set("donorAddress", approvingDonor.eth_address);
    data.set("inspectorAddress", "0x17cdE956d17e885Bb5D59F9addA34AD4cb530E7e"); 
    console.log("Donor Address");
    console.log(approvingDonor.eth_address);
    this.setState({ isLoaded: true });

    donorApproval(data)
      .then(response => {
        if (response.data["code"] === 200) {
          console.log("approving donor should be fine");
          console.log(response.data["code"])
          this.setState({ approveDonor: true });
        } else {
          console.log("approving donor What's wrong with you")
          console.log(response.data["code"])
          this.triggerAlert("danger", response.data["message"]);
        }
      })
      .catch(e => {
        console.log(e);
      })
      .then(() => {
        this.setState({ approveDonor: false });
      });
  }; 

  approveCharity = approvingCharity => {
    var data = new FormData();
    data.set("charityAddress", approvingCharity.eth_address);
    data.set("inspectorAddress", "0x17cdE956d17e885Bb5D59F9addA34AD4cb530E7e"); 
    console.log("charityAddress");
    console.log(approvingCharity.eth_address);
    this.setState({ isLoaded: true });
    charityApproval(data)
      .then(response => {
        if (response.data["code"] === 200) {
          console.log("should be fine");
          console.log(response.data["code"])
          this.setState({ approveCharity: true });
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
    data.set("inspectorAddress", "0x17cdE956d17e885Bb5D59F9addA34AD4cb530E7e"); 
    console.log("charityAddress");
    console.log(rejectingCharity.eth_address);
    this.setState({ isLoaded: true });
    charityReject(data)
      .then(response => {
        if (response.data["code"] === 200) {
          console.log("should be fine");
          console.log(response.data["code"])
          this.setState({ rejectCharity: true });
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
    const { pendingDonors, pendingOrganizations } = this.state;
  
    if (!pendingDonors) { return [] }
    if (!pendingOrganizations) { return [] }
    return (
      <div className="animated fadeIn">
        <Row>
          {
          pendingDonors.map( donor => {return(
          <Col md="12" lg="1l2" xl="12">
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Records  
                <div className="card-header-actions">
                  <Badge>NEW</Badge>
                </div>
              </CardHeader>
              <CardBody>
                <div id="accordion">
                  <Card className="mb-0">
                    <CardHeader id="headingOne">
                      <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordion(0)} aria-expanded={this.state.accordion[0]} aria-controls="collapseOne">
                        <h5 className="m-0 p-0">Pending User</h5>
                      </Button>
                      <div className="card-header-actions">
                        <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                          
                        </Col>
                      </div>
                    </CardHeader>
                    <Collapse isOpen={this.state.accordion[0]} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                      <CardBody>
                        <ul>
                          <li key={donor.username}>Username: {donor.username}</li>
                          <li key={donor.username}>Email Address: {donor.email}</li>
                          <li key={donor.username}>Bank Account: {donor.bank_account}</li>
                          <li key={donor.username}>Physical Address: {donor.physical_address}</li>
                          <li key={donor.username}>Full Name: {donor.full_name}</li>
                          <li key={donor.username}>Contact Number: {donor.contact_number}</li>
                          <li key={donor.username}>Financial Information: {donor.financial_info}</li>
                          <li key={donor.username}>Registration Hash: {donor.registration_hash}</li>
                        </ul>
                      </CardBody>
                      <Button block outline color="success" onClick={() => this.approveDonor(donor)} >Approve</Button>
                    </Collapse>
                  </Card>
                </div>
              </CardBody>
            </Card>
          </Col>
          )})
          }
          {
          pendingOrganizations.map( organization => {return(
          <Col md="12" lg="1l2" xl="12">
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Charity Organizations  
                <div className="card-header-actions">
                  <Badge>NEW</Badge>
                </div>
              </CardHeader>
              <CardBody>
                <div id="accordion">
                  <Card className="mb-0">
                    <CardHeader id="headingOne">
                      <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordion(0)} aria-expanded={this.state.accordion[0]} aria-controls="collapseOne">
                        <h5 className="m-0 p-0">Pending Organization</h5>
                      </Button>
                      <div className="card-header-actions">
                        <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                          {/* <Button block outline color="success" onClick={this.approveCharity}>Approve</Button> */}
                          {/* <Button block outline color="danger" onClick={this.rejectCharity}>Reject</Button> */}
                        </Col>
                      </div>
                    </CardHeader>
                    <Collapse isOpen={this.state.accordion[0]} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                      <CardBody>
                      <ul>
                          <li key={organization.username}>Username: {organization.username}</li>
                          <li key={organization.username}>Email Address: {organization.email}</li>
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
export default ManageRecords;
