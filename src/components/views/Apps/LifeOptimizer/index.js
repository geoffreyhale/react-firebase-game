import React, { useContext, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import FormLabel from 'react-bootstrap/FormLabel';
import Table from 'react-bootstrap/Table';
import { db } from '../../../firebase';
import { AppContext } from '../../../AppProvider';

const getEvents = ({ uid }, callback) => {
  const events = {};
  db.collection('lifeOptimizerUsersData')
    .doc(uid)
    .collection('events')
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        events[doc.id] = doc.data();
        events[doc.id].id = doc.id;
      });
      callback(events);
    });
};
const upsertEvent = ({ uid, event }, callback) => {
  const eventRef = db
    .collection('lifeOptimizerUsersData')
    .doc(uid)
    .collection('events')
    .doc(event.id);
  db.collection('lifeOptimizerUsersData')
    .doc(uid)
    .collection('events')
    .doc(eventRef.id)
    .set(event)
    .then(() => {
      callback && typeof callback === 'function' && callback(eventRef.id);
    });
};
const apiDeleteEvent = ({ uid, id }, callback) => {
  db.collection('lifeOptimizerUsersData')
    .doc(uid)
    .collection('events')
    .doc(id)
    .delete()
    .then(() => {
      callback && typeof callback === 'function' && callback();
    });
};

const EventForm = ({ addEvent }) => {
  const [autofocusRef, setAutofocusRef] = useState(React.createRef());
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const resetForm = () => {
    setDate('');
    setDescription('');
  };
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        addEvent({ date, description });
        resetForm();
        autofocusRef.current.focus();
      }}
    >
      <Card>
        <Card.Body>
          <Card.Title>Add Event</Card.Title>
          <div className="mt-2">
            <FormLabel>Date</FormLabel>
            <Form.Control
              key="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <FormLabel>Description</FormLabel>
            <Form.Control
              key="name"
              ref={autofocusRef}
              autoFocus={true}
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="mt-2">
            <Button type="submit">Add Event</Button>
          </div>
        </Card.Body>
      </Card>
    </Form>
  );
};

const sortHighValue = (a, b) => b.value - a.value;
const sortLowValue = (a, b) => a.value - b.value;
const sortExtremeValue = (a, b) => Math.abs(b.value) - Math.abs(a.value);

const EventsTable = ({ events, deleteEvent }) => {
  const [sortFunction, setSortFunction] = useState(() => sortHighValue);
  const sortedEventsArray = Object.values(events).sort(sortFunction);
  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title>Sort</Card.Title>
          <Button
            variant="link"
            onClick={() => setSortFunction(() => sortHighValue)}
          >
            Positive Value
          </Button>
          <Button
            variant="link"
            onClick={() => setSortFunction(() => sortLowValue)}
          >
            Negative Value
          </Button>
          <Button
            variant="link"
            onClick={() => setSortFunction(() => sortExtremeValue)}
          >
            Extreme Value
          </Button>
        </Card.Body>
      </Card>
      <Card>
        <Card.Body>
          <Card.Title>Events</Card.Title>
          <Table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedEventsArray.map((event) => (
                <tr>
                  <td style={{ whiteSpace: 'nowrap' }}>{event.date}</td>
                  <td>{event.description}</td>
                  <td>
                    <Button
                      variant="link"
                      onClick={() => deleteEvent(event.id)}
                    >
                      delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
};

const LifeOptimizer = () => {
  const {
    user: { uid },
  } = useContext(AppContext);
  const [events, setEvents] = useState({});
  const addEvent = (event) => {
    upsertEvent({ uid, event }, (eventId) => {
      setEvents({ ...events, [eventId]: { ...event, id: eventId } });
    });
  };
  const deleteEvent = (id) => {
    apiDeleteEvent({ uid, id }, () => {
      const {
        [id]: {},
        ...otherEvents
      } = events;
      setEvents(otherEvents);
    });
  };
  useEffect(() => {
    getEvents({ uid }, (events) => {
      setEvents(events);
    });
  }, []);
  return (
    <div>
      <div className="mt-3">
        <Card>
          <Card.Body>
            <Card.Title>Life Optimizer</Card.Title>
            <ul>
              <li>Record lessons learned from peak experiences.</li>
            </ul>
          </Card.Body>
        </Card>
      </div>
      <div className="mt-3">
        <EventForm addEvent={addEvent} />
      </div>
      <div className="mt-3">
        <EventsTable events={events} deleteEvent={deleteEvent} />
      </div>
    </div>
  );
};
export default LifeOptimizer;
