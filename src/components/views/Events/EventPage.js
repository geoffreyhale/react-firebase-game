import React, { useContext, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { useHistory, withRouter } from 'react-router';
import { getEvent, updateEvent, upsertEvent } from '../../../api';
import { AppContext } from '../../AppProvider';
import HowToGetPremium from '../../shared/Premium/HowToGetPremium';
import { UserPhoto } from '../../shared/User';
import { eventTimestamp } from '../../shared/timestamp';

/**
 * TODO
 * dates and times
 * visbility
 * invitations
 * posting
 * og tags for page title when sharing via sms
 * change property name "title" to "name"
 */

const FormLabel = ({ children }) => (
  <div className="text-muted small">{children}</div>
);

export const Event = ({ id }) => {
  const history = useHistory();
  const { user, users } = useContext(AppContext);
  const [event, setEvent] = useState({});
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (!id) {
      setEvent({ uid: user.uid });
      setEditMode(true);
      return;
    }
    getEvent({ eventId: id }, (event) => {
      setEvent(event);
    });
  }, [id]);

  if (event.visibility === 'premium' && !user.isPremium) {
    return (
      <div>
        This is a premium event.
        <br />
        <HowToGetPremium />
      </div>
    );
  }

  let onSubmit = event.id
    ? (e) => {
        e.preventDefault();
        //TODO should be able to use same upsert for onSubmit here
        updateEvent(event.id, event, () => {
          history.go(0);
        });
      }
    : (e) => {
        e.preventDefault();
        //TODO should be able to just use state.event here
        upsertEvent(event, (id) => {
          history.push(`/events/${id}`);
        });
      };

  // if (!Object.keys(event.uids).includes(user.uid) && event.uid !== user.uid) {
  //   return 'Private Event';
  // }

  const { uids } = event;

  return (
    <Form onSubmit={onSubmit}>
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
                <FormLabel>Event Name</FormLabel>
                <Form.Control
                  type="text"
                  label="title"
                  value={event.title}
                  onChange={(e) =>
                    setEvent({ ...event, title: e.target.value })
                  }
                  autoFocus={true}
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
                    value={event.location}
                    onChange={(e) =>
                      setEvent({ ...event, location: e.target.value })
                    }
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
                        setEvent({ ...event, uids: newUids });
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
                        setEvent({ ...event, uids: newUids });
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
                {uids &&
                  typeof uids === 'object' &&
                  Object.keys(uids).map((uid) => (
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
                  value={event.description}
                  onChange={(e) =>
                    setEvent({ ...event, description: e.target.value })
                  }
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

          {(user.uid === event.uid || !event.id) && !editMode && (
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
                    history.go(0);
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

const EventPage = (props) => <Event id={props.match.params.eventId} />;
export default withRouter(EventPage);
