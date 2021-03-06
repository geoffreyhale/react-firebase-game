import React from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Link } from 'react-router-dom';

export const AboutContent = () => (
  <>
    <h2>What is xBook?</h2>
    <p>
      <Link to="/" style={{ color: 'inherit', fontWeight: '500' }}>
        xBook
      </Link>{' '}
      is the #1 social network for{' '}
      <Link to="/r/healthyrelating">healthy relating</Link> and{' '}
      <Link to="/r/productivity">productivity</Link>.
    </p>
    <p>xBook focuses on meaningful connection and self-work together.</p>
    {/* <p>xBook will never sell your data.</p> */}
    {/* <p>
            We value respectful, considerate participation. We value rationality
            and empathy. We welcome all ideas and feelings.
            safety, vulnerability, emotional intimacy, deep, meaningful connections
          </p> */}
    {/* <h2>What's different about it?</h2>*/}
    <h2>How do I play?</h2>
    <p>
      Log in for free and introduce yourself in{' '}
      <Link to="/r/general">r/general</Link>.
    </p>
    <p>
      Check out the library of writing exercises in the{' '}
      <Link to="/training">training room</Link>.
    </p>
    <p>
      Join premium for $1/mo to join us in{' '}
      <Link to="/r/healthyrelating">r/healthyrelating</Link> and{' '}
      <Link to="/r/productivity">r/productivity</Link>.
    </p>
    {/* <h2>How do I pay?</h2>
          <p>
            Log in and ask us anything in <Link to="/r/general">r/general</Link>
            .
          </p> */}
    <h2>Who are we?</h2>
    <p>
      We build an online social networking platform for{' '}
      <Link to="/r/healthyrelating">healthy relating</Link> and{' '}
      <Link to="/r/productivity">productivity</Link>.
    </p>
    <p>
      We were founded in 2020 by{' '}
      <Link to="/u/GS6qQS0bCMWbeonwBAauvjlCsen1" style={{ color: 'inherit' }}>
        Geoffrey Hale
      </Link>
      , an engineer passionate about{' '}
      <Link to="/r/healthyrelating">healthy relating</Link>.
    </p>
    {/* <p>
            If you'd like to know more you can ask us anything in{' '}
            <Link to="/r/general">r/general</Link>.
          </p> */}
    <h2>What is it built with?</h2>
    <p>
      It is a JavaScript application that runs in your web browser, using the{' '}
      {/* <a href="https://reactjs.org/" target="_blank"> */}
      React
      {/* </a> */} framework.
    </p>
    <p>
      Backend concerns are handled with{' '}
      {/* <a href="https://firebase.google.com/" target="_blank"> */}
      Firebase
      {/* </a> */} Realtime Database and Cloud Firestore.
    </p>
  </>
);

const About = () => (
  <Row>
    <Col></Col>
    <Col sm={8}>
      <Card>
        <Card.Body>
          <AboutContent />
        </Card.Body>
      </Card>
    </Col>
    <Col></Col>
  </Row>
);

export default About;
