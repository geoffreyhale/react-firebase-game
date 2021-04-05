import React, { useContext, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import { useHistory } from 'react-router-dom';
import { getEvents } from '../../../api';
import { eventTimestamp } from '../../shared/timestamp';
import Spinner from '../../shared/Spinner';
import { AppContext } from '../../AppProvider';

const NewEventButton = () => {
  const { user } = useContext(AppContext);
  const history = useHistory();

  //TODO also allow premium users when everything's cleaned up and ready
  if (!user.admin) return null;

  return (
    <Button onClick={() => history.push('/events/new')}>
      Create New Event
    </Button>
  );
};

const EventsPage = () => {
  const history = useHistory();
  const [events, setEvents] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEvents((events) => {
      setEvents(events);
      setLoading(false);
    });
  }, []);

  if (loading) return <Spinner />;

  return (
    <Card>
      <Card.Body>
        <Card.Title>Events</Card.Title>
        <div className="mb-3">
          <NewEventButton />
        </div>
        <Table hover>
          <thead>
            <tr>
              <th>Date Time</th>
              <th>Event Name</th>
              <th>Location</th>
              <th>Visibility</th>
            </tr>
          </thead>
          <tbody>
            {events &&
              Object.values(events)
                // TODO make this work for all time fields, cleanup db
                .sort((a, b) => {
                  return a.start?.seconds - b.start?.seconds;
                })
                .map((event) => {
                  const url = `/events/${event.id}`;
                  return (
                    <tr onClick={() => history.push(url)}>
                      <td>
                        {(event.start &&
                          eventTimestamp(event.start.seconds)) || (
                          <>
                            {event.startDate} {event.startTime} -{' '}
                            {event.endDate} {event.endTime}
                          </>
                        )}
                      </td>
                      <td>
                        {/* TODO bug: click text link, click back, url changes to events but page doesn't */}
                        {/* <Link to={url}>{event.title}</Link> */}
                        <strong>{event.title}</strong>
                      </td>
                      <td>{event.location}</td>
                      <td>{event.visibility}</td>
                    </tr>
                  );
                })}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};
export default EventsPage;
