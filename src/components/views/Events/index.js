import React, { useContext, useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { getEvents } from '../../../api';
import { AppContext } from '../../AppProvider';
import EventPage from './EventPage';

const EventsPage = (props) => {
  const { user } = useContext(AppContext);
  const [events, setEvents] = useState({});
  const isSingleEventPage = !!props.match.params.eventId;

  useEffect(() => {
    if (!isSingleEventPage) {
      getEvents((events) => {
        setEvents(events);
      });
    }
  }, []);

  if (isSingleEventPage) {
    return <EventPage />;
  }

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
export default withRouter(EventsPage);
