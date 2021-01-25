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
          <h2>What is xBook?</h2>
          <p>
            <a href="https://xbk.io/">xBook</a> is a social network for healthy
            relating.
          </p>
          {/* <p>
            We value respectful, considerate participation. We value rationality
            and empathy. We welcome all ideas and feelings.
          </p> */}
          {/* <h2>What's different about it?</h2>*/}
          <h2>How do I play?</h2>
          <p>
            Say hello in <a href="https://xbk.io/r/general">r/general</a>.
          </p>
          <h2>What is it built with?</h2>
          <p>
            It is a JavaScript application that runs in your web browser, using
            the <a href="https://reactjs.org/">React</a> framework.
          </p>
          <p>
            Backend concerns are handled with{' '}
            <a href="https://firebase.google.com/">Firebase</a> Realtime
            Database and Cloud Firestore.
          </p>
          <h2>Who are we?</h2>
          <p>
            We build an online social networking platform for healthy relating.
            We were founded in 2020 by an engineer exceptionally passionate
            about healthy relating.
          </p>
        </Card.Body>
      </Card>
    </Col>
    <Col></Col>
  </Row>
);

export default About;
