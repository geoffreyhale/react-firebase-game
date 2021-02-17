import React, { useContext } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import { AppContext } from '../../AppProvider';
import MODALITIES from '../Posts/Modality/MODALITIES';

const Modalities = () => {
  const { modality: contextModalityKey, setModality } = useContext(AppContext);

  const modalityToShow =
    contextModalityKey &&
    MODALITIES[contextModalityKey] &&
    MODALITIES[contextModalityKey].available
      ? MODALITIES[contextModalityKey]
      : null;

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
        <Row>
          <Col sm={4} className="col-left">
            <ListGroup>
              {modalities.map((modality) => (
                <ListGroup.Item
                  action
                  active={contextModalityKey === modality.key}
                  onClick={() =>
                    setModality(
                      contextModalityKey === modality.key ? null : modality.key
                    )
                  }
                >
                  {modality.title}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          <Col sm={8} className="col-main">
            {modalityToShow && (
              <>
                <h2>{modalityToShow.title}</h2>
                {modalityToShow.description}
              </>
            )}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};
export default Modalities;
