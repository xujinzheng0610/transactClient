import React, { Component, lazy, Suspense, Link,  } from "react";
import { Container, Row, Col, Card, CardBody, Progress, Button  } from "reactstrap";
import "../client.css";
import { retrieveAllProjects } from "../../../services/axios_api";
import { FaCalendar } from "react-icons/fa";

const Slider = lazy(() => import("../../../component/slider"));

class Cover extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projects: [],
    };
  }

  componentDidMount() {
    retrieveAllProjects().then(
      (response) => {
        let projects = response.data.result

        if (projects.length > 3){
          projects.slice(0, 3)
        }
        this.setState({
          projects: projects
        })
      })
      .catch((e) => {
        console.log(e);
      });
  }

  loading = () => (
    <div className="animated fadeIn pt-1 text-center">Loading...</div>
  );

  render() {
    return (
      <div>
        <Suspense fallback={this.loading()}>
          <Slider />
        </Suspense>
        <Container className="mt-3 mb-3">
          <h2
            style={{
              borderBottom: "2px solid #000",
              width: "fit-content",
              margin: "auto",
            }}
          >
            Latest Projects
          </h2>
          <Row className="mt-3 mb-3">
            {this.state.projects.map((item) => {
              return (
                <Col xs="12" sm="8" md="4" style={{margin: "0 auto"}}>
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
                      <p>{item.description}</p>
                      <div style={{ textAlign: "center" }}>
                          <Button outline color="primary" onClick={() => {window.location.replace(`/project/${item._id}`)}}>
                            KNOW PROJECT BETTER
                          </Button>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Container>
        <Container className="mt-3 mb-3">
          <Card>
            <CardBody>
              <h2
                style={{
                  borderBottom: "2px solid #000",
                  width: "fit-content",
                  margin: "auto",
                }}
              >
                About TransACT
              </h2>
              <Row className="mt-3">
                <Col xs="12" sm="6">
                  <img
                    src="assets/img/slider/background2.png"
                    alt=""
                    style={{ width: "100%", height: "100%" }}
                  ></img>
                </Col>
                <Col xs="12" sm="6">
                  <h4> Our methodology</h4>
                  <p>
                    With Ethereum blockchain, charities first create project
                    accounts which are identified with a hashcode. The new
                    Visibility Guide framework introduced by the Commissioner of
                    Charities (COC) will be utilised to ensure accounts are
                    indeed legitimate. Donors will hence be able to donate with
                    more confidence.
                  </p>
                  <p>
                    To assure donors that their money is spent on the right
                    items, the money used by the charities have to be recorded
                    on the blockchain as well. We require the charities to send
                    us the invoices or receipts of their various purchases, and
                    then process these invoices and subsequently store them as a
                    string value within a smart contract.
                  </p>
                  <ul style={{ listStyleType: "none" }}>
                    <li>
                      <i className="fa fa-check"></i> Address transparency issue
                    </li>
                    <li>
                      <i className="fa fa-check"></i> Enhance accountability of
                      donors funds
                    </li>
                    <li>
                      <i className="fa fa-check"></i> Aids audit trailing
                    </li>
                  </ul>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Container>
        <Container className="mt-3 mb-3">
          <Card>
            <CardBody>
              <h2
                style={{
                  borderBottom: "2px solid #000",
                  width: "fit-content",
                  margin: "auto",
                }}
              >
                Contact Us
              </h2>
              <Row className="mt-3">
                <Col xs="12" sm="4">
                  <div style={{ textAlign: "center" }}>
                    <i className="fa fa-mobile singleIcon"></i>
                    <p>
                      Call: +65 6666 8888
                      <br />
                      <span>Monday-Friday (9am-5pm)</span>
                    </p>
                  </div>
                </Col>
                <Col xs="12" sm="4">
                  <div style={{ textAlign: "center" }}>
                    <i className="fa fa-envelope-o singleIcon"></i>
                    <p>
                      Email: info@example.com
                      <br />
                      <span>Web: www.TRANSACT.com</span>
                    </p>
                  </div>
                </Col>

                <Col xs="12" sm="4">
                  <div style={{ textAlign: "center" }}>
                    <i className="fa fa-map-marker singleIcon"></i>
                    <p>
                      Location: 21 Kent Ridge
                      <br />
                      <span>NY 510000,Singapore </span>
                    </p>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Container>
        <Container className="mb-5">
          <Card style={{ border: "0px" }}></Card>
        </Container>
      </div>
    );
  }
}

export default Cover;
