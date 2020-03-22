import React, { Component, lazy, Suspense } from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import "../client.css";

const Slider = lazy(() => import("../../../component/slider"));

class Cover extends Component {
  constructor(props) {
    super(props);

    this.state = {};
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
              margin: "auto"
            }}
          >
            Latest Projects
          </h2>
          <Row className="mt-3">
            <Col xs="6" sm="4">
              <Card>
                <CardBody>
                  <img src="assets/img/avatars/1.jpg"></img>
                </CardBody>
              </Card>
            </Col>
            <Col xs="6" sm="4">
              <Card>
                <CardBody>
                  <img src="assets/img/avatars/1.jpg"></img>
                </CardBody>
              </Card>
            </Col>
            <Col xs="6" sm="4">
              <Card>
                <CardBody>
                  <img src="assets/img/avatars/1.jpg"></img>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
        <Container className="mt-3 mb-3">
          <Card>
            <CardBody>
              <h2
                style={{
                  borderBottom: "2px solid #000",
                  width: "fit-content",
                  margin: "auto"
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
                      <i class="fa fa-check"></i> Address transparency issue
                    </li>
                    <li>
                      <i class="fa fa-check"></i> Enhance accountability of
                      donors funds
                    </li>
                    <li>
                      <i class="fa fa-check"></i> Aids audit trailing
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
                  margin: "auto"
                }}
              >
                Contact Us
              </h2>
              <Row className="mt-3">
                <Col xs="12" sm="4">
                    <div style={{textAlign:"center"}}>
                      <i className="fa fa-mobile singleIcon"></i>
                      <p>
                        Call: +65 6666 8888
                        <br />
                        <span>Monday-Friday (9am-5pm)</span>
                      </p>
                    </div>
                </Col>
                <Col xs="12" sm="4">
                    <div style={{textAlign:"center"}}>
                      <i class="fa fa-envelope-o singleIcon"></i>
                      <p>
                        Email: info@example.com
                        <br />
                        <span>Web: www.TRANSACT.com</span>
                      </p>
                    </div>
                </Col>

                <Col xs="12" sm="4">
                    <div style={{textAlign:"center"}}>
                      <i class="fa fa-map-marker singleIcon"></i>
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
          <Card style={{border:"0px"}}></Card>
        </Container>
      </div>
    );
  }
}

export default Cover;
