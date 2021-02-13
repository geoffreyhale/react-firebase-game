import React from 'react';
import { Card } from 'react-bootstrap';

export default class Settings extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <Card>
        <Card.Header>Settings</Card.Header>
        <Card.Body>
          <Card.Title>Settings</Card.Title>
        </Card.Body>
      </Card>
    );
  }
}
