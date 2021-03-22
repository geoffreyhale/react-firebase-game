import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import FormLabel from 'react-bootstrap/FormLabel';
import Table from 'react-bootstrap/Table';

const EventForm = ({ addEvent }) => {
  const [autofocusRef, setAutofocusRef] = useState(React.createRef());
  const [date, setDate] = useState('');
  const [feeling, setFeeling] = useState('');
  const [identity, setIdentity] = useState('');
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [value, setValue] = useState('');
  const resetForm = () => {
    setDate('');
    setFeeling('');
    setIdentity('');
    setName('');
    setTime('');
    setValue('');
  };
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        addEvent({ date, feeling, identity, name, time, value });
        resetForm();
        autofocusRef.current.focus();
      }}
    >
      <Card>
        <Card.Body>
          <Card.Title>Add Event</Card.Title>
          <div>
            <FormLabel>Name</FormLabel>
            <Form.Control
              key="name"
              ref={autofocusRef}
              autoFocus={true}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <FormLabel>Feeling</FormLabel>
            <Form.Control
              key="feeling"
              type="text"
              value={feeling}
              onChange={(e) => setFeeling(e.target.value)}
            />
          </div>
          <div>
            <FormLabel>Identity</FormLabel>
            <Form.Control
              key="identity"
              type="text"
              value={identity}
              onChange={(e) => setIdentity(e.target.value)}
            />
          </div>
          <div className="mt-2">
            <FormLabel>
              Value <small>(-100 to 100)</small>
            </FormLabel>
            <Form.Control
              key="value"
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
          <div className="mt-2">
            <FormLabel>Date</FormLabel>
            <Form.Control
              key="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="mt-2">
            <FormLabel>Time</FormLabel>
            <Form.Control
              key="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
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
  console.log(events);
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
                <th>Time</th>
                <th>Name</th>
                <th>Feeling</th>
                <th>Identity</th>
                <th>Value</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedEventsArray.map((event) => (
                <tr>
                  <td>{event.date}</td>
                  <td>{event.time}</td>
                  <td>{event.name}</td>
                  <td>{event.feeling}</td>
                  <td>{event.identity}</td>
                  <td>{event.value}</td>
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
  const [events, setEvents] = useState({});
  const addEvent = (event) => {
    const id = Math.random();
    setEvents({ ...events, [id]: { ...event, id } });
  };
  const deleteEvent = (id) => {
    const {
      [id]: {},
      ...otherEvents
    } = events;
    setEvents(otherEvents);
  };
  return (
    <div>
      <div className="mt-3">
        <Card>
          <Card.Body>
            <Card.Title>Life Optimizer</Card.Title>
            <ul>
              <li>Add potentially repeatable peak experience events.</li>
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
      <div className="mt-3">
        <Card>
          <Card.Body>
            <Button variant="danger" onClick={() => setEvents({})}>
              Delete All Events
            </Button>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};
export default LifeOptimizer;
