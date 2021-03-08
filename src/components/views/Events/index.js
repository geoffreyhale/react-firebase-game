import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import { Link, useHistory } from 'react-router-dom';
import { getEvents } from '../../../api';
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
              <th>Title</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {events &&
              Object.values(events).map((event) => {
                const url = `/events/${event.id}`;
                return (
                  <tr onClick={() => history.push(url)}>
                    <td>
                      <Link to={url}>{event.title}</Link>
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
