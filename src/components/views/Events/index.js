import React, { useContext, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { useHistory, withRouter } from 'react-router';
import { getEvent, updateEvent } from '../../../api';
import { AppContext } from '../../AppProvider';
import { PremiumFeature } from '../../shared/Premium';

const handleOnSubmit = (e, { id, description }, callback) => {
  e.preventDefault();
  updateEvent(id, { description }, callback);
};

const EditEvent = ({ event, setEditMode }) => {
  const history = useHistory();
  const [description, setDescription] = useState(event.description);
  return (
    <Form
      onSubmit={(e) =>
        handleOnSubmit(e, { id: event.id, description }, () => {
          history.go(0);
        })
      }
    >
      <Form.Control
        as="textarea"
        rows={12}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        autoFocus={true}
      />
      <div className="mt-1">
        <Button variant="primary" type="submit">
          Save
        </Button>
        <Button
          className="ml-1"
          variant="danger"
          type="button"
          onClick={() => setEditMode(false)}
        >
          Cancel
        </Button>
      </div>
    </Form>
  );
};

const Events = (props) => {
  const { user } = useContext(AppContext);
  const [event, setEvent] = useState({});
  const [editMode, setEditMode] = useState(false);

  const { eventId } = props.match.params;

  useEffect(() => {
    if (user.isPremium) {
      getEvent({ eventId }, (event) => {
        setEvent(event);
      });
    }
  }, [eventId]);

  if (!user.isPremium) {
    return <PremiumFeature featureName={'Events'} />;
  }

  if (!event.id) {
    return null;
  }

  return (
    <Card>
      <Card.Body>
        <div>
          <small className="text-muted">You're invited to...</small>
        </div>
        <div className="mt-3">
          <Card.Title className="mb-0">{event.title}</Card.Title>
          <div>
            <small className="text-muted">{event.location}</small>
          </div>
        </div>
        <div className="mt-3" style={{ maxWidth: 600 }}>
          {editMode ? (
            <EditEvent event={event} setEditMode={setEditMode} />
          ) : (
            <span
              style={{
                whiteSpace: 'break-spaces',
              }}
            >
              {event.description}
            </span>
          )}
        </div>
        {user.uid === event.uid && !editMode && (
          <Button variant="link" onClick={() => setEditMode(!editMode)}>
            edit
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};
export default withRouter(Events);
