import React, { useContext, useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import { useHistory, withRouter } from 'react-router';
import { getEvent } from '../../../api';
import { AppContext } from '../../AppProvider';
import EventPage from './EventPage';

const EventsPage = (props) => {
  const { user } = useContext(AppContext);
  const [events, setEvents] = useState({});
  const isSingleEventPage = !!props.match.params.eventId;

  // useEffect(() => {
  //   if (!isSingleEventPage) {
  //     getEvents((events) => {
  //       setEvents(events);
  //     });
  //   }
  // }, []);

  if (isSingleEventPage) {
    return <EventPage />;
  }

  return null;
};
export default withRouter(EventsPage);
