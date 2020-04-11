import React, { Component, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  Container,
  Row,
  Col,
  Progress,
} from "reactstrap";
import { retrieveAllProjects } from "../../services/axios_api";
import { FaCalendar } from "react-icons/fa";
import LoadingOverlay from "react-loading-overlay";

class Project extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projects: [],
      loading: true,
    };
  }

  componentDidMount() {
    retrieveAllProjects()
      .then((response) => {
        console.log(response);
        this.setState({
          projects: response.data.result,
        });
      })
      .catch((e) => {
        console.log(e);
      })
      .then( () => {
        this.setState({loading:false})
      });
  }

  render() {
    return (
      <LoadingOverlay
        active={this.state.loading}
        spinner
        text="Loading..."
        backgroundColor={"gray"}
        opacity="0.4"
        style={{ width: "100%" }}
      >
        <Container className="pt-3 mb-3" style={{minHeight:"89vh"}}>
          <Row style={{ textAlign: "center" }}>
            <h1
              style={{
                width: "fit-content",
                margin: "auto",
              }}
            >
              Projects
            </h1>
          </Row>
          <Row className="mt-3 mb-3">
            {this.state.projects.map((item) => {
              return (
                <Col xs="12" sm="8" md="4">
                  <Card className="card-accent-primary">
                    <div className="custome-tag">
                      <img
                        src={
                          "data:image/jpeg;charset=utf-8;base64," + item.image
                        }
                        alt="project cover"
                        style={{ width: "100%", height: "100%" }}
                      />
                    </div>
                    <CardBody>
                      <h3 className="mt-0 mb-3">{item.projectName}</h3>
                      <p className="mb-0">
                        <strong>Target: </strong>${item.fundTarget}
                        <FaCalendar style={{ marginLeft: "5rem" }} />
                        <strong>Due: </strong>
                        {item.expirationDate}
                      </p>
                      <Progress
                        animated
                        color="info"
                        value={(item.actual_amount / item.fundTarget) * 100}
                        className="mt-0 mb-3"
                      >
                        {(item.actual_amount / item.fundTarget) * 100}%
                      </Progress>
                      <p>{item.description.substring(0,284)} ...</p>
                      <Col style={{ textAlign: "center" }}>
                        <Link to={`/project/${item._id}`}>
                          <Button outline color="primary">
                            KNOW PROJECT BETTER
                          </Button>
                        </Link>
                      </Col>
                    </CardBody>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Container>
      </LoadingOverlay>
    );
  }
}

export default Project;
