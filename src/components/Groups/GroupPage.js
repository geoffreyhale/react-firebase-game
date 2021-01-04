import React from 'react';
import { useParams } from 'react-router-dom';
import Card from 'react-bootstrap/Card';

const GroupPage = () => {
  let { groupId } = useParams();
  return (
    <Card>
      <Card.Body>
        <Card.Title>Congratulations!</Card.Title>
        <Card.Body>
          <p>
            You found group page for id:
            <br /> <strong>{groupId}</strong>
          </p>
          <p>
            Page functionality <em>under construction</em>!
          </p>
        </Card.Body>
      </Card.Body>
    </Card>
  );
};

export default GroupPage;
