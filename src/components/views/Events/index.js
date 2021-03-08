import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { getEvents } from '../../../api';

const EventsPage = () => {
  const [events, setEvents] = useState({});

  useEffect(() => {
    getEvents((events) => {
      setEvents(events);
    });
  }, []);

  return (
    <Card>
      <Card.Title>Events</Card.Title>
      {events &&
        Object.values(events).map((event) => (
          <Link to={`/events/${event.id}`}>{event.title}</Link>
        ))}
    </Card>
  );
};
export default EventsPage;
