import React, { useContext, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { useHistory, withRouter } from 'react-router';
import { getEvent, updateEvent } from '../../../api';
import { AppContext } from '../../AppProvider';
import { PremiumFeature } from '../../shared/Premium';

const FormLabel = ({ children }) => (
  <div className="text-muted small">{children}</div>
);

const Events = (props) => {
  const history = useHistory();
  const { user } = useContext(AppContext);
  const [event, setEvent] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState();
  const [location, setLocation] = useState();
  const [description, setDescription] = useState();

  const { eventId } = props.match.params;

  useEffect(() => {
    if (user.isPremium) {
      getEvent({ eventId }, (event) => {
        setEvent(event);
        setTitle(event.title);
        setLocation(event.location);
        setDescription(event.description);
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
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        updateEvent(event.id, { description, location, title }, () => {
          history.go(0);
        });
      }}
    >
      <Card>
        <Card.Body>
          <div>
            {editMode ? (
              <>
                <FormLabel>Title</FormLabel>
                <Form.Control
                  type="text"
                  label="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </>
            ) : (
              <Card.Title className="mb-0">{event.title}</Card.Title>
            )}
            <div>
              {editMode ? (
                <>
                  <FormLabel>Location</FormLabel>
                  <Form.Control
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </>
              ) : (
                <small className="text-muted">{event.location}</small>
              )}
            </div>
          </div>
          <div className="mt-3" style={{ maxWidth: 600 }}>
            {editMode ? (
              <>
                <FormLabel>Description</FormLabel>
                <Form.Control
                  as="textarea"
                  rows={12}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  autoFocus={true}
                />
              </>
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
        </Card.Body>
      </Card>
      {user.uid === event.uid && !editMode && (
        <Button variant="link" onClick={() => setEditMode(!editMode)}>
          edit
        </Button>
      )}
      {editMode && (
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
      )}
    </Form>
  );
};
export default withRouter(Events);
