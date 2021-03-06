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
import Spinner from '../../shared/Spinner';

/**
 * TODO
 * visbility
 * invitations
 * posting
 * og tags for page title when sharing via sms
 * change property name "title" to "name"
 */

//TODO handle events w INVISIBILITY.LOGGED_IN, INVISIBILITY.INVITED, INVISIBILITY.UNLISTED
const VISIBILITY = Object.freeze({
  PUBLIC: 'public', // Anyone on or off xBook
  // LOGGED_IN: 'logged_in', // Registered members logged in to xBook
  PREMIUM: 'premium', // Premium members of xBook
  // INVITED: 'invited', // Only people who are invited
  // UNLISTED: 'unlisted', //maybe orthogonal
});

const FormLabel = ({ children }) => (
  <div className="text-muted small">{children}</div>
);

export const Event = ({ id }) => {
  const history = useHistory();
  const { user, users } = useContext(AppContext);
  const [event, setEvent] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id && user.uid) {
      setEvent({ uid: user.uid, visibility: VISIBILITY.PUBLIC });
      setEditMode(true);
      setLoading(false);
      return;
    }
    getEvent({ eventId: id }, (event) => {
      setEvent(event);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <Spinner />;
  }

  if (event.visibility === VISIBILITY.LOGGED_IN && !user) {
    return <div>Please log in to see event details.</div>;
  }

  if (event.visibility === VISIBILITY.PREMIUM && !user.isPremium) {
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
            <div>
              {editMode ? (
                <>
                  <FormLabel>Start Date</FormLabel>
                  <Form.Control
                    type="date"
                    value={event.startDate}
                    onChange={(e) =>
                      setEvent({
                        ...event,
                        startDate: e.target.value,
                      })
                    }
                  />
                  <FormLabel>Start Time</FormLabel>
                  <Form.Control
                    type="time"
                    value={event.startTime}
                    onChange={(e) =>
                      setEvent({
                        ...event,
                        startTime: e.target.value,
                      })
                    }
                  />
                  {/* TODO doesn't handle timezones nor db sort/filter */}
                  <FormLabel>End Date</FormLabel>
                  <Form.Control
                    type="date"
                    value={event.endDate}
                    onChange={(e) =>
                      setEvent({
                        ...event,
                        endDate: e.target.value,
                      })
                    }
                  />
                  {/* TODO doesn't handle timezones nor db sort/filter */}
                  <FormLabel>End Time</FormLabel>
                  <Form.Control
                    type="time"
                    value={event.endTime}
                    onChange={(e) =>
                      setEvent({
                        ...event,
                        endTime: e.target.value,
                      })
                    }
                  />
                </>
              ) : (
                <small className="text-muted">
                  {event.startDate} {event.startTime} - {event.endDate}{' '}
                  {event.endTime}
                </small>
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

          {((user && user.uid === event.uid) || !event.id) && !editMode && (
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
