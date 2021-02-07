import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';

export default class SmartGuide extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Accordion /*defaultActiveKey="0"*/ className="mt-3">
        <Card bg="light">
          <Accordion.Toggle as={Card.Header} eventKey="0">
            Guide
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0">
            <Card.Body>
              <Card.Title>Guide</Card.Title>
              <p>What to do next?</p>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    );
  }
}
