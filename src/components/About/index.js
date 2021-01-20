import React from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const About = () => (
  <Row>
    <Col></Col>
    <Col sm={8}>
      <Card>
        <Card.Body>
          {/* <Card.Title>About</Card.Title> */}
          <h2>What is it?</h2>
          <p>xbk.io is a social networking platform for healthy relating.</p>
          {/* <p>
            We value respectful, considerate participation. We value rationality
            and empathy. We welcome all ideas and feelings.
          </p> */}
          {/* <h2>What's different about it?</h2>*/}
          <h2>What is it built with?</h2>
          <p>
            xbk.io is a JavaScript application that runs in your web browser,
            using the <a href="https://reactjs.org/">React</a> framework.
          </p>
          <p>
            The server side of xbk.io uses{' '}
            <a href="https://firebase.google.com/">Firebase</a> Realtime
            Database and Cloud Firestore.
          </p>
          <h2>Who are we?</h2>
          <p>
            We build a community platform for healthy relating on the web. We
            started in 2020 by a founder unusually passionate about healthy
            relating. Our team consists of <em>Geoffrey Hale</em> and you, our
            community.
          </p>
        </Card.Body>
      </Card>
    </Col>
    <Col></Col>
  </Row>
);

export default About;
