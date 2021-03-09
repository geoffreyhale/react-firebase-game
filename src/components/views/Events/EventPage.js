import React, { useContext, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { useHistory, withRouter } from 'react-router';
import { getEvent, updateEvent } from '../../../api';
import { AppContext } from '../../AppProvider';
import { PremiumFeature } from '../../shared/Premium';
import { UserPhoto } from '../../shared/User';
import { eventTimestamp } from '../../shared/friendlyTimestamp';

const FormLabel = ({ children }) => (
  <div className="text-muted small">{children}</div>
);

const EventPage = (props) => {
  const history = useHistory();
  const { user, users } = useContext(AppContext);
  const [event, setEvent] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState();
  const [location, setLocation] = useState();
  const [description, setDescription] = useState();
  const [uids, setUids] = useState({});

  const { eventId } = props.match.params;

  useEffect(() => {
    if (user.isPremium) {
      getEvent({ eventId }, (event) => {
        setEvent(event);
        setTitle(event.title);
        setLocation(event.location);
        setDescription(event.description);
        setUids(event.uids || {});
      });
    }
  }, [eventId]);

  if (!user.isPremium) {
    return <PremiumFeature featureName={'Events'} />;
  }

  if (!event.id) {
    return null;
  }

  if (!Object.keys(event.uids).includes(user.uid) && event.uid !== user.uid) {
    return 'Private Event';
  }

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        updateEvent(event.id, { description, location, title, uids }, () => {
          history.go(0);
        });
      }}
    >
      <Card>
        <Card.Body>
          <div>
            <div>
              <small className="text-muted">
                {event.start &&
                  eventTimestamp(event.start.seconds, event.end?.seconds)}
              </small>
            </div>
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
          <div
            className="mt-3"
            key={uids && typeof uids === 'object' && Object.keys(uids).length}
          >
            {editMode ? (
              <>
                <UserPhoto uid={event.uid} showNameTitle={true} />
                <br />
                <FormLabel>Guest List</FormLabel>
                {uids &&
                  typeof uids === 'object' &&
                  Object.keys(uids).map((uid) => (
                    <span
                      onClick={() => {
                        const newUids = Object.assign({}, uids);
                        delete newUids[uid];
                        setUids(newUids);
                      }}
                      key={uid}
                    >
                      <UserPhoto uid={uid} noLink={true} showNameTitle={true} />
                    </span>
                  ))}
                <hr />
                <FormLabel>Invite</FormLabel>
                {Object.values(users)
                  .filter(
                    (user) =>
                      event.uid !== user.uid &&
                      (!uids ||
                        typeof uids !== 'object' ||
                        !Object.keys(uids).includes(user.uid))
                  )
                  .map((user) => (
                    <span
                      onClick={() => {
                        const newUids = Object.assign({}, uids);
                        newUids[user.uid] = true;
                        setUids(newUids);
                      }}
                      key={user.uid}
                    >
                      <UserPhoto
                        uid={user.uid}
                        noLink={true}
                        showNameTitle={true}
                      />
                    </span>
                  ))}
              </>
            ) : (
              <>
                <UserPhoto uid={event.uid} showNameTitle={true} />
                {event.uids &&
                  typeof event.uids === 'object' &&
                  Object.keys(event.uids).map((uid) => (
                    <UserPhoto key={uid} uid={uid} showNameTitle={true} />
                  ))}
              </>
            )}
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

          {user.uid === event.uid && !editMode && (
            <>
              <hr />
              <Button variant="link" onClick={() => setEditMode(!editMode)}>
                edit
              </Button>
            </>
          )}
          {editMode && (
            <>
              <hr />
              <div className="mt-1">
                <Button variant="primary" type="submit">
                  Save
                </Button>
                <Button
                  className="ml-1"
                  variant="danger"
                  type="button"
                  onClick={() => {
                    setEditMode(false);
                    setTitle(event.title);
                    setLocation(event.location);
                    setDescription(event.description);
                    setUids(event.uids || {});
                  }}
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </Form>
  );
};
export default withRouter(EventPage);
