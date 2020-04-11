import React, { Component } from "react";
import LoadingOverlay from "react-loading-overlay";
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
  Progress,
  Alert
} from "reactstrap";
import { AppSwitch } from "@coreui/react";
import Moment from 'react-moment';

import client, {
  approvedProjectRetrieval,
  projectStop,
  downloadBeneficiaryList
} from "../../../../services/axios_api";
class ManageActiveProjects extends Component {
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

    var tempDate = new Date();
    var date = tempDate.getFullYear() + '-' + (tempDate.getMonth()+1) + '-' + tempDate.getDate();
    this.state = {
      collapse: false,
      accordion: [true, false, false],
      custom: [true, false],
      status: "Closed",
      fadeIn: true,
      timeout: 300,
      
      activeProjects: [], 
      stopProject: false, 
      inspectorAddress: this.getCookie("admin"),

      visible: false,
      alertColor: "info",
      alertMessage: "I am an alert message",
      loading: false, 
      today: date
    };
    this.onDismiss = this.onDismiss.bind(this);
  }

  triggerAlert = (color, message) => {
    this.setState({
      alertColor: color,
      alertMessage: message
    });
    this.onDismiss();
    setTimeout(this.onDismiss, 3000);
  };

  onDismiss() {
    this.setState({ visible: !this.state.visible });
    
  }

  getCookie = (name) => {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  toggle(i) {
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return index === i ? !element : false;
    });
    this.setState({
      dropdownOpen: newArray,
      collapse: !this.state.collapse
    });
  }

  onEntering() {
    this.setState({ status: "Opening..." });
  }

  onEntered() {
    this.setState({ status: "Opened" });
  }

  onExiting() {
    this.setState({ status: "Closing..." });
  }

  onExited() {
    this.setState({ status: "Closed" });
  }

  toggleAccordion(tab) {
    const prevState = this.state.accordion;
    const state = prevState.map((x, index) => (tab === index ? !x : false));

    this.setState({
      accordion: state
    });
  }

  toggleCustom(tab) {
    const prevState = this.state.custom;
    const state = prevState.map((x, index) => (tab === index ? !x : false));

    this.setState({
      custom: state
    });
  }

  toggleFade() {
    this.setState({ fadeIn: !this.state.fadeIn });
  }

  downloadBeneficiaryList = id => {
    downloadBeneficiaryList(id)
  }

  componentDidMount() { 
    approvedProjectRetrieval().then(
      result => {
        this.setState({loading: true}); 
        let data = result.data;
        console.log(data);
        if (data["code"] === 200) {
          var project_list = [];
          for (var item in data['items']) {
            var obj = data['items'][item];
            if (obj.expirationDate <= this.state.today ){
              project_list.push(obj);
            }
          }
          this.setState({
            loading:false,
            activeProjects: project_list});
        } else {
          this.setState({
            loading: false
          });
        }
      }
    );
  }

  retrieveActiveProjects = () => {
    approvedProjectRetrieval().then(
      result => {
        this.setState({loading: true}); 
        let data = result.data;
        if (data["code"] === 200) {
          var project_list = [];
          for (var item in data['items']) {
            var obj = data['items'][item];
            if (obj.expirationDate <= this.state.today ){
              project_list.push(obj);
            }
          }
          this.setState({
            loading:false,
            activeProjects: project_list});
        } else {
          this.setState({
            loading: false
          });
        }
      }
    );
  };

  stopProject = stoppingProject => {
    var data = new FormData();
    data.set("project_solidity_id", stoppingProject.project_solidity_id);
    data.set("inspectorAddress", this.state.inspectorAddress);

    this.setState({ loading: true });

    projectStop(data)
      .then(response => {
        if (response.data["code"] === 200) {
          this.setState({ 
            stopProject: true,
            loading:false 
          });
          this.retrieveActiveProjects();
          this.triggerAlert("success", "Project has been stopped");
        } else {
          this.setState({loading:false}); 
          this.triggerAlert("danger", response.data["message"]);
        }
      })
      .catch(e => {
        console.log(e);
      })
      .then(() => {
        this.setState({ 
          stopProject: false,
          loading:false 
        });
      });
  };

  render() {
    const { activeProjects } = this.state;
    if (!activeProjects) {
      return [];
    }
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
            <i className="fa fa-align-justify"></i> Active Projects
          </CardHeader>
          <CardBody>
            <Alert color={this.state.alertColor} isOpen={this.state.visible} toggle={this.onDismiss}>
              {this.state.alertMessage}
            </Alert>
            {activeProjects.map(project => {
              return (
                <Card className="mx-auto my-2" key={project.projectName}>
                  <CardBody>
                    <Row>
                      <Col sm='6' style={{ textAlign: "left" }}>
                        <h3>Project Name: {project.projectName}</h3>
                      </Col>
                      <Col sm="6" style={{ textAlign: "right" }}>
                        <h6 className = 'mt-0' style={{textAlign: "right"}}>
                          <Moment diff={this.state.today} unit="days">{project.expirationDate}</Moment> more days
                        </h6>
                      </Col>
                    </Row>
                    <ul>
                      <li key={project.projectCategory}>
                        Category: {project.projectCategory}
                      </li>
                      <li key={project.expirationDate}>
                        Expiration Date: {project.expirationDate}
                      </li>
                      <li key={project.description}>
                        Description: {project.description}
                      </li>
                      <li key={project.project_solidity_id}>
                        Project Blockchain ID: {project.project_solidity_id}
                      </li>
                      <li key={project.charityAddress}>
                        Charity Ethereum Address: {project.charityAddress}
                      </li>
                      <li key={project.registration_hash}>
                        Registration Hash: {project.registration_hash}
                      </li>
                      <li key={project.approval_hash}>
                        Approval Hash: {project.approval_hash}
                      </li>
                      <li>
                        Beneficiary List: 
                        <span
                            style={{
                              color: "royalblue",
                              textDecoration: "underline",
                              cursor: "pointer",
                              marginLeft: "1rem",
                            }}
                            onClick={() => this.downloadBeneficiaryList(project._id)}
                          >
                            Download file
                        </span>
                      </li>
                      <li key={project.fundTarget}>
                        Funding Target: {project.fundTarget}
                      </li>
                      <li key={project.breakdownList}>
                        Budget Breakdown: {project.breakdownList}
                      </li>
                      <li key={project.actual_amount}>
                        Funding Status: Raised ${project.actual_amount} from {project.numDonors} donations 
                        <Progress animated color="info" value={project.actual_amount/project.fundTarget*100} className="mb-3" >
                          {project.actual_amount/project.fundTarget*100}%
                        </Progress>
                        {/* <Progress animated color="info" value='80' className="mb-3" >
                          80%
                        </Progress> */}
                      </li>
                    </ul>
                    <Row>
                      <Col style={{ textAlign: "center" }}>
                        <Button
                          outline
                          color="danger"
                          onClick={() => this.stopProject(project)}
                        >
                          Stop Project
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
    );
  }
}
export default ManageActiveProjects;
