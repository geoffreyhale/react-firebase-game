import React from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import MODALITIES from '../Posts/Modality/MODALITIES';

const Modalities = (props) => {
  const defaultActiveKey = props.location.hash ? props.location.hash : null;

  const modalities = Object.entries(MODALITIES)
    .filter(([key, MODALITY]) => MODALITY.available)
    .map(([key, MODALITY]) => {
      const modality = MODALITY;
      modality.key = key;
      return modality;
    })
    .sort((a, b) =>
      a.title.localeCompare(b.title, undefined, { ignorePunctuation: true })
    );

  return (
    <Card>
      <Card.Header>Training</Card.Header>
      <Card.Body>
        <Card.Title>Modalities</Card.Title>
        <Tab.Container
          id="list-group-tabs-example"
          defaultActiveKey={defaultActiveKey}
        >
          <Row>
            <Col sm={4} className="col-left">
              <ListGroup>
                {modalities.map((modality) => (
                  <ListGroup.Item action href={`#${modality.key}`}>
                    {modality.title}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
            <Col sm={8} className="col-main">
              <Tab.Content>
                {modalities.map((modality) => (
                  <Tab.Pane eventKey={`#${modality.key}`}>
                    <h2>{modality.title}</h2>
                    {modality.description}
                  </Tab.Pane>
                ))}
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Card.Body>
    </Card>
  );
};
export default Modalities;
