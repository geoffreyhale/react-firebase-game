import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

const DiggerCard = ({ returnToDeck, returnToField }) => {
  return (
    <Card style={{ width: '8rem', display: 'inline-block' }}>
      <Card.Body>
        <Card.Title>Digger</Card.Title>
        <Card.Text>+1 hole per second</Card.Text>
        <Card.Text>
          <em>Yum, dirt!</em>
        </Card.Text>
        <Card.Text>
          {returnToDeck && (
            <Button variant="danger" onClick={returnToDeck}>
              Deck
            </Button>
          )}
          {returnToField && (
            <Button variant="success" onClick={returnToField}>
              Field
            </Button>
          )}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default DiggerCard;
