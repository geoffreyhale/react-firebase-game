import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import { useHistory } from 'react-router-dom';
import { getEvents } from '../../../api';
import { eventTimestamp } from '../../shared/FriendlyTimestamp';
import Spinner from '../../shared/Spinner';

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
        <Table hover>
          <thead>
            <tr>
              <th>Start Time</th>
              <th>Title</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {events &&
              Object.values(events)
                .sort((a, b) => {
                  return a.start?.seconds - b.start?.seconds;
                })
                .map((event) => {
                  const url = `/events/${event.id}`;
                  return (
                    <tr onClick={() => history.push(url)}>
                      <td>
                        {event.start && eventTimestamp(event.start.seconds)}
                      </td>
                      <td>
                        {/* TODO bug: click text link, click back, url changes to events but page doesn't */}
                        {/* <Link to={url}>{event.title}</Link> */}
                        <strong>{event.title}</strong>
                      </td>
                      <td>{event.location}</td>
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
