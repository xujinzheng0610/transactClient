import React, { Component } from "react";
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
} from "reactstrap";
import { AppSwitch } from "@coreui/react";

import client, {
  pendingProjectRetrieval,
  projectApproval, 
  projectReject
} from "../../../../services/axios_api";
class ManageProjects extends Component {
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
      status: "Closed",
      fadeIn: true,
      timeout: 300,
      
      pendingProjects: null, 
      error: null,
      isLoaded: false,
      approveProject: false,
      rejectDonor: false,
      inspectorAddress: this.getCookie("admin"),

      visible: false,
      alertColor: "info",
      alertMessage: "I am an alert message"
    };
    this.onDismiss = this.onDismiss.bind(this);
  }

  triggerAlert = (color, message) => {
    this.setState({
      alertColor: color,
      alertMessage: message
    });
    this.onDismiss();
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

  componentDidMount() { 
    pendingProjectRetrieval().then(
      result => {
        let data = result.data;
        console.log(data);
        if (data["code"] === 200) {
          console.log("checking");
          console.log(data["items"]);
          this.setState({
            isLoaded: true,
            pendingProjects: data["items"]
          });
        } else {
          this.setState({
            isLoaded: true
          });
        }
      },
      error => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    );
  }
  retrievePendingProjects = () => {
    pendingProjectRetrieval().then(
      result => {
        console.log("checkinginging");
        let data = result.data;
        console.log(data);
        if (data["code"] === 200) {
          console.log("checking");
          console.log(data["items"]);
          this.setState({
            isLoaded: true,
            pendingProjects: data["items"]
          });
        } else {
          this.setState({
            isLoaded: true
          });
        }
      },
      error => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    );
  };

  approveProject = approvingProject => {
    var data = new FormData();
    data.set("project_solidity_id", approvingProject.project_solidity_id);
    data.set("inspectorAddress", this.state.inspectorAddress);

    console.log("project_solidity_id");
    console.log(typeof approvingProject.project_solidity_id);

    console.log("inspectorAddress");
    console.log(this.state.inspectorAddress);
    console.log(typeof this.state.inspectorAddress);

    this.setState({ isLoaded: true });

    projectApproval(data)
      .then(response => {
        if (response.data["code"] === 200) {
          console.log("approving project should be fine");
          console.log(response.data["code"]);
          this.setState({ approveProject: true });
          this.retrievePendingProjects();
          this.triggerAlert("success", "Project has been approved");
        } else {
          console.log("approving project What's wrong with you");
          console.log(response.data["code"]);
          console.log(response.data["message"]);
          this.triggerAlert("danger", response.data["message"]);
        }
      })
      .catch(e => {
        console.log(e);
      })
      .then(() => {
        this.setState({ approveProject: false });
      });
  };

  rejectProject = rejectingProject => {
    var data = new FormData();
    data.set("project_solidity_id", rejectingProject.project_solidity_id);
    data.set("inspectorAddress", this.state.inspectorAddress);
    this.setState({ isLoaded: true });

    projectReject(data)
      .then(response => {
        if (response.data["code"] === 200) {
          this.setState({ rejectDonor: true });
          this.retrievePendingProjects();
          this.triggerAlert("success", "Project has been rejected");
        } else {
          this.triggerAlert("danger", response.data["message"]);
        }
      })
      .catch(e => {
        console.log(e);
      })
      .then(() => {
        this.setState({ rejectDonor: false });
      });
  };

  render() {
    const { pendingProjects } = this.state;
    if (!pendingProjects) {
      return [];
    }
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> Pending Projects
          </CardHeader>
          <CardBody>
            <Alert color={this.state.alertColor} isOpen={this.state.visible} toggle={this.onDismiss}>
              {this.state.alertMessage}
            </Alert>
            {pendingProjects.map(project => {
              return (
                <Card className="mb-0" key={project.projectName}>
                  <CardBody>
                    <h3>Project Name: {project.projectName}</h3>
                    <ul>
                      <li key={project.projectCategory}>
                        Category: {project.projectCategory}
                      </li>
                      <li key={project.project_solidity_id}>Project Blockchain ID: {project.project_solidity_id}</li>
                      <li key={project.charityAddress}>
                        Charity Address: {project.charityAddress}
                      </li>
                      {/* <li key={project.beneficiaryList}>
                        Beneficiary List: {project.beneficiaryList}
                      </li> */}
                      <li key={project.expirationDate}>Expiration Date: {project.expirationDate}</li>
                      <li key={project.fundTarget}>
                        Funding Target: {project.fundTarget}
                      </li>
                      <li key={project.description}>
                        Description: {project.description}
                      </li>
                      <li key={project.registration_hash}>
                        Registration Hash: {project.registration_hash}
                      </li>
                    </ul>
                    <Row>
                      <Col sm="6" style={{ textAlign: "center" }}>
                        <Button
                          outline
                          color="success"
                          onClick={() => this.approveProject(project)}
                        >
                          Approve
                        </Button>
                      </Col>
                      <Col sm="6" style={{ textAlign: "center" }}>
                        <Button
                          outline
                          color="danger"
                          onClick={() => this.rejectProject(project)}
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
    );
  }
}
export default ManageProjects;
